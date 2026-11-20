import React, { useMemo } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../layouts/layoutcomponents/loader";
import { openModal } from "../redux/slices/allModalSlice";
import toast from "react-hot-toast";
import { useGetAllQuestionsQuery, useUpdateQuestionStatusMutation } from "../redux/features/questionsAPIEndPoint";
import { ListFilters, ListTable, STATUS_FILTERS, StatusSwitch, boundFilters, formatDate, indexColumn, useListFilters } from "../components/common/ListFilters";

const FILTER_KEYS = ["category", "status"];
const CATEGORIES = [
  { value: "frame", label: "Frame" },
  { value: "sunglasses", label: "Sunglasses" },
  { value: "contact_lens", label: "Contact Lens" },
];

function readQuestions(response) {
  const payload = response?.data;
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const total = Number(payload?.total ?? payload?.pagination?.total);
  return { rows, total: Number.isFinite(total) ? total : rows.length };
}

export const QuestionDataTable = () => {
  const dispatch = useDispatch();
  const list = useListFilters(FILTER_KEYS);
  const { data, isLoading, isFetching, refetch } = useGetAllQuestionsQuery(list.query, { skip: list.skip });
  const [updateStatus, { isLoading: loadingStatus }] = useUpdateQuestionStatusMutation();
  const { rows, total } = readQuestions(data);

  const handleStatus = async (id) => {
    try {
      const resp = await updateStatus(id);
      if (resp?.data?.http_status_code === 200) {
        refetch();
        toast.success(resp?.data?.message);
      } else {
        toast.error(resp?.data?.message);
      }
    } catch (err) {
      toast.error(err?.message);
    }
  };

  const columns = useMemo(() => [
    indexColumn(list.currentPage, list.pageSize, true),
    { id: "category", label: "Category", minWidth: 150, flex: 0.6, render: (row) => row?.category || "" },
    { id: "text", label: "Text", minWidth: 220, flex: 1.4, render: (row) => row?.text || "" },
    {
      id: "status",
      label: "Status",
      width: 120,
      sortable: false,
      filterable: false,
      render: (row) => <StatusSwitch checked={row?.status} onChange={() => handleStatus(row?.id)} />,
    },
    { id: "date", label: "Created At", minWidth: 190, flex: 0.8, render: (row) => formatDate(row?.createdAt) },
    {
      id: "action",
      label: "Action",
      width: 200,
      align: "center",
      sortable: false,
      filterable: false,
      render: (row) => (
        <div className="action_icon_wrapper d-flex justify-content-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
            <Link to={`/question/view/${row?.id}`}><Button className="btn btn-icon btn-primary me-2"><i className="fe fe-eye"></i></Button></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
            <Link to={`/question/edit/${row?.id}`}><Button type="button" className="btn btn-icon btn-warning me-2" variant=""><i className="fe fe-edit"></i></Button></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Button type="button" className="btn btn-icon btn-danger" variant="" onClick={() => dispatch(openModal({ componentName: "DeleteQuestion", data: row, softDelete: true }))}><i className="fe fe-trash text-white"></i></Button>
          </OverlayTrigger>
        </div>
      ),
    },
  ], [list.currentPage, list.pageSize, dispatch]);

  return (
    <>
      {(isLoading || isFetching || loadingStatus) && <Loader />}
      <div className="e-table pb-5">
        <ListFilters
          {...boundFilters(list, {
            placeholder: "Category or text",
            selects: [
              { label: "Category", value: list.filters.category, onChange: (value) => list.setFilter("category", value), empty: "All categories", options: CATEGORIES },
              { label: "Status", value: list.filters.status, onChange: (value) => list.setFilter("status", value), options: STATUS_FILTERS },
            ],
          })}
        />
        <ListTable columns={columns} rows={rows} total={total} page={list.currentPage} pageSize={list.pageSize} onPagination={list.onPaginationModelChange} emptyLabel="No questions found" getRowHeight={() => "auto"} />
      </div>
    </>
  );
};
