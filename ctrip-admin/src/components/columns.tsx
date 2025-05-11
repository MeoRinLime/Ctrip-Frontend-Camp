import { ColumnDef } from '@tanstack/react-table';
import { StatusCell } from './status';
import { Post } from './Post';

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
    id: 'actions',
    header: 'Status',
    cell: ({ row }) => {
      return <StatusCell row={row.original} />;
    },
  },
];
