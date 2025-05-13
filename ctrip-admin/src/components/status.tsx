import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Post } from './Post';
import { useState } from 'react';
import {
  AlertDialog,
  // AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

export function StatusCell({ row }: { row: Post }) {
  const [status, setStatus] = useState(row.status);
  const [openRejectionDialog, setOpenRejectionDialog] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState('');

  const approvePost = () => {
    console.log('Approve post');
    // After API call to the database is back,
    setStatus(APPROVED);
  };

  const rejectPost = () => {
    console.log('Reject post:', rejectionMessage);
    // After API call to the database is back,
    setStatus(REJECTED);
    setOpenRejectionDialog(false);
    setRejectionMessage('');
  };

  const rejectAlertDialog = (
    <AlertDialog open={openRejectionDialog} onOpenChange={setOpenRejectionDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>拒绝该游记</AlertDialogTitle>
          <AlertDialogDescription>
            <Textarea
              placeholder="拒绝原因"
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setRejectionMessage('')}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={rejectPost}>确认拒绝</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div>
      {status === PENDING ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">待审核</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={approvePost}>通过</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setOpenRejectionDialog(true)}>
                拒绝...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {rejectAlertDialog}
        </>
      ) : status === APPROVED ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="approval">已通过</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setOpenRejectionDialog(true)}>
                拒绝...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {rejectAlertDialog}
        </>
      ) : (
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="destructive">未通过</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={approvePost}>通过</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="max-w-[100px] break-words whitespace-pre-line pl-3">
            {row.rejection_message}
          </div>
        </div>
      )}
    </div>
  );
}
