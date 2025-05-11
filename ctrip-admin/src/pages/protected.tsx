import { Post, columns } from '@/components/columns';
import { DataTable } from '@/components/data-table';

// should be async
function getData(): Post[] {
  return [
    {
      postid: 1,
      title: 'Post 1',
      content: 'This is the content of post 1',
      status: PENDING,
      deleted: false,
    },
    {
      postid: 2,
      title: 'Post 2',
      content: 'This is the content of post 2',
      status: APPROVED,
      deleted: false,
    },
    {
      postid: 3,
      title: 'Post 3',
      content: 'This is the content of post 3',
      status: REJECTED,
      rejection_message: 'Inappropriate content',
      deleted: false,
    },
  ];
}

export default function Protected() {
  const data = getData();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
