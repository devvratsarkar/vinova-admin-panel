import { catalogueSlice } from "../services/catalogueSlice";
import { listRequest } from "./listParams";

export const StaffEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllModules: builder.query({
            query: () => `/get-all-models`,
        }),
        getAllRoles: builder.query({
            query: () => `/all-roles`,
            providesTags: ["RolesList"],
        }),
        getSingleRole: builder.query({
            query: (id) => `/get-role/${id}`,
            providesTags: ["RolesList"],
        }),
        createRole: builder.mutation({
            query: (body) => ({
                url: `/create-role-permissions`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["RolesList"],
        }),
        updateRole: builder.mutation({
            query: ({ id, body }) => ({
                url: `/update-role/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["RolesList"],
        }),
        deleteRole: builder.mutation({
            query: (id) => ({
                url: `/delete-role/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["RolesList"],
        }),
        addStaff: builder.mutation({
            query: (staffData) => ({
                url: `/add-staff`,
                body: staffData,
                method: "POST",
            }),
            invalidatesTags: ["StaffList"],
        }),
        getAllStaff: builder.query({
            query: (params = {}) => params?.export
                ? listRequest(`/all-staff`, params, "staff-users.csv", ["search", "role", "status", "fromDate", "toDate"])
                : ({
                url: `/all-staff`,
                params: {
                    ...(params.page && { page: params.page }),
                    ...(params.limit && { limit: params.limit }),
                    ...(params.search && { search: params.search }),
                    ...(params.role && { role: params.role }),
                    ...(params.status && { status: params.status }),
                    ...(params.fromDate && { fromDate: params.fromDate }),
                    ...(params.toDate && { toDate: params.toDate }),
                },
            }),
            providesTags: ["StaffList"],
        }),
        getSingleStaff: builder.query({
            query: (id) => `/get-user/${id}`,
        }),
        updateStaff: builder.mutation({
            query: ({ staffData, staffId }) => ({
                url: `/edit-user/${staffId}`,
                method: "PUT",
                body: staffData,
            }),
            invalidatesTags: ["StaffList"],
        }),
        deleteStaff: builder.mutation({
            query: (staffId) => ({
                url: `/delete-user/${staffId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["StaffList"],
        }),
    }),
});

export const {
    useGetAllModulesQuery,
    useGetAllRolesQuery,
    useGetSingleRoleQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useAddStaffMutation,
    useGetAllStaffQuery,
    useGetSingleStaffQuery,
    useUpdateStaffMutation,
    useDeleteStaffMutation,
} = StaffEndPoint;
