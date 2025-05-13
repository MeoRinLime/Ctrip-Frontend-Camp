import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Post } from './Post';
import { useState } from 'react';
import rejectPostDialog from './rejectPostDialog';

export function StatusCell({ row }: { row: Post }) {
  const [status, setStatus] = useState(row.status);
  const [openRejectionDialog, setOpenRejectionDialog] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState('');

  const approvePost = () => {
    console.log('Approve post');
    // After API call to the database is back,
    setStatus(APPROVED);
  };

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
          {rejectPostDialog({
            openRejectionDialog,
            setOpenRejectionDialog,
            rejectionMessage,
            setRejectionMessage,
            setStatus,
          })}
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
          {rejectPostDialog({
            openRejectionDialog,
            setOpenRejectionDialog,
            rejectionMessage,
            setRejectionMessage,
            setStatus,
          })}
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
          <div className="max-w-[150px] break-words whitespace-pre-line pl-3">
            {row.rejection_message}
          </div>
        </div>
      )}
    </div>
  );
}
