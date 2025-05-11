import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Post } from "./Post";
import { useState } from "react";

export function StatusCell({ row }: { row: Post }) {
  const [status, setStatus] = useState(row.status);

  const approvePost = () => {
    console.log("Approve post");
    // After API call to the database is back,
    setStatus(APPROVED);
  };

  const rejectPost = () => {
    console.log("Reject post");
    
    // After API call to the database is back,
    setStatus(REJECTED);
  };

  return (
    <div>
      {status === PENDING ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">Pending</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={approvePost}>Approve</DropdownMenuItem>
            <DropdownMenuItem onSelect={rejectPost}>Reject...</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : status === APPROVED ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="approval">Approved</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={rejectPost}>Reject...</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="destructive">Rejected</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={approvePost}>Approve</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        &nbsp;&nbsp;{row.rejection_message}
        </div>
      )}
    </div>
  );
}