import { columns } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import { Post } from '@/components/Post';

// should be async
function getData(): Post[] {
  return [
    {
      postid: 1,
      image:
        'https://www.bing.com/images/search?view=detailV2&ccid=TjBNXWlI&id=DAA54DD99CAE13A90F6034B4795B219B918CAE39&thid=OIP.TjBNXWlIeS008Y7zpTr31gHaE8&mediaurl=https%3a%2f%2fget.pxhere.com%2fphoto%2fbeach-sea-coast-nature-ocean-horizon-sunshine-sun-sunrise-sunset-sunlight-morning-dawn-dusk-evening-sunny-happiness-afterglow-raising-sun-raise-red-sky-at-morning-656678.jpg&exph=2304&expw=3456&q=imag&simid=607992264391416358&FORM=IRPRST&ck=EB5B9820045DE15D11494D606BC70120&selectedIndex=2&itb=0',
      title: '游记1',
      content: '这是游记1',
      status: PENDING,
      deleted: false,
    },
    {
      postid: 2,
      image:
        'https://www.bing.com/images/search?view=detailV2&ccid=TjBNXWlI&id=DAA54DD99CAE13A90F6034B4795B219B918CAE39&thid=OIP.TjBNXWlIeS008Y7zpTr31gHaE8&mediaurl=https%3a%2f%2fget.pxhere.com%2fphoto%2fbeach-sea-coast-nature-ocean-horizon-sunshine-sun-sunrise-sunset-sunlight-morning-dawn-dusk-evening-sunny-happiness-afterglow-raising-sun-raise-red-sky-at-morning-656678.jpg&exph=2304&expw=3456&q=imag&simid=607992264391416358&FORM=IRPRST&ck=EB5B9820045DE15D11494D606BC70120&selectedIndex=2&itb=0',
      title: '游记2',
      content: '这是游记2',
      status: APPROVED,
      deleted: false,
    },
    {
      postid: 3,
      image:
        'https://www.bing.com/images/search?view=detailV2&ccid=TjBNXWlI&id=DAA54DD99CAE13A90F6034B4795B219B918CAE39&thid=OIP.TjBNXWlIeS008Y7zpTr31gHaE8&mediaurl=https%3a%2f%2fget.pxhere.com%2fphoto%2fbeach-sea-coast-nature-ocean-horizon-sunshine-sun-sunrise-sunset-sunlight-morning-dawn-dusk-evening-sunny-happiness-afterglow-raising-sun-raise-red-sky-at-morning-656678.jpg&exph=2304&expw=3456&q=imag&simid=607992264391416358&FORM=IRPRST&ck=EB5B9820045DE15D11494D606BC70120&selectedIndex=2&itb=0',
      title: '游记',
      content: '这是游记3',
      status: REJECTED,
      rejection_message: '内容引起不适',
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
