import { catalogueSlice } from "../services/catalogueSlice";

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
        addStaff: builder.mutation({
            query: (staffData) => ({
                url: `/add-staff`,
                body: staffData,
                method: "POST",
            }),
            invalidatesTags: ["StaffList"],
        }),
        getAllStaff: builder.query({
            query: () => `/all-staff`,
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
    useAddStaffMutation,
    useGetAllStaffQuery,
    useGetSingleStaffQuery,
    useUpdateStaffMutation,
    useDeleteStaffMutation,
} = StaffEndPoint;
