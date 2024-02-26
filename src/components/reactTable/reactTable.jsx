  import React, { useState, useMemo } from "react";
  import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    createColumnHelper,
  } from "@tanstack/react-table";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import {
    faBackward,
    faCaretLeft,
    faCaretRight,
    faForward,
    faMagnifyingGlass,
  } from "@fortawesome/free-solid-svg-icons";
  import "./reactTable.css"

  export const DataTable = ({ columns, data }) => {
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");

    const table = useReactTable({
      data: useMemo(() => data, [data]),
      rows: data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: {
        sorting: sorting,
        globalFilter: filtering,
      },
      onSortingChange: setSorting,
      onGlobalFilterChange: setFiltering,
    });

    return (
      <>
        <div className="tablaa">
          <div className="got t-bg">
            <table border={1} className="data-table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={header.column.className}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {renderSortingEmoji(header.column)}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="searching"></div>
        <div className="data-table-btn">
          <input
            type="text"
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            placeholder="🔍  Search "
            className="search-in"
          />
          {renderPaginationButtons(table)}
          <span>
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
        </div>
      </>
    );
  };

  const renderSortingEmoji = (column) => {
    const sortingEmoji = {
      asc: "    ⬆️",
      desc: "    ⬇️",
      default: "    🔃",
    };

    return sortingEmoji[column.getIsSorted() || "default"];
  };

  const renderPaginationButtons = (table) => (
    <>
      <button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.setPageIndex(0)}
      >
        <FontAwesomeIcon icon={faBackward} />
      </button>
      <button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        <FontAwesomeIcon icon={faCaretLeft} />
      </button>
      <button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
        <FontAwesomeIcon icon={faCaretRight} />
      </button>
      <button
        disabled={!table.getCanNextPage()}
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
      >
        <FontAwesomeIcon icon={faForward} />
      </button>
    </>
  );