import { ColumnDef } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export type Post = {
  postid: number;
  title: string;
  content: string;
  status: number;
  deleted: boolean; // whether or not deleted by administrator
};

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'content',
    header: 'Content',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      return (
        <div>
          {status === PENDING ? (
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pending approval" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="APPROVED">Approve</SelectItem>
                  <SelectItem value="REJECTED">Reject</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : status === APPROVED ? (
            <Badge variant="approval" className="w-[180px]">
              Approved
            </Badge>
          ) : (
            <Badge variant="destructive" className="w-[180px]">
              Rejected
            </Badge>
          )}
        </div>
      );
    },
  },
];
