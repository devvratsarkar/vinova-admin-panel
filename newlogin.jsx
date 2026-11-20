import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap"
import { useFormik } from "formik"
import * as Yup from "yup"
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi"
import { toast, Toaster } from "react-hot-toast"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../../assets/css/authLogin.css"
import { Imagesdata } from "../../commondata/commonimages"

const mockDispatch = (action) => console.log("Dispatched:", action)
const mockSetPermissions = (permissions) => console.log("Set permissions:", permissions)
const mockSetRole = (role) => console.log("Set role:", role)
const mockRefetch = () => console.log("Refetched user profile")

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [IP, setIP] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        document.body.classList.add("login-img")
        return () => {
            document.body.classList.remove("login-img")
        }
    }, [])

    // Fetch IP address
    useEffect(() => {
        const fetchIP = async () => {
            try {
                const response = await axios.get("https://api.ipify.org?format=json")
                setIP(response.data.ip)
            } catch (error) {
                console.error("Error fetching IP:", error)
            }
        }
        fetchIP()
    }, [])

    // Form validation schema
    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().required("Password is required"),
    })

    // Initialize formik
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            IP: IP,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                setLoading(true)
                // Replace with your actual API call
                const res = await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            data: {
                                http_status_code: 200,
                                message: "Login successful",
                                data: {
                                    token: "mock-token-123",
                                    role: "admin",
                                    permissions: ["read", "write", "delete"],
                                },
                            },
                        })
                    }, 1500)
                })

                if (res.data.http_status_code === 200) {
                    const { token, role, permissions } = res.data.data

                    // Set permissions and role
                    mockSetPermissions(permissions)
                    mockSetRole(role)

                    // Navigate to dashboard
                    navigate("/dashboard")

                    // Show success message
                    toast.success(res.data.message)

                    // Dispatch login success action
                    mockDispatch({ type: "loginSuccess", payload: token })

                    // Store role and permissions in localStorage
                    localStorage.setItem("role", role)
                    localStorage.setItem("permissions", JSON.stringify(permissions))

                    // Refetch user profile
                    mockRefetch()
                }
            } catch (error) {
                console.error(error)
                toast.error(error?.response?.data?.message || "Login failed")
            } finally {
                setLoading(false)
            }
        },
    })

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <Container fluid className="container admin-login-container p-0 h-auto d-grid align-items-center">
            <Toaster position="top-right" />
            <Row className="g-0 h-auto">
                <Col lg={7} className="d-none d-lg-block p-0">
                    <div className="login-banner">
                        <div className="login-banner-content">
                            <h1 className="display-4 text-white mb-4 fw-bold">Welcome Back</h1>
                            <p className="lead text-white-50 mb-5">
                                Log in to access your admin dashboard and manage your application.
                            </p>
                            <div className="login-features">
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M20.24 12.24C21.3658 11.1142 21.9983 9.58722 21.9983 7.99504C21.9983 6.40285 21.3658 4.87588 20.24 3.75004C19.1142 2.62419 17.5872 1.9917 15.995 1.9917C14.4028 1.9917 12.8758 2.62419 11.75 3.75004L5 10.5V19H13.5L20.24 12.24Z"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M16 8L2 22"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M17.5 15H9"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="feature-text">
                                        <h5 className="text-white">Secure Access</h5>
                                        <p className="text-white-50">End-to-end encrypted connection</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M12 6V12L16 14"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="feature-text">
                                        <h5 className="text-white">Real-time Updates</h5>
                                        <p className="text-white-50">Instant data synchronization</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M22 4L12 14.01L9 11.01"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div className="feature-text">
                                        <h5 className="text-white">Advanced Analytics</h5>
                                        <p className="text-white-50">Comprehensive data insights</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="login-banner-overlay"></div>
                    </div>
                </Col>

                <Col lg={5} md={12} className="d-flex align-items-center justify-content-center">
                    <div className="login-form-container">
                        <div className="text-center mb-4">
                            <img src={Imagesdata("vinova_logo")} alt="Company Logo" className="login-logo mb-4" />
                            <h2 className="fw-bold">Admin Login</h2>
                            <p className="text-muted">Enter your credentials to access your account</p>
                        </div>

                        <Card className="login-card">
                            <Card.Body className="p-4">
                                <Form onSubmit={formik.handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <div className="input-group-custom">
                                            <div className="input-icon">
                                                <FiMail />
                                            </div>
                                            <Form.Control
                                                type="email"
                                                placeholder="Email address"
                                                name="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                isInvalid={formik.touched.email && formik.errors.email}
                                                className="form-control-lg"
                                            />
                                        </div>
                                        {formik.touched.email && formik.errors.email && (
                                            <Form.Control.Feedback type="invalid" className="d-block">
                                                {formik.errors.email}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <div className="input-group-custom">
                                            <div className="input-icon">
                                                <FiLock />
                                            </div>
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                name="password"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                isInvalid={formik.touched.password && formik.errors.password}
                                                className="form-control-lg"
                                            />
                                            <div className="password-toggle" onClick={togglePasswordVisibility}>
                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                            </div>
                                        </div>
                                        {formik.touched.password && formik.errors.password && (
                                            <Form.Control.Feedback type="invalid" className="d-block">
                                                {formik.errors.password}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>

                                    <Row className="mb-4 align-items-center">
                                        <Col>
                                            <Form.Check type="checkbox" id="rememberMe" label="Remember me" className="remember-me" />
                                        </Col>
                                        <Col className="text-end">
                                            <a href="/reset-password" className="forgot-password">
                                                Forgot Password?
                                            </a>
                                        </Col>
                                    </Row>

                                    <Button variant="primary" type="submit" className="w-100 btn-lg login-btn" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="me-2"
                                                />
                                                Signing in...
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>

                        <div className="text-center mt-4">
                            <p className="text-muted">© {new Date().getFullYear()} Bytelogic Technologies. All rights reserved.</p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default AdminLogin
