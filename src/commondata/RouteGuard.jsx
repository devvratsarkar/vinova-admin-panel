import React, { useEffect, useRef } from "react";
import { usePermissions } from "./usePermissions";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useGetOptometristUserProfileQuery } from "../redux/features/optometristAPIEndPoint";
import { paymentPageAllowed, paymentRequired } from "./optometristPayment";

const baseUrl = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

/** Paths only the Optometrist role can access (without base). SuperAdmin/others are redirected. */
const OPTOMETRIST_ONLY_PATHS = [
    "/optometrist-dashboard/overview",
    "/optometrist-dashboard/profile",
    "/optometrist-dashboard/services",
    "/optometrist-dashboard/working-rules",
    "/optometrist-dashboard/availability",
    "/optometrist-dashboard/appointments",
    "/optometrist-dashboard/customers",
    "/optometrist-dashboard/prescriptions",
    "/optometrist-dashboard/memberships-plans",
    "/optometrist-dashboard/plan-history",
    "/optometrist-dashboard/transactions",
    "/optometrist-dashboard/wallet",
];

function getCurrentPath(pathname, baseUrl) {
    const normalized = pathname.replace(/\/$/, "") || "/";
    if (!baseUrl) return normalized;
    const withoutBase = normalized.replace(new RegExp(`^${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), "") || "/";
    return withoutBase;
}

function isOptometristRoute(currentPath) {
    return OPTOMETRIST_ONLY_PATHS.some((p) => currentPath === p);
}

const RouteGuard = ({ children, requiredPermissions = [] }) => {
    const { permissions, role, loading, country } = usePermissions();
    const location = useLocation();
    const navigate = useNavigate();


    const toastShownRef = useRef(false);
    const { data: profileResponse, isLoading: profileLoading } = useGetOptometristUserProfileQuery(undefined, {
        skip: role !== "Optometrist" || loading,
        refetchOnMountOrArgChange: true,
    });
    const paymentLocked = role === "Optometrist" && paymentRequired(profileResponse);
    const overviewPath = "/optometrist-dashboard/overview";

    // Block non-Optometrist (e.g. SuperAdmin) from Optometrist routes; require login for those routes
    useEffect(() => {
        if (loading || (role === "Optometrist" && profileLoading && !profileResponse)) return;

        const currentPath = getCurrentPath(location.pathname, baseUrl);

        if (isOptometristRoute(currentPath)) {
            if (role !== "Optometrist") {
                if (!toastShownRef.current) {
                    toast.error("You don't have access to this page.");
                    toastShownRef.current = true;
                }
                if (!role) {
                    navigate(baseUrl ? `${baseUrl}` : "/", { replace: true });
                } else {
                    const dashboardPath = baseUrl ? `${baseUrl}/dashboard` : "/dashboard";
                    navigate(dashboardPath, { replace: true });
                }
                return;
            }
            if (paymentLocked && !paymentPageAllowed(currentPath)) {
                if (!toastShownRef.current) {
                    toast.error("Complete your plan payment to open this page.");
                    toastShownRef.current = true;
                }
                navigate(baseUrl ? `${baseUrl}${overviewPath}` : overviewPath, { replace: true });
                return;
            }
            toastShownRef.current = false;
            return;
        }

        if (role === "Optometrist") {
            const isAllowed = OPTOMETRIST_ONLY_PATHS.some((p) => currentPath === p) || paymentPageAllowed(currentPath);
            if (!isAllowed) {
                if (!toastShownRef.current) {
                    toast.error("You don't have access to this page.");
                    toastShownRef.current = true;
                }
                const dashboardPath = baseUrl ? `${baseUrl}/optometrist-dashboard/overview` : "/optometrist-dashboard/overview";
                navigate(dashboardPath, { replace: true });
                return;
            }
            toastShownRef.current = false;
            return;
        }

        if (role === "SuperAdmin" && (!country || country === "null")) {
            const allowedPaths = [
                "/dashboard",
                "/country-list"
            ];

            const currentPath = location.pathname;

            const isAllowed = allowedPaths.some((path) => {
                const regexPath = path.replace(/:\w+/g, "[^/]+");
                const matchRegex = new RegExp(`^${regexPath}$`);
                return matchRegex.test(currentPath);
            });

            if (!isAllowed) {
                if (!toastShownRef.current) {
                    toast.error("Please select a country before accessing this page.");
                    toastShownRef.current = true;
                }
                navigate("/dashboard", { replace: true });
            } else {
                toastShownRef.current = false;
            }
        }
    }, [role, country, location.pathname, loading, navigate, paymentLocked, profileLoading, profileResponse]);

    // useEffect(() => {
    //     if (isError || data?.data?.status === false) {
    //         toast.error("Your account is inactivated by admin");
    //         localStorage.clear();
    //         navigate("/", { replace: true });
    //     }
    // }, [isError, data?.data?.status, navigate]);

    useEffect(() => {
        if (
            !loading &&
            role &&
            permissions &&
            role !== "Optometrist" &&
            !(role === "SuperAdmin" && country) &&
            role !== "Admin"
        ) {
            const hasPermission = requiredPermissions.every((permission) => {
                const categoryPermissions = permissions[permission.category] || [];
                return categoryPermissions.includes(permission.action);
            });

            if (!hasPermission) {
                toast.error("You don't have permission to access this module.");
                navigate(baseUrl ? `${baseUrl}/dashboard` : "/dashboard", { replace: true });
            }
        }
    }, [role, permissions, requiredPermissions, country, loading, navigate]);

    const currentPath = getCurrentPath(location.pathname, baseUrl);
    const redirecting = paymentLocked && isOptometristRoute(currentPath) && !paymentPageAllowed(currentPath);
    if (loading || redirecting) {
        return <Loader />;
    }

    return children;
};

export default RouteGuard;
