import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCountryCode } from "../redux/slices/authSlice";

/**
 * Permissions/role/country from Redux auth state. Replaces the previous PermissionsProvider context.
 */
export function usePermissions() {
    const dispatch = useDispatch();
    const { role, permissions: permissionsStr, country } = useSelector((state) => state.auth);

    const permissions = (() => {
        try {
            return permissionsStr ? JSON.parse(permissionsStr) : {};
        } catch {
            return {};
        }
    })();

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
        loading: false,
    };
}
