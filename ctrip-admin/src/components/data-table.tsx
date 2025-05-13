import {
  ColumnDef,
  ColumnFiltersState,
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import rejectPostDialog from './rejectPostDialog';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [status, setStatus] = useState(0); // temporary
  const [openRejectionDialog, setOpenRejectionDialog] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { columnFilters, rowSelection },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div>
      <div className="flex py-4 space-x-4">
        {table.getSelectedRowModel().rows.length > 0 && (
          <>
            <Button variant="extremely_destructive">批量删除</Button>
            <Button variant="approval">批量通过</Button>
            <Button variant="destructive" onClick={() => setOpenRejectionDialog(true)}>
              批量拒绝
            </Button>
            {rejectPostDialog({
              openRejectionDialog,
              setOpenRejectionDialog,
              rejectionMessage,
              setRejectionMessage,
              setStatus,
            })}
          </>
        )}
        <div className="flex-1" />
        <Select
          onValueChange={(value) => {
            setColumnFilters(
              value === 'All'
                ? []
                : [
                    {
                      id: 'status',
                      value: parseInt(value),
                    },
                  ]
            );
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="按状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">按状态筛选</SelectItem>
            <SelectItem value="0">待审核</SelectItem>
            <SelectItem value="1">已通过</SelectItem>
            <SelectItem value="2">未通过</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          {/* <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader> */}
          <TableBody>
            {table.getFilteredRowModel().rows?.length ? (
              table.getFilteredRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row
                    .getVisibleCells()
                    // @ts-expect-error Hidden might report as undefined.
                    .filter((cell) => !cell.column.columnDef.meta?.hidden)
                    .map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize ? cell.column.getSize() : undefined }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  无搜索结果。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          上一页
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          下一页
        </Button>
      </div>
    </div>
  );
}
