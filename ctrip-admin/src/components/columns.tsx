import { ColumnDef } from '@tanstack/react-table';
import { StatusCell } from './status';
import { Post } from './Post';

export const columns: ColumnDef<Post>[] = [
  {
    id: 'post',
    header: 'Post',
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-3">
          <img src={row.original.image} alt="Post" className="w-16 h-16 rounded-md" />
          <div>
            <div className="text-sm font-medium text-gray-900">{row.original.title}</div>
            <div className="text-sm text-gray-500">{row.original.content}</div>
          </div>
        </div>
      );
    }
  },
  {
    id: 'actions',
    // header: 'Status',
    cell: ({ row }) => {
      return <StatusCell row={row.original} />;
    },
  },
];
