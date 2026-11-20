import React, { Fragment, useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link, useLocation, useParams } from "react-router-dom";
import { MENUITEMS, OPTometristMENUITEMS } from "../../commondata/sidemenu";
import { usePermissions } from "../../commondata/usePermissions";
import { useGetOptometristUserProfileQuery } from "../../redux/features/optometristAPIEndPoint";
import { paymentPageAllowed, paymentRequired } from "../../commondata/optometristPayment";

const Sidebar = () => {
  const { id } = useParams();
  const location = useLocation();
  const { permissions, role, country, loading } = usePermissions();
  const { data: profileResponse } = useGetOptometristUserProfileQuery(undefined, {
    skip: role !== "Optometrist",
    refetchOnMountOrArgChange: true,
  });
  const paymentLocked = role === "Optometrist" && paymentRequired(profileResponse);
  const menuSource = role === "Optometrist" ? OPTometristMENUITEMS : MENUITEMS;
  const [mainmenu, setMainMenu] = useState(menuSource);

  // Sync menu source when role changes (e.g. Optometrist vs others)
  useEffect(() => {
    setMainMenu(role === "Optometrist" ? OPTometristMENUITEMS : MENUITEMS);
  }, [role]);

  // Always run hooks
  useEffect(() => {
    const pathname = location.pathname.endsWith("/")
      ? location.pathname.slice(0, -1)
      : location.pathname;
    setNavActive(pathname);
  }, [location.pathname]);

  const isPathMatch = (pathname, pattern) => {
    if (!pathname || !pattern) return false;

    const pathSegments = pathname.split("/");
    const patternSegments = pattern.split("/");

    if (pathSegments.length !== patternSegments.length) {
      return false;
    }

    for (let i = 0; i < pathSegments.length; i++) {
      if (
        patternSegments[i] !== pathSegments[i] &&
        !patternSegments[i]?.startsWith(":")
      ) {
        return false;
      }
    }

    return true;
  };

  const setNavActive = (pathname) => {
    const updatedMenu = mainmenu.map((menu) => {
      const updatedItems = menu.Items.map((item) => {
        let isActive =
          isPathMatch(pathname, item.path) ||
          (item.related_fields &&
            item.related_fields.some((field) => isPathMatch(pathname, field)));

        if (item.children) {
          item.children.forEach((child) => {
            if (
              isPathMatch(pathname, child.path) ||
              (child.related_fields &&
                child.related_fields.some((field) => isPathMatch(pathname, field)))
            ) {
              isActive = true;
            }
          });
        }

        return {
          ...item,
          active: isActive,
          children: item.children
            ? item.children.map((child) => ({
                ...child,
                active:
                  isPathMatch(pathname, child.path) ||
                  (child.related_fields &&
                    child.related_fields.some((field) => isPathMatch(pathname, field))),
              }))
            : [],
        };
      });
      return { ...menu, Items: updatedItems };
    });

    const updatedMenuWithParents = updatedMenu.map((menu) => {
      const updatedItems = menu.Items.map((item) => {
        if (item.type === "sub" && item.children) {
          const hasActiveChild = item.children.some((child) => child.active);
          return {
            ...item,
            active: hasActiveChild || item.active,
          };
        }
        return item;
      });
      return { ...menu, Items: updatedItems };
    });

    setMainMenu(updatedMenuWithParents);
  };

  const toggletNavActive = (item) => {
    const updatedMenu = mainmenu.map((menu) => {
      const updatedItems = menu.Items.map((menuItem) => {
        if (menuItem === item) {
          return { ...menuItem, active: !menuItem.active };
        }
        if (menuItem.type === "sub" && menuItem.children) {
          return {
            ...menuItem,
            active: menuItem.active && item.type === "link",
          };
        }
        return { ...menuItem, active: false };
      });
      return { ...menu, Items: updatedItems };
    });
    setMainMenu(updatedMenu);
  };

  const shouldShowMenuItem = (menuItem, role, permissions) => {
    // Optometrist: menu is already filtered to OPTometristMENUITEMS, show all items
    if (role === "Optometrist") return true;

    // SuperAdmin without country: only allow dashboard & country-list
    if (role === "SuperAdmin" && (!country || country === "null")) {
      if (menuItem.type === "link" && menuItem.path) {
        return (
          menuItem.path === "/dashboard" ||
          menuItem.path === "/country-list"
        );
      }
      if (menuItem.type === "sub" && menuItem.children) {
        return menuItem.children.some((child) =>
          shouldShowMenuItem(child, role, permissions)
        );
      }
      return false;
    }

    // SuperAdmin with country
    if (role === "SuperAdmin" && country) {
      return true;
    }

    // for normal roles with permission
    if (menuItem.type === "sub" && menuItem.children) {
      return menuItem.children.some((child) =>
        shouldShowMenuItem(child, role, permissions)
      );
    }

    if (menuItem.permission && menuItem.model) {
      return permissions[menuItem.model]?.includes(menuItem.permission);
    }

    return true;
  };

  // render safely after hooks
  if (loading) {
    return null;
  }

  return (
    <div className="sticky">
      <aside
        className="app-sidebar"
        onMouseOver={() => document.querySelector(".app")?.classList.add("sidenav-toggled-open")}
        onMouseOut={() => document.querySelector(".app")?.classList.remove("sidenav-toggled-open")}
      >
        <PerfectScrollbar options={{ suppressScrollX: true, useBothWheelAxes: false }}>
          <div className="header side-header">
            <Link to="/dashboard" className="header-brand1 d-grid align-items-center">
              <img
                src="/vinova_logo.png"
                className="header-brand-img desktop-logo"
                alt="logo"
              />
              <img
                src="/vinova_logo.png"
                className="header-brand-img toggle-logo"
                alt="logo-1"
              />
              <img
                src="/vinova_logo.png"
                className="header-brand-img light-logo"
                alt="logo-2"
              />
              <img
                src="/vinova_logo.png"
                className="header-brand-img light-logo-testing"
                alt="logo-3"
              />
            </Link>
          </div>

          <div className="main-sidemenu mt-3">
            <ul className="side-menu" id="sidebar-main">
              {mainmenu.map((levelone, i) => (
                <Fragment key={i}>
                  {levelone.Items.map((menuItem, j) =>
                    shouldShowMenuItem(menuItem, role, permissions) ? (
                      <li
                        className={`slide ${
                          menuItem.active && menuItem.type === "sub" ? "is-expanded" : ""
                        }`}
                        key={j}
                      >
                        {menuItem.type === "link" ? (
                          paymentLocked && !paymentPageAllowed(menuItem.path) ? (
                            <span
                              className="side-menu__item"
                              aria-disabled="true"
                              title="Complete your plan payment to open this page"
                              style={{ opacity: 0.45, cursor: "not-allowed" }}
                            >
                              <i className={`side-menu__icon fe fe-${menuItem.icon}`}></i>
                              <span className="side-menu__label">{menuItem.title}</span>
                            </span>
                          ) : (
                          <Link
                            to={menuItem.path}
                            className={`side-menu__item ${menuItem.active ? "active" : ""}`}
                            onClick={() => {
                              setNavActive(menuItem.path);
                              toggletNavActive(menuItem);
                            }}
                          >
                            <i className={`side-menu__icon fe fe-${menuItem.icon}`}></i>
                            <span className="side-menu__label">{menuItem.title}</span>
                          </Link>
                          )
                        ) : (
                          <Link
                            to="#"
                            className={`side-menu__item ${menuItem.active ? "active" : ""}`}
                            onClick={(e) => {
                              e.preventDefault();
                              toggletNavActive(menuItem);
                            }}
                          >
                            <i className={`side-menu__icon fe fe-${menuItem.icon}`}></i>
                            <span className="side-menu__label">{menuItem.title}</span>
                            <i
                              className={`angle fe ${
                                menuItem.active ? "fe-chevron-down" : "fe-chevron-up"
                              }`}
                            ></i>
                          </Link>
                        )}
                        {menuItem.type === "sub" && menuItem.children && (
                          <ul className={`slide-menu ${menuItem.active ? "open" : ""}`}>
                            {menuItem.children.map((child, k) =>
                              shouldShowMenuItem(child, role, permissions) ? (
                                <li key={k}>
                                  <Link
                                    to={child.path}
                                    className={`slide-item ${child.active ? "active" : ""}`}
                                    onClick={() => {
                                      setNavActive(child.path);
                                      toggletNavActive(menuItem);
                                    }}
                                  >
                                    {child.title}
                                  </Link>
                                </li>
                              ) : null
                            )}
                          </ul>
                        )}
                      </li>
                    ) : null
                  )}
                </Fragment>
              ))}
            </ul>
          </div>
        </PerfectScrollbar>
      </aside>
    </div>
  );
};

export default Sidebar;
