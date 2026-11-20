import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePermissions } from "../commondata/usePermissions";

/**
 * For SuperAdmin: syncs active language tab with the URL (?lang=xx).
 * For other roles: local state only, no URL or API lang.
 * @param {Array} totalLanguages - list of available languages [{ code, name }]
 * @returns {Object} { activeTab, setActiveTab }
 */
export default function useLangTabs(totalLanguages = []) {
  const { role } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const isSuperAdmin = role === "SuperAdmin";

  const params = new URLSearchParams(location.search);
  const urlLang = isSuperAdmin ? params.get("lang") : null;
  const defaultLang = urlLang || totalLanguages[0]?.code || "en";

  const [activeTab, setActiveTab] = useState(defaultLang);
  const activeTabRef = useRef(activeTab);
  const locationRef = useRef(location);
  activeTabRef.current = activeTab;
  locationRef.current = location;

  // SuperAdmin only: write the tab into the URL when the tab itself changes.
  // Do not depend on location.state. navigate() clones state into a new object,
  // and that new object was re-running this effect forever (and flipping ?lang=).
  useEffect(() => {
    if (!isSuperAdmin || !activeTab) return;
    if (typeof localStorage !== "undefined") localStorage.setItem("lang", activeTab);

    const current = locationRef.current;
    const searchParams = new URLSearchParams(current.search);
    if (searchParams.get("lang") === activeTab) return;

    searchParams.set("lang", activeTab);
    navigate(
      { pathname: current.pathname, search: `?${searchParams.toString()}` },
      { replace: true, state: current.state }
    );
  }, [isSuperAdmin, activeTab, navigate]);

  // SuperAdmin only: follow the URL (back/forward or an external lang change).
  // Read the tab from a ref so this does not also run when the tab changes,
  // which would undo the country language correction and start another rewrite.
  useEffect(() => {
    if (!isSuperAdmin) return;
    const lang = new URLSearchParams(location.search).get("lang");
    if (lang && lang !== activeTabRef.current) setActiveTab(lang);
  }, [isSuperAdmin, location.search]);

  return { activeTab, setActiveTab };
}
