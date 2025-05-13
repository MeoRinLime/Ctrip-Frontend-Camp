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

interface rejectPostDialogProp {
  openRejectionDialog: boolean;
  setOpenRejectionDialog: React.Dispatch<React.SetStateAction<boolean>>;
  rejectionMessage: string;
  setRejectionMessage: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<React.SetStateAction<number>>;
}

function rejectPostDialog({
  openRejectionDialog,
  setOpenRejectionDialog,
  rejectionMessage,
  setRejectionMessage,
  setStatus,
}: rejectPostDialogProp) {
  const rejectPost = () => {
    console.log('Reject post:', rejectionMessage);
    // After API call to the database is back,
    setStatus(REJECTED);
    setOpenRejectionDialog(false);
    setRejectionMessage('');
  };

  return (
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
}

export default rejectPostDialog;
