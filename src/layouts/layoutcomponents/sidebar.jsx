import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MENUITEMS, OPTometristMENUITEMS } from "../../commondata/sidemenu";
import { usePermissions } from "../../commondata/usePermissions";
import { useGetOptometristUserProfileQuery } from "../../redux/features/optometristAPIEndPoint";
import { paymentPageAllowed, paymentRequired } from "../../commondata/optometristPayment";
import { hasPermission, isFullAccess } from "../../commondata/permissions";
import "./sidebar.css";

const cleanPath = (path) => String(path || "").trim();

const normalizePath = (path) => {
  const cleaned = cleanPath(path).split("?")[0].split("#")[0];
  if (cleaned.length > 1 && cleaned.endsWith("/")) return cleaned.slice(0, -1);
  return cleaned;
};

const pathMatches = (pathname, pattern) => {
  const current = normalizePath(pathname);
  const target = normalizePath(pattern);
  if (!current || !target) return false;

  const currentSegments = current.split("/");
  const targetSegments = target.split("/");
  if (currentSegments.length !== targetSegments.length) return false;

  return targetSegments.every(
    (segment, index) => segment.startsWith(":") || segment === currentSegments[index]
  );
};

const itemMatchesPath = (pathname, item) => {
  if (!item) return false;
  if (pathMatches(pathname, item.path)) return true;
  return (item.related_fields || []).some((field) => pathMatches(pathname, field));
};

const Sidebar = () => {
  const location = useLocation();
  const { permissions, role, country, loading } = usePermissions();
  const { data: profileResponse } = useGetOptometristUserProfileQuery(undefined, {
    skip: role !== "Optometrist",
    refetchOnMountOrArgChange: true,
  });
  const paymentLocked = role === "Optometrist" && paymentRequired(profileResponse);
  const menuSource = role === "Optometrist" ? OPTometristMENUITEMS : MENUITEMS;
  const pathname = normalizePath(location.pathname);
  const [manualOpen, setManualOpen] = useState(null);
  const [routeCollapsed, setRouteCollapsed] = useState(false);

  const routeSection = useMemo(() => {
    for (const group of menuSource) {
      for (const item of group.Items || []) {
        if (item.type !== "sub") continue;
        if ((item.children || []).some((child) => itemMatchesPath(pathname, child))) {
          return item.title;
        }
      }
    }
    return null;
  }, [menuSource, pathname]);

  useEffect(() => {
    setManualOpen(null);
    setRouteCollapsed(false);
  }, [pathname, role]);

  useEffect(() => {
    const menu = document.querySelector(".vinova-sidebar__menu");
    const activeItem = menu?.querySelector(".slide-item.active, .side-menu__item.active");
    if (!menu || !activeItem) return;

    const header = menu.parentElement?.querySelector(".side-header");
    const menuRect = menu.getBoundingClientRect();
    const visibleTop = Math.max(menuRect.top, header?.getBoundingClientRect().bottom ?? menuRect.top);
    const itemRect = activeItem.getBoundingClientRect();

    if (itemRect.top < visibleTop + 4) {
      menu.scrollTop = Math.max(0, menu.scrollTop - (visibleTop - itemRect.top) - 8);
    } else if (itemRect.bottom > menuRect.bottom - 4) {
      menu.scrollTop += itemRect.bottom - menuRect.bottom + 8;
    }
  }, [pathname, role, routeSection]);

  const isSectionOpen = (title) => {
    if (title === routeSection) return !routeCollapsed;
    return manualOpen === title;
  };

  const toggleSection = (title) => {
    if (title === routeSection) {
      setRouteCollapsed((collapsed) => !collapsed);
      setManualOpen(null);
      return;
    }
    setManualOpen((current) => (current === title ? null : title));
    if (routeSection) setRouteCollapsed(true);
  };

  const shouldShowMenuItem = (menuItem) => {
    if (role === "Optometrist") return true;

    if (role === "SuperAdmin" && (!country || country === "null")) {
      if (menuItem.type === "link" && menuItem.path) {
        const path = normalizePath(menuItem.path);
        return path === "/dashboard" || path === "/country-list";
      }
      if (menuItem.type === "sub" && menuItem.children) {
        return menuItem.children.some((child) => shouldShowMenuItem(child));
      }
      return false;
    }

    if (isFullAccess(role, country)) return true;

    if (menuItem.type === "sub" && menuItem.children) {
      return menuItem.children.some((child) => shouldShowMenuItem(child));
    }

    if (menuItem.permission && menuItem.model) {
      return hasPermission(role, permissions, menuItem.model, menuItem.permission);
    }

    return false;
  };

  if (loading) return null;

  const renderLocked = (menuItem, className) => (
    <span
      className={`${className} vinova-sidebar__locked`}
      aria-disabled="true"
      title="Complete your plan payment to open this page"
    >
      {menuItem.icon ? <i className={`side-menu__icon fe fe-${menuItem.icon}`}></i> : null}
      {menuItem.icon ? <span className="side-menu__label">{menuItem.title}</span> : menuItem.title}
    </span>
  );

  return (
    <div className="sticky">
      <aside
        className="app-sidebar vinova-sidebar"
        onMouseEnter={() => document.querySelector(".app")?.classList.add("sidenav-toggled-open")}
        onMouseLeave={() => document.querySelector(".app")?.classList.remove("sidenav-toggled-open")}
      >
        <div className="header side-header">
          <Link to="/dashboard" className="header-brand1 d-grid align-items-center">
            <img src="/vinova_logo.png" className="header-brand-img desktop-logo" alt="Vinova" />
            <img src="/vinova_logo.png" className="header-brand-img toggle-logo" alt="" />
            <img src="/vinova_logo.png" className="header-brand-img light-logo" alt="" />
            <img src="/vinova_logo.png" className="header-brand-img light-logo-testing" alt="" />
          </Link>
        </div>

        <div className="main-sidemenu vinova-sidebar__menu">
          <ul className="side-menu" id="sidebar-main">
            {menuSource.map((group, groupIndex) => (
              <Fragment key={group.menutitle || groupIndex}>
                {group.Items.map((menuItem, itemIndex) => {
                  if (!shouldShowMenuItem(menuItem)) return null;
                  const itemKey = `${groupIndex}-${menuItem.title}-${itemIndex}`;

                  if (menuItem.type === "link") {
                    const active = itemMatchesPath(pathname, menuItem);
                    const locked = paymentLocked && !paymentPageAllowed(menuItem.path);
                    return (
                      <li className="slide" key={itemKey}>
                        {locked ? (
                          renderLocked(menuItem, "side-menu__item")
                        ) : (
                          <Link
                            to={cleanPath(menuItem.path)}
                            className={`side-menu__item ${active ? "active" : ""}`}
                            aria-current={active ? "page" : undefined}
                          >
                            <i className={`side-menu__icon fe fe-${menuItem.icon}`}></i>
                            <span className="side-menu__label">{menuItem.title}</span>
                          </Link>
                        )}
                      </li>
                    );
                  }

                  const children = (menuItem.children || []).filter((child) => shouldShowMenuItem(child));
                  const open = isSectionOpen(menuItem.title);
                  const childActive = children.some((child) => itemMatchesPath(pathname, child));

                  return (
                    <li className={`slide ${open ? "is-expanded" : ""}`} key={itemKey}>
                      <button
                        type="button"
                        className={`side-menu__item vinova-sidebar__toggle ${childActive ? "has-active" : ""}`}
                        aria-expanded={open}
                        onClick={() => toggleSection(menuItem.title)}
                      >
                        <i className={`side-menu__icon fe fe-${menuItem.icon}`}></i>
                        <span className="side-menu__label">{menuItem.title}</span>
                        <i className={`angle fe ${open ? "fe-chevron-down" : "fe-chevron-right"}`}></i>
                      </button>
                      {open && (
                        <ul className="slide-menu">
                          {children.map((child) => {
                            const active = itemMatchesPath(pathname, child);
                            const locked = paymentLocked && !paymentPageAllowed(child.path);
                            return (
                              <li key={cleanPath(child.path) || child.title}>
                                {locked ? (
                                  renderLocked(child, "slide-item")
                                ) : (
                                  <Link
                                    to={cleanPath(child.path)}
                                    className={`slide-item ${active ? "active" : ""}`}
                                    aria-current={active ? "page" : undefined}
                                  >
                                    {child.title}
                                  </Link>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </Fragment>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
