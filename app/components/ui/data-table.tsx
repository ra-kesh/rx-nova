import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: keyof T;
    cell?: (item: T) => React.ReactNode;
  }[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { _id: string }>({
  data,
  columns,
  searchable = false,
  searchKeys = [],
  actions,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredData = React.useMemo(() => {
    if (!searchQuery || !searchKeys.length) return data;

    return data.filter((item) =>
      searchKeys.some((key) =>
        String(item[key] || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery, searchKeys]);

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.accessorKey)}>
                  {column.header}
                </TableHead>
              ))}
              {actions && <TableHead className="w-[80px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item._id}>
                {columns.map((column) => (
                  <TableCell key={String(column.accessorKey)}>
                    {column.cell
                      ? column.cell(item)
                      : String(item[column.accessorKey] || "")}
                  </TableCell>
                ))}
                {actions && <TableCell>{actions(item)}</TableCell>}
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
