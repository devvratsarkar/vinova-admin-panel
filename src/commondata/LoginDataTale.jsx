import React, { useMemo } from "react";
import { useGetLoginDataQuery } from "../redux/features/popUpEndpoints";
import Loader from "../layouts/layoutcomponents/loader";
import Error from "../layouts/layoutcomponents/Error";
import { ListFilters, ListTable, boundFilters, indexColumn, readList, useListFilters } from "../components/common/ListFilters";

export default function LoginDataTale() {
  const list = useListFilters();
  const { data, isError, error, isLoading, isFetching } = useGetLoginDataQuery(list.query, {
    skip: list.skip,
    refetchOnMountOrArgChange: true,
  });
  const { rows, total } = readList(data);

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize),
    { id: "name", label: "Name", minWidth: 160, flex: 1, render: (row) => row?.name || "N/A" },
    { id: "email", label: "Email", minWidth: 220, flex: 1.2, render: (row) => row?.email || "N/A" },
    { id: "phone", label: "Phone Number", minWidth: 150, flex: 0.8, nowrap: true, render: (row) => row?.phone_number || "N/A" },
    { id: "ip", label: "IP", minWidth: 140, flex: 0.7, nowrap: true, render: (row) => row?.IP || "N/A" },
    { id: "createdAt", label: "Created At", minWidth: 200, flex: 0.9, nowrap: true, render: (row) => row?.createdAt || "N/A" },
  ], [list.currentPage, list.pageSize]);

  return (
    <>
      {(isLoading || isFetching) && <Loader />}
      {isError && <Error error_mes={error} />}
      <div className="e-table pb-5">
        <ListFilters {...boundFilters(list, { placeholder: "Name, email, phone, or IP" })} />
        <ListTable
          columns={columns}
          rows={rows}
          total={total}
          page={list.currentPage}
          pageSize={list.pageSize}
          onPagination={list.onPaginationModelChange}
          emptyLabel="No login records"
        />
      </div>
    </>
  );
}
