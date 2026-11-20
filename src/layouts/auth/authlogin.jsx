import React, { useState, Fragment, useEffect } from "react";
import { Button, Card, Col, Form, Nav, Row, Tab } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { UserLoginSchema } from "../../commondata/formvalidations";
import Loader from "../layoutcomponents/loader";
import { publicRequest } from "../../utils/baseApi";
import toast, { ToastBar } from "react-hot-toast";
import { loginSuccess } from "../../redux/slices/authSlice";
import axios from "axios";

function Authlogin() {
  const [IP, setIP] = useState("")

  const [showPassword, setShowPassword] = useState(false);

  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  // const RouteChange = () => {
  //   let path = `/dashboard`;
  //   navigate(path);
  // }
  document.querySelector("body").classList.add("login-img");

  useEffect(() => {
    const fetchIP = async (req, resp) => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setIP(response.data.ip);
      } catch (error) {
        console.error('error', error);
      }
    }
    fetchIP()
  }, [])

  const getTimezone = () => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch {
      return '';
    }
  };

  const initialValues = {
    email: "",
    password: "",
    IP: IP,
    timezone: getTimezone()
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, setValues } =
    useFormik({
      initialValues: initialValues,
      validationSchema: UserLoginSchema,
      onSubmit: async (values) => {
        try {
          setLoader(true)
          const res = await publicRequest.post("/login", values);
          if (res.data.http_status_code === 200) {
            const { role, country_code } = res.data.data;
            // SuperAdmin: include lang in URL so first get-user/get-global request has lang (avoids duplicate calls)
            const isSuperAdmin = role === "SuperAdmin";
            const langParam = isSuperAdmin
              ? `?lang=${new URLSearchParams(location.search).get("lang") || localStorage.getItem("lang") || "en"}`
              : "";
            const dashboardPath = role === "Optometrist" ? "/optometrist-dashboard/overview" : `/dashboard${langParam}`;
            navigate(dashboardPath);

            setLoader(false)
            toast.success(res.data.message)
            dispatch(loginSuccess({
              token: res.data.data.token,
              role: res?.data?.data?.role,
              permissions: JSON.stringify(res?.data?.data?.permissions),
              country_code,
            }));
          }
        } catch (error) {
          console.error('error ----->', error);
          setLoader(false)
          console.log(Date());
          toast.error(error.response.data.message)
        }
      }
    });

  useEffect(() => {
    setValues(prevValues => ({
      ...prevValues,
      IP,
      timezone: getTimezone()
    }));
  }, [IP, setValues]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {loader && <Loader />}
      <Row>
        <Col lg={4} md={6} sm={8} xs={11} className="d-block mx-auto">
          <Card>
            <div className="text-center mt-3">
              <img
                src="/vinova_logo.png"
                className="header-brand-img"
                alt=""
              />
            </div>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <span className="login100-form-title">Login</span>
                <Row className="mb-3">
                  <Form.Group>
                    <div className="input-icon">
                      <span className="input-icon-addon">
                        <i
                          className="fe fe-mail fs-5"
                          style={{ fontWeight: 500 }}
                        ></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                    </div>
                    {errors.email && touched.email ? (
                      <p className={`error`}>{errors.email}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group>
                    <div className="input-icon">
                      <span
                        className="input-icon-addon pe-auto"
                        style={{ cursor: "pointer" }}
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <FiEye size={20} />
                        ) : (
                          <FiEyeOff size={20} />
                        )}
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                      />
                    </div>
                    {errors.password && touched.password ? (
                      <p className={`error`}>{errors.password}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-3 text-end m-0">
                </Row>
                <Row className="mb-3">
                  <Col as={Col} md={6}></Col>
                  <Col as={Col} md={6} className="text-end text-primary">
                    <Link to={"/reset-password"}>
                      Forgot Password?
                    </Link>
                  </Col>
                </Row>
                <Row className="mb-3 m-0">
                  <Button
                    type="submit"
                    className="btn btn-primary"
                    variant="primary"
                  >
                    Login
                  </Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Authlogin;
