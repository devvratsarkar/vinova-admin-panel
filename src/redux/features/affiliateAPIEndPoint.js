import { catalogueSlice } from "../services/catalogueSlice";

export const affiliateAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllWithdrawalRequestData: builder.query({
            query: (params = {}) => ({
                url: `/get-all-withdrawal/request`,
                params: {
                    ...(params.page && { page: params.page }),
                    ...(params.limit && { limit: params.limit }),
                    ...(params.search && { search: params.search }),
                    ...(params.status && { status: params.status }),
                    ...(params.fromDate && { fromDate: params.fromDate }),
                    ...(params.toDate && { toDate: params.toDate }),
                },
            }),
        }),
        updateWithdrawalRequest: builder.mutation({
            query: ({ id, values }) => ({
                url: `/update-request/${id}`,
                method: "PUT",
                body: values
            })
        }),
        getAllCouponRequestData: builder.query({
            query: (params = {}) => ({
                url: `/all-affiliate-coupon`,
                params: {
                    ...(params.page && { page: params.page }),
                    ...(params.limit && { limit: params.limit }),
                    ...(params.search && { search: params.search }),
                    ...(params.status && { status: params.status }),
                    ...(params.fromDate && { fromDate: params.fromDate }),
                    ...(params.toDate && { toDate: params.toDate }),
                },
            }),
        }),
        updateCouponRequest: builder.mutation({
            query: ({ id, values }) => ({
                url: `/affiliate-coupons/${id}`,
                method: "PUT",
                body: values
            })
        }),
    }),
});

export const {
    useGetAllWithdrawalRequestDataQuery, useUpdateWithdrawalRequestMutation, useGetAllCouponRequestDataQuery, useUpdateCouponRequestMutation
} = affiliateAPIEndPoint;