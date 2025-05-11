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
          <AlertDialogTitle>Reject Post</AlertDialogTitle>
          <AlertDialogDescription>
            <Textarea
              placeholder="Reason to reject"
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setRejectionMessage('')}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={rejectPost}>Reject</AlertDialogAction>
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
              <Button variant="outline">Pending</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={approvePost}>Approve</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setOpenRejectionDialog(true)}>
                Reject...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {rejectAlertDialog}
        </>
      ) : status === APPROVED ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="approval">Approved</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setOpenRejectionDialog(true)}>
                Reject...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {rejectAlertDialog}
        </>
      ) : (
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="destructive">Rejected</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={approvePost}>Approve</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="max-w-[200px] break-words whitespace-pre-line pl-3">
            {row.rejection_message}
          </div>
        </div>
      )}
    </div>
  );
}
