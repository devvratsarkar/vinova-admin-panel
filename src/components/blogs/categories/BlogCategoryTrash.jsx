import React, { useState } from "react";
import { Button, OverlayTrigger, Tooltip, Row, Col, Form, Card, } from "react-bootstrap";
import { useDispatch } from "react-redux";
import DataTable from '../../common/DataTable'
import { Link } from "react-router-dom";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import { useGetAllBlogsCategoryTrashQuery } from "../../../redux/features/getApiSecond";
import { openModal } from "../../../redux/slices/allModalSlice";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";

export default function BlogCategoryTrash() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetAllBlogsCategoryTrashQuery()

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
        selector: (row) => row?.id,
        sortable: true,
      },
      {
        name: "Name",
        sortable: true,
        cell: (row) => (<div>{row?.category_name}</div>)
      },
      {
        name: "Image",
        sortable: true,
        cell: (row) => (<img src={row?.banner_image} alt="error" height={75} width={75} />)
      },
      {
        name: "Description",
        selector: (row) => row?.description,
        cell: (row) => (<div className="" dangerouslySetInnerHTML={{ __html: row.description }}></div>)
      },
      {
        name: "Slug",
        selector: (row) => row?.slug,
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="action_icon_wrapper">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Delete</Tooltip>}
            >
              <Button
                className="btn btn-icon btn-danger text-light"
                variant=""
                onClick={() => {
                  dispatch(openModal({ componentName: "DeleteBlogCategory", data: row, softDelete: false }));
                }}
              >
                <i className="fa fa-trash"></i>
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Restore</Tooltip>}>
              <Button
                className="btn btn-icon btn-warning text-light"
                variant=""
                onClick={() => {
                  dispatch(
                    openModal({
                      componentName: "RestoreBlogCategory",
                      data: row,
                    })
                  );
                }}
              >
                <i className="fe fe-rotate-ccw"></i>

              </Button>
            </OverlayTrigger>
          </div>
        ),
      },
    ];

    const blogCategoryData = data?.data;
    const filteredData = blogCategoryData?.filter((item) =>
      item?.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Row className="align-items-center">
          <Col>
            <PageHeader
              titles="Blog Categories"
              active="Blog categories Trash"
              items={["Home", "Blog Categories List"]}
              links={["/dashboard", `/all-blog-categories`]}
            />
          </Col>
          <Col className="text-end">
            <Link to={`/all-blog-categories`} className="btn btn-success text-white me-3" >View All Blog Category</Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Body className="data_table">
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

                  <DataTable data={currentItems} columns={COLUMNS} striped fixedHeader />
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
          </Col>
        </Row>
      </>
    );
  }
}