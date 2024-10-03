"use client";

import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Column<T> = {
  header: string;
  key: keyof T;
  render: (item: T) => React.ReactNode;
};

type DataTableProps<T extends object> = {
  data?: T[]; // Made optional to handle cases where no data is provided
  columns: Column<T>[];
  caption?: string;
  actions?: (item: T) => React.ReactNode;
};

const DataTable = <T extends object>({
  data = [], // Default to an empty array if not provided
  columns,
  caption,
  actions,
}: DataTableProps<T>) => {
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={String(column.key)}>{column.header}</TableHead>
          ))}
          {actions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={String(column.key)}>{column.render(item)}</TableCell>
            ))}
            {actions && <TableCell>{actions(item)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
