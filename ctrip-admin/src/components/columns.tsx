import { ColumnDef } from '@tanstack/react-table';
import { StatusCell } from './status';
import { Post } from './Post';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<Post>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    },
  },
  {
    id: 'actions',
    // header: 'Status',
    cell: ({ row }) => {
      return (
        <div className="max-w-[100px]">
          <StatusCell row={row.original} />
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    filterFn: 'equals',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return value === 0 ? 'Pending' : value === 1 ? 'Approved' : 'Rejected';
    },
    meta: {
      hidden: true,
    },
  },
];
