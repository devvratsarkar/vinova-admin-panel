import React, { useState } from 'react'
import { Button, Card, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { openModal } from '../../../redux/slices/allModalSlice'
import Loader from '../../../layouts/layoutcomponents/loader'
import DataTable from '../../common/DataTable'
import { Link } from 'react-router-dom'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import { useGetAllBlogsCommentsQuery, useUpdateCommentStatusMutation } from '../../../redux/features/getApiSecond'
import toast from 'react-hot-toast'
import moment from 'moment'
import Error from '../../../layouts/layoutcomponents/Error'

export default function Comments() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [serialNnumber, setSerialNnumber] = useState(1)
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetAllBlogsCommentsQuery();

  const [updateStatusData, { isLoading: loadingStatusUpdate }] = useUpdateCommentStatusMutation()

  const handleStatusChange = async (id, status) => {
    try {
      const resp = await updateStatusData({ id: id, formData: { status } })
      if (resp?.data?.http_status_code === 200) {
        refetch()
        toast.success(resp?.data?.message)
      } else {
        toast.error(resp?.data?.message)
      }
    } catch (err) {
      toast.error(err?.message)
    }
  }

  if (isLoading || isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <Error error_mes={error} />;
  }

  if (isSuccess) {
    const COLUMNS = [
      {
        name: "#",
        selector: (row, index) => index + serialNnumber,
        sortable: true,
        width: "70px"
      },
      {
        name: "User Name",
        selector: (row) => row?.name,
        sortable: true,
        width: "150px"
      },
      {
        name: "Email",
        selector: (row) => row?.email,
        sortable: true,
        width: "250px"
      },
      // {
      //   name: "Comment",
      //   selector: (row) => row?.comment,
      //   sortable: true,
      //   wrap: true,
      //    width:"250px"
      // },
      {
        name: "Website",
        selector: (row) => row?.website ? (
          <a href={row?.website} target="_blank" rel="noopener noreferrer">
            Click Here
          </a>
        ) : null,
        sortable: true,
        width: "150px"
      },
      {
        name: "Created At",
        selector: (row) => row?.createdAt ? moment(row?.createdAt).format("DD-MM-YYYY, hh:mm A") : null,
        sortable: true,
        width: "250px"
      },
      {
        name: "Status",
        sortable: true,
        cell: (row) => (
          row?.status == null ? (
            <Form.Select onChange={(e) => handleStatusChange(row?.id, e.target.value)}>
              <option >Pending</option>
              <option value={true}>Accept</option>
              <option value={false}>Reject</option>
            </Form.Select>
          ) : row?.status == true ? (
            <p className='text-success'>Accepted</p>
          ) : (
            <p className='text-danger'>Rejected</p>
          )
        )
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="action_icon_wrapper">
            <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
              <Button
                type="button"
                className="btn btn-icon btn-primary"
                variant=""
                onClick={() => {
                  dispatch(openModal({
                    componentName: 'ViewComment',
                    data: row
                  }))
                }}
              >
                <i className="fe fe-eye"></i>
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <Button
                type="button"
                className="btn btn-icon btn-danger text-light"
                variant=""
                onClick={() => {
                  dispatch(openModal({
                    componentName: 'DeleteComment',
                    data: row?._id
                  }))
                }}
              >
                <i className="fe fe-trash"></i>
              </Button>
            </OverlayTrigger>
          </div>
        ),
      },
    ];
    const commetData = Array.isArray(data?.data) ? data.data : [];
    const filteredData = commetData?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const itemsPerPage = pageSize;
    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

    const displayPages = () => {
      const pageButtons = [];
      const delta = 2;
      const left = currentPage - delta;
      const right = currentPage + delta + 1;

      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= left && i < right)) {
          pageButtons.push(
            <li key={i} className={currentPage === i ? "active" : ""}>
              <Button className="btn btn-default" variant={currentPage === i ? "primary" : "default"} onClick={() => paginate(i)}>
                {i}
              </Button>
            </li>
          );
        } else if (i === left - 1 || i === right + 1) {
          pageButtons.push(<li key={i} className="ellipsis_pagination">......</li>);
        }
      }
      return pageButtons;
    };
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
    const prevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
    const handlePageSizeChange = (e) => {
      const newSize = parseInt(e.target.value, 10);
      setPageSize(newSize);
      setCurrentPage(1);
    };

    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    };

    return (
      <>
        {
          loadingStatusUpdate && <Loader />
        }
        <Row className='align-items-center'>
          <Col>
            <PageHeader titles="Blog Comments" active="Blog Comments List" items={["Home"]} links={["/dashboard"]} />
          </Col>
          <Col className='text-end'>
            {/* <Button className='btn btn-success me-3' variant='' onClick={() => { dispatch(openModal({ componentName: 'AddBlogTags' })) }}>Add New Blog Tag </Button> */}
            {/* <Link to={`/all-blog-tags/trash`} className="btn btn-danger">Trash</Link> */}
          </Col>
        </Row>
        <Row>
          <Card className='data_table'>
            <Card.Body>
              <div className="e-table pb-5 table-responsive">
                <Row className="m-5">
                  <Col as={Col} sm={9}>
                    <span>Show</span>
                    <select className="mx-2" value={pageSize} onChange={handlePageSizeChange}>
                      {[10, 25, 50].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <span>Entries</span>
                  </Col>
                  <Col as={Col} sm={3}>
                    <Form.Group className="mx-3">
                      <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
                    </Form.Group>
                  </Col>
                </Row>
                <DataTable data={currentItems} columns={COLUMNS} striped />
                <div className="pagination_wrapper">
                  <ul className="pagination">
                    <li>
                      <Button className="btn btn-default" variant="default" onClick={prevPage}>
                        <i className="fa fa-angle-left"></i> Previous
                      </Button>
                    </li>
                    {displayPages()}
                    <li>
                      <Button className="btn btn-default" variant="default" onClick={nextPage}>
                        Next <i className="fa fa-angle-right"></i>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Row>
      </>
    )
  }
}
