import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCountryCode } from "../redux/slices/authSlice";
import { hasPermission, readPermissions } from "./permissions";

/**
 * Permissions/role/country from Redux auth state. Replaces the previous PermissionsProvider context.
 */
export function usePermissions() {
    const dispatch = useDispatch();
    const { role, permissions: permissionsStr, country } = useSelector((state) => state.auth);

    const permissions = useMemo(() => readPermissions(permissionsStr), [permissionsStr]);
    const can = useCallback(
        (model, action) => hasPermission(role, permissions, model, action),
        [role, permissions]
    );

    const setCountry = useCallback(
        (value) => {
            dispatch(setCountryCode(value));
            if (typeof localStorage !== "undefined") {
                localStorage.setItem("country", value ?? "");
            }
        },
        [dispatch]
    );

    return {
        permissions,
        role: role || "",
        country: country || null,
        setCountry,
        can,
        permissionsReady: Boolean(permissionsStr),
        loading: false,
    };
}
