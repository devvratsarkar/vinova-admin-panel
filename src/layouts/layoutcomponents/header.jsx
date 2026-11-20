import React, { useEffect, useRef, useState } from "react";
import {
  Dropdown,
  Navbar,
  Container,
  Button,
  Form,
  ListGroup,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/brand/logo.png";
import HeaderMenuSearch from "./HeaderMenuSearch";
import { useDispatch } from "react-redux";
import { logoutSuccess, setCountryCode } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import { openModal } from "../../redux/slices/allModalSlice";
import { jwtDecode } from 'jwt-decode';
import { usePermissions } from "../../commondata/usePermissions";
// import { useGetAllCoutriesQuery } from "../../redux/features/currencyCountryAPIEndPoint";
import { useGetGlobalSettingQuery } from "../../redux/features/globalSettingEndPoints";
import { catalogueSlice } from "../../redux/services/catalogueSlice";
import { setLanguages } from "../../redux/slices/languageSlice";
import { languageMap } from "../../commondata/languageMap";
import { useSelector } from "react-redux";
import useLangTabs from "../../hooks/useLangTabs";
import LiveClock from "./LiveClock";
import "./header.css";
import { useGetUserProfileQuery } from "../../redux/features/commonApiCall";
import { useGetOptometristUserProfileQuery, usePayOptometristPlanMutation } from "../../redux/features/optometristAPIEndPoint";
import { openPaymentLink, paymentLink, paymentRequired, planRenewDue } from "../../commondata/optometristPayment";
import RenewPlanModal from "../../components/optometrist-dashboard/membership/RenewPlanModal";

const countryData = [
  {
    code: "AE",
    name: "UAE",
    flag: "https://flagcdn.com/w40/ae.png",
  },
  {
    code: "IR",
    name: "Iran",
    flag: "https://flagcdn.com/w40/ir.png",
  },
  {
    code: "GB",
    name: "UK",
    flag: "https://flagcdn.com/w40/gb.png",
  },
];
export default function Header() {
  const { role, country, setCountry } = usePermissions();
  const navigate = useNavigate();
  
  const { data: userProfileData } = useGetUserProfileQuery(undefined, { skip: role === "Optometrist" });
  const { data: optometristProfileData } = useGetOptometristUserProfileQuery(undefined, { skip: role !== "Optometrist" });
  const data = role === "Optometrist" ? optometristProfileData : userProfileData;
  const dispatch = useDispatch();
  const adminData = data?.data?.userData
  const needsPayment = role === "Optometrist" && paymentRequired(data)
  const showRenew = role === "Optometrist" && !needsPayment && planRenewDue(adminData)
  const [renewOpen, setRenewOpen] = useState(false)
  const [payPlan, { isLoading: isRenewing }] = usePayOptometristPlanMutation()

  const startRenew = async () => {
    const returnUrl = `${window.location.origin}${(import.meta.env.BASE_URL || '').replace(/\/$/, '')}/optometrist-dashboard/overview`
    const result = await payPlan({ return_url: returnUrl })
    if (result?.error) {
      toast.error(typeof result.error === 'string' ? result.error : 'Could not start payment')
      return
    }
    const link = paymentLink(result?.data)
    if (!link) {
      toast.error(result?.data?.message || 'Could not start payment')
      return
    }
    openPaymentLink(link)
  }

  const [selectedCountry, setSelectedCountry] = useState(
    localStorage.getItem("country") || ""
  );
  const { data: gRes, isSuccess } = useGetGlobalSettingQuery();
  const gData = gRes?.data;
  const totalLanguages = useSelector((state) => state.language.totalLanguages);
  const { activeTab, setActiveTab } = useLangTabs(totalLanguages);
  const location = useLocation();
  const prevLangRef = useRef(null);

  // SuperAdmin: when lang in URL changes, reset API cache so requests refetch with new lang
  useEffect(() => {
    if (role !== "SuperAdmin") return;
    const urlLang = new URLSearchParams(location.search).get("lang");
    const hadLang = prevLangRef.current;
    const langActuallyChanged = hadLang && urlLang && hadLang !== urlLang;
    if (langActuallyChanged) {
      dispatch(catalogueSlice.util.resetApiState());
    }
    prevLangRef.current = urlLang;
  }, [role, location.search, dispatch]);

  // Sync selectedCountry when country changes from usePermissions (e.g. fetchPermissions)
  useEffect(() => {
    if (country && country !== selectedCountry) {
      setSelectedCountry(country);
    }
  }, [country]);


  const token = localStorage.getItem("token")
  if (!token) {
    navigate("/");
  } else {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {

        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }


  //full screen
  function Fullscreen() {
    if (
      (document.fullScreenElement && document.fullScreenElement === null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)
    ) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  // Darkmode
  // const DarkMode = () => {
  //   const body = document.querySelector("body");
  //
  //   if (body?.classList.contains("dark-mode")) {
  //     body.classList.remove("dark-mode");
  //     localStorage.setItem("zanexlightmode", "true");
  //     localStorage.setItem("zanexdarkmode", "false");
  //   } else {
  //     body.classList.add("dark-mode");
  //     localStorage.setItem("zanexdarkmode", "true");
  //     localStorage.setItem("zanexlightmode", "false");
  //   }
  // };

  //leftsidemenu
  const openCloseSidebar = () => {
    document.querySelector(".app")?.classList.toggle("sidenav-toggled");
  };
  //rightsidebar
  const openCloseSidebarright = () => {
    document.querySelector(".sidebar-right")?.classList.toggle("sidebar-open");
  };

  const handleLogout = () => {
    dispatch(logoutSuccess())
    toast.success('Logged out successfully!');
    navigate('/')
  }

  const handleSelect = (countryCode) => {
    const selected = countryData.find((c) => c.code === countryCode);
    setSelectedCountry(selected.code);
    localStorage.setItem("country", selected.code);
    dispatch(setCountryCode(selected.code));
    setCountry?.(selected.code);

    // SuperAdmin: set lang in URL for new country and reload
    const languagesForCountry = languageMap[selected.code] || languageMap.AE;
    const firstLang = languagesForCountry[0]?.code || "en";
    const url = new URL(window.location.href);
    url.searchParams.set("lang", firstLang);
    window.location.href = url.toString();
  };

  const selectedCountryData = countryData.find(
    (c) => c.code === selectedCountry
  );

  // Effective country: use selected country from dropdown (synced with country switch)
  const effectiveCountry = selectedCountry || country;

  useEffect(() => {
    if (isSuccess && gData?.language) {
      const languagesForCountry = languageMap[effectiveCountry] || languageMap.AE;

      // ✅ Derive totalLanguages from languageMap[country] filtered by configured languages in gData
      const convertedLanguages = languagesForCountry
        .filter((lang) => gData.language.includes(lang.value))
        .map((lang) => ({ code: lang.code, name: lang.value }));

      // If no overlap, fall back to all languages for this country
      const finalLanguages =
        convertedLanguages.length > 0
          ? convertedLanguages
          : languagesForCountry.map((lang) => ({ code: lang.code, name: lang.value }));

      dispatch(setLanguages(finalLanguages));
    }
  }, [isSuccess, gData, effectiveCountry, dispatch]);

  // Switch active tab when totalLanguages changes (e.g. after country switch) if current lang is no longer valid
  useEffect(() => {
    if (totalLanguages?.length > 0) {
      const isCurrentLangValid = totalLanguages.some((lang) => lang.code === activeTab);
      if (!isCurrentLangValid) {
        setActiveTab(totalLanguages[0].code);
      }
    }
  }, [totalLanguages, activeTab, setActiveTab]);


  return (
    <>
    <RenewPlanModal show={renewOpen} profile={data} onClose={() => setRenewOpen(false)} />
    <Navbar expand="lg" className="app-header header sticky">
      <Container fluid className="main-container">
        <div className="d-flex align-items-center w-100">
          <Link
            aria-label="Hide Sidebar"
            className="app-sidebar__toggle"
            to="#"
            onClick={() => openCloseSidebar()}
          ></Link>
          <div className="responsive-logo">
            <Link
              to={`${import.meta.env.BASE_URL}dashboard/`}
              className="header-logo"
            >
              <img
                src={logo}
                className="mobile-logo dark-logo-1"
                alt="logo"
              />
            </Link>
          </div>


          <div className="d-flex align-items-center order-lg-2 ms-auto header-right-icons gap-2">

            {role === "SuperAdmin" && (
              <>
                <div className="country-dropdown-wrapper">
                  <Dropdown align="start">
                    <Dropdown.Toggle
                      id="country-menu"
                      className="country-dropdown position-relative"
                    >
                      {selectedCountryData ? (
                        <div className="d-flex align-items-center country-flag-wrapper">
                          <img
                            src={selectedCountryData.flag}
                            alt={selectedCountryData.name}
                            className="me-2"
                          />
                          <span className="country-name">{selectedCountryData.name}</span>
                        </div>
                      ) : (
                        "Select Country"
                      )}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="custom-dropdown-menu country-menu">
                      {countryData.map((country) => (
                        <Dropdown.Item
                          key={country.code}
                          onClick={() => handleSelect(country.code)}
                          active={country.code === effectiveCountry}
                        >
                          <img src={country.flag} alt="" />
                          <span>{country.name}</span>
                          {country.code === effectiveCountry && (
                            <i className="fe fe-check country-check" aria-hidden="true"></i>
                          )}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="language-dropdown-wrapper">
                  <Dropdown align="start">
                    <Dropdown.Toggle
                      id="language-menu"
                      className="country-dropdown position-relative"
                    >
                      {activeTab?.toUpperCase()}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="custom-dropdown-menu">
                      {totalLanguages && totalLanguages?.length > 0 && totalLanguages?.map((lang, index) => (
                        <Dropdown.Item
                          key={index}
                          active={lang.code === activeTab}
                          onClick={() => setActiveTab(lang.code)}
                        >
                          {lang.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </>
            )}

            <LiveClock />

            <div className="navbar navbar-collapse responsive-navbar p-0 d-none d-lg-flex">
              <Navbar.Collapse
                className="navbar-collapse"
                id="navbarSupportedContent-4"
              >
                <div className="d-flex order-lg-2 align-items-center">
                  {(needsPayment || showRenew) && (
                    <button
                      type="button"
                      onClick={() => (needsPayment ? startRenew() : setRenewOpen(true))}
                      disabled={isRenewing}
                      className="flex-shrink-0"
                      style={{ height: 36, marginRight: 8, padding: '0 12px', border: 0, borderRadius: 8, background: '#293896', color: '#fff', fontSize: 13, fontWeight: 600, lineHeight: '36px', whiteSpace: 'nowrap' }}
                    >
                      {isRenewing ? 'Starting...' : needsPayment ? 'Pay' : 'Renew'}
                    </button>
                  )}
                  {/* <div className="dropdown d-md-flex">
                    <Link
                      to="#"
                      className="nav-link icon theme-layout nav-link-bg layout-setting"
                      onClick={() => DarkMode()}
                    >
                      <span className="dark-layout">
                        <i className={`fe ${"fe-moon"}`}></i>
                      </span>
                      <span className="light-layout">
                        <i className={`fe ${"fe-sun"}`}></i>
                      </span>
                    </Link>
                  </div> */}
                  <div className="dropdown d-md-flex">
                    <Link
                      to="#"
                      className="nav-link icon full-screen-link nav-link-bg"
                      onClick={Fullscreen}
                    >
                      <i className="fe fe-minimize fullscreen-button"></i>
                    </Link>
                  </div>
                  <Dropdown className="d-md-flex notifications">
                    <Dropdown.Menu
                      className=" dropdown-menu-end dropdown-menu-arrow "
                      style={{ margin: 0 }}
                    >
                      <div className="drop-heading border-bottom">
                        <div className="d-flex">
                          <h6 className="mt-1 mb-0 fs-16 fw-semibold">
                            You have Notification
                          </h6>
                          <div className="ms-auto">
                            <span className="badge bg-success rounded-pill">
                              3
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="notifications-menu">
                        <Link
                          className="dropdown-item d-flex"
                          to={`${import.meta.env.BASE_URL
                            }components/defaultchat/`}
                        >
                          <div className="me-3 notifyimg  bg-primary-gradient brround box-shadow-primary">
                            <i className="fe fe-message-square"></i>
                          </div>
                          <div className="mt-1">
                            <h5 className="notification-label mb-1">
                              New review received
                            </h5>
                            <span className="notification-subtext">
                              2 hours ago
                            </span>
                          </div>
                        </Link>
                        <Link
                          className="dropdown-item  d-flex"
                          to={`${import.meta.env.BASE_URL
                            }components/defaultchat/`}
                        >
                          <div className="me-3 notifyimg  bg-secondary-gradient brround box-shadow-primary">
                            <i className="fe fe-mail"></i>
                          </div>
                          <div className="mt-1">
                            <h5 className="notification-label mb-1">
                              New Mails Received
                            </h5>
                            <span className="notification-subtext">
                              1 week ago
                            </span>
                          </div>
                        </Link>
                        <Link
                          className="dropdown-item  d-flex"
                          to={`${import.meta.env.BASE_URL
                            }pages/e-commerce/shoppingcart/`}
                        >
                          <div className="me-3 notifyimg  bg-success-gradient brround box-shadow-primary">
                            <i className="fe fe-shopping-cart"></i>
                          </div>
                          <div className="mt-1">
                            <h5 className="notification-label mb-1">
                              New Order Received
                            </h5>
                            <span className="notification-subtext">
                              1 day ago
                            </span>
                          </div>
                        </Link>
                      </div>
                      <div className="dropdown-divider m-0"></div>
                      <Link
                        to="#"
                        className=" dropdown-item text-center p-3 text-muted"
                      >
                        View all Notification
                      </Link>
                    </Dropdown.Menu>
                  </Dropdown>

                </div>
              </Navbar.Collapse>
            </div>
            <HeaderMenuSearch />
            <Dropdown className="profile-1 header-profile">
              <Dropdown.Toggle
                className="nav-link profile leading-none d-flex px-1"
                variant=""
              >
                <span>
                  <img
                    src={adminData?.profile_pic}
                    alt="profile-user"
                    className="avatar profile-user brround cover-image"
                  />
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="dropdown-menu-end header-profile-menu"
                style={{ margin: 0 }}
              >
                <div className="drop-heading">
                  <div className="text-start">
                    <h5 className="text-dark mb-0">{adminData?.name}</h5>
                    <small className="text-muted">Admin</small>
                  </div>
                </div>
                <div className="dropdown-divider m-0"></div>
                <Link
                  className="dropdown-item"
                  to={`/profile`}
                >
                  <i className="dropdown-icon fe fe-user"></i> Profile
                </Link>
                <button
                  className="dropdown-item"
                  onClick={() => { dispatch(openModal({ componentName: "ChangePassword" })) }}
                >
                  <i className="dropdown-icon fe fe-lock"></i> Change Password
                </button>
                <div className="dropdown-item cursor-pointer" onClick={() => handleLogout()} >
                  <i className="dropdown-icon fe fe-alert-circle"></i>
                  Sign out
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Container>
    </Navbar>
    </>
  );
}