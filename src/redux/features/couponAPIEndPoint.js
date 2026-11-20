import { catalogueSlice } from "../services/catalogueSlice";
import { listParams } from "./listParams";

export const couponAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCoupon: builder.mutation({
            query: (formData) => ({
                url: `/coupon/create`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Coupons"],
        }),
        updateCoupon: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update-coupon/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Coupons"],
        }),
        softDeleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/soft-delete-coupon/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Coupons", "DeletedCoupons"],
        }),
        updateCouponStatus: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update-coupon-status/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Coupons"],
        }),
        getAllCoupons: builder.query({
            query: (params = {}) => ({
                url: `/all-coupons`,
                params: listParams(params),
            }),
            providesTags: ["Coupons"],
        }),
        getSingleCoupon: builder.query({
            query: (id) => `/coupon/${id}`
        }),
        restoreCoupon: builder.mutation({
            query: (id) => ({
                url: `/restore-coupon/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Coupons", "DeletedCoupons"],
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/delete-coupon/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Coupons", "DeletedCoupons"],
        }),
        getTrashedCoupons: builder.query({
            query: () => `/soft-deleted-coupon`,
            providesTags: ["DeletedCoupons"],
        })
    }),
});

export const {
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useSoftDeleteCouponMutation,
    useUpdateCouponStatusMutation,
    useGetAllCouponsQuery,
    useGetSingleCouponQuery,
    useRestoreCouponMutation,
    useDeleteCouponMutation,
    useGetTrashedCouponsQuery
} = couponAPIEndPoint;