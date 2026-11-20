import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MENUITEMS, OPTometristMENUITEMS } from "../../commondata/sidemenu";
import { usePermissions } from "../../commondata/usePermissions";
import { useGetOptometristUserProfileQuery } from "../../redux/features/optometristAPIEndPoint";
import { paymentPageAllowed, paymentRequired } from "../../commondata/optometristPayment";
import { hasPermission, isFullAccess } from "../../commondata/permissions";

const cleanPath = (path) => String(path || "").trim();

const normalizePath = (path) => {
  const cleaned = cleanPath(path).split("?")[0].split("#")[0];
  if (cleaned.length > 1 && cleaned.endsWith("/")) return cleaned.slice(0, -1);
  return cleaned;
};

const canShow = (item, { role, country, permissions }) => {
  if (role === "Optometrist") return true;

  if (role === "SuperAdmin" && (!country || country === "null")) {
    if (item.type === "link" && item.path) {
      const path = normalizePath(item.path);
      return path === "/dashboard" || path === "/country-list";
    }
    if (item.type === "sub" && item.children) {
      return item.children.some((child) => canShow(child, { role, country, permissions }));
    }
    return false;
  }

  if (isFullAccess(role, country)) return true;

  if (item.type === "sub" && item.children) {
    return item.children.some((child) => canShow(child, { role, country, permissions }));
  }

  if (item.permission && item.model) {
    return hasPermission(role, permissions, item.model, item.permission);
  }

  return false;
};

const collectPages = (menu, access, paymentLocked) => {
  const pages = [];
  menu.forEach((group) => {
    (group.Items || []).forEach((item) => {
      if (!canShow(item, access)) return;
      if (item.type === "link" && item.path && !(paymentLocked && !paymentPageAllowed(item.path))) {
        pages.push({ title: item.title, group: "", path: cleanPath(item.path), icon: item.icon });
      }
      if (item.type === "sub") {
        (item.children || []).forEach((child) => {
          if (!child.path || !canShow(child, access)) return;
          if (paymentLocked && !paymentPageAllowed(child.path)) return;
          pages.push({
            title: child.title,
            group: item.title,
            path: cleanPath(child.path),
            icon: item.icon,
          });
        });
      }
    });
  });
  return pages;
};

export default function HeaderMenuSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { permissions, role, country } = usePermissions();
  const { data: profileResponse } = useGetOptometristUserProfileQuery(undefined, {
    skip: role !== "Optometrist",
  });
  const paymentLocked = role === "Optometrist" && paymentRequired(profileResponse);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const activeRef = useRef(null);

  const pages = useMemo(() => {
    const menu = role === "Optometrist" ? OPTometristMENUITEMS : MENUITEMS;
    return collectPages(menu, { role, country, permissions }, paymentLocked);
  }, [role, country, permissions, paymentLocked]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return pages
      .filter((page) => `${page.title} ${page.group}`.toLowerCase().includes(term))
      .slice(0, 8);
  }, [pages, query]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const item = activeRef.current;
    const list = item?.closest(".header-menu-search__results");
    if (!item || !list) return;
    const itemRect = item.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    if (itemRect.top < listRect.top) {
      list.scrollTop -= listRect.top - itemRect.top;
    } else if (itemRect.bottom > listRect.bottom) {
      list.scrollTop += itemRect.bottom - listRect.bottom;
    }
  }, [active, results]);

  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [location.pathname]);

  const go = (path) => {
    const search = location.search || "";
    navigate(`${path}${search}`);
    setOpen(false);
    setQuery("");
  };

  const showResults = open && query.trim().length > 0;
  const activeIndex = results.length === 0 ? -1 : Math.min(active, results.length - 1);

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!showResults || results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (Math.min(current, results.length - 1) + 1) % results.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => (Math.min(current, results.length - 1) - 1 + results.length) % results.length);
    }
    if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      go(results[activeIndex].path);
    }
  };

  return (
    <div className={`header-menu-search ${open ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="header-menu-search__toggle"
        aria-label="Search pages"
        onClick={() => setOpen((current) => !current)}
      >
        <i className="fe fe-search"></i>
      </button>
      <label className="header-menu-search__field">
        <i className="fe fe-search" aria-hidden="true"></i>
        <input
          type="search"
          value={query}
          placeholder="Search pages"
          aria-label="Search pages"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
      </label>
      {showResults && (
        <div className="header-menu-search__results" role="listbox">
          {results.length === 0 ? (
            <div className="header-menu-search__empty">No matching pages</div>
          ) : (
            results.map((page, index) => (
              <button
                type="button"
                key={`${page.group}-${page.path}`}
                className={`header-menu-search__result${index === activeIndex ? " is-active" : ""}`}
                role="option"
                aria-selected={index === activeIndex}
                ref={index === activeIndex ? activeRef : null}
                onMouseEnter={() => setActive(index)}
                onClick={() => go(page.path)}
              >
                <span className="header-menu-search__mark">
                  <i className={`fe fe-${page.icon || "file"}`} aria-hidden="true"></i>
                </span>
                <span>
                  <strong>{page.title}</strong>
                  {page.group ? <small>{page.group}</small> : null}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
