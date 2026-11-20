import { catalogueSlice } from "../services/catalogueSlice";
import { listParams } from "./listParams";

export const optometristEnquiryAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOptometrists: builder.query({
            query: (params = {}) => ({
                url: `/get-optometrists`,
                params: listParams(params),
            }),
            providesTags: ["Optometrists"],
        }),
        getSingleOptometrist: builder.query({
            query: (id) => `/optometrist/${id}`,
            providesTags: ["Optometrists"],
        }),
        approveOptometrist: builder.mutation({
            query: (id) => ({
                url: `/optometrist/${id}/approve`,
                method: "PUT",
            }),
            invalidatesTags: ["Optometrists"],
        }),
        rejectOptometrist: builder.mutation({
            query: ({ id, reason }) => ({
                url: `/optometrist/${id}/reject`,
                method: "PUT",
                body: { reason },
            }),
            invalidatesTags: ["Optometrists"],
        }),
        registerOptometrist: builder.mutation({
            query: (formData) => ({
                url: `/optometrist/register`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Optometrists"],
        }),
        updateOptometrist: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/optometrist/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Optometrists"],
        }),
        updateOptometristCommission: builder.mutation({
            query: ({ id, updated_commission_percentage }) => ({
                url: `/optometrist/${id}/commission`,
                method: "PUT",
                body: { updated_commission_percentage },
            }),
            invalidatesTags: ["Optometrists"],
        }),
        deleteOptometrist: builder.mutation({
            query: (id) => ({
                url: `/soft-delete-optometrist/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Optometrists"],
        }),
        restoreOptometrist: builder.mutation({
            query: (id) => ({
                url: `/restore-optometrist/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Optometrists"],
        }),
        getAdminOptometristWithdrawals: builder.query({
            query: (params = {}) => ({
                url: `/optometrist-withdrawal/request`,
                params: listParams(params),
            }),
            providesTags: ["OptometristWithdrawals"],
        }),
        updateAdminOptometristWithdrawal: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/optometrist-withdrawal/request/${encodeURIComponent(id)}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["OptometristWithdrawals"],
        }),
    }),
});

export const {
    useGetOptometristsQuery,
    useGetSingleOptometristQuery,
    useApproveOptometristMutation,
    useRejectOptometristMutation,
    useRegisterOptometristMutation,
    useUpdateOptometristMutation,
    useUpdateOptometristCommissionMutation,
    useDeleteOptometristMutation,
    useRestoreOptometristMutation,
    useGetAdminOptometristWithdrawalsQuery,
    useUpdateAdminOptometristWithdrawalMutation,
} = optometristEnquiryAPIEndPoint;
