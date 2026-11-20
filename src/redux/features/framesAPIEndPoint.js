import { catalogueSlice } from "../services/catalogueSlice";
import { listParams, listRequest } from "./listParams";

export const BrandAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        addFrames: builder.mutation({
            query: (formData) => ({
                url: `/frame`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Frames", "ContactLenses", "Accessories"],
        }),
        getFrames: builder.query({
            query: (params = {}) => params?.export
                ? listRequest(`/frame`, params, "frames.csv")
                : ({
                    url: `/frame`,
                    params: {
                        ...(params.page && { page: params.page }),
                        ...(params.limit && { limit: params.limit }),
                        ...(params.search && { search: params.search }),
                        ...(params.category && { category: params.category }),
                        ...(params.brand && { brand: params.brand }),
                        ...(params.status && { status: params.status }),
                        ...(params.type && { type: params.type }),
                        ...(params.fromDate && { fromDate: params.fromDate }),
                        ...(params.toDate && { toDate: params.toDate }),
                        ...(params.trash && { trash: true }),
                    },
                }),
            providesTags: ["Frames"],
        }),
        getSingleFrames: builder.query({
            query: (id) => `/frame/${id}`,
            providesTags: (result, error, id) => [{ type: "Frames", id }],
        }),
        updateFrame: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/frame/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Frames"],
        }),
        softDeleteFrame: builder.mutation({
            query: (id) => ({
                url: `/frame/soft-delete/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Frames", "DeletedFrames", "ContactLenses", "DeletedContactLenses", "Accessories", "DeletedAccessories"],
        }),
        restoreDeleteFrame: builder.mutation({
            query: (id) => ({
                url: `/frame/restore/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Frames", "DeletedFrames", "ContactLenses", "DeletedContactLenses", "Accessories", "DeletedAccessories"],
        }),
        deleteFrame: builder.mutation({
            query: (id) => ({
                url: `/frame/permanent-delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Frames", "DeletedFrames", "ContactLenses", "DeletedContactLenses", "Accessories", "DeletedAccessories"],
        }),
        getDeletedFrames: builder.query({
            query: () => `/frame/all-soft-deleted`,
            providesTags: ["DeletedFrames"],
        }),
        updateStatusFrame: builder.mutation({
            query: (id) => ({
                url: `/frame/update-status/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Frames"],
        }),
        getAllSelectFrames: builder.query({
            query: () => `/frame/all-select`
        }),
        getAllContactLensData: builder.query({
            query: (params = {}) => params?.export
                ? listRequest(`/all-contact-lens`, params, "contact-lenses.csv")
                : ({
                    url: `/all-contact-lens`,
                    params: listParams(params),
                }),
            providesTags: ["ContactLenses"],
        }),
        getSingleContactLensData: builder.query({
            query: (id) => `/contact-lens/${id}`
        }),
        getAllDeletedContactLensData: builder.query({
            query: () => `/contact-lens/all-soft-deleted`,
            providesTags: ["DeletedContactLenses"],
        }),
        updateSingleContactLensData: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/contact-lens/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["ContactLenses"],
        }),
        getAllAccessoriesData: builder.query({
            query: (params = {}) => params?.export
                ? listRequest(`/all-accessories`, params, "accessories.csv")
                : ({
                    url: `/all-accessories`,
                    params: listParams(params),
                }),
            providesTags: ["Accessories"],
        }),
        getAccessoriesData: builder.query({
            query: (id) => `/accessories/${id}`
        }),
        updateAccessoriesData: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/accessories/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Accessories"],
        }),
        getAllDeletedAccessoriesData: builder.query({
            query: () => `/accessories/all-soft-deleted`,
            providesTags: ["DeletedAccessories"],
        })
    }),
});

export const { useAddFramesMutation, useGetFramesQuery, useGetSingleFramesQuery, useUpdateFrameMutation, useSoftDeleteFrameMutation, useRestoreDeleteFrameMutation, useDeleteFrameMutation, useGetDeletedFramesQuery, useUpdateStatusFrameMutation, useGetAllSelectFramesQuery, useGetAllContactLensDataQuery, useGetAllDeletedContactLensDataQuery, useGetSingleContactLensDataQuery, useUpdateSingleContactLensDataMutation, useGetAllAccessoriesDataQuery, useGetAccessoriesDataQuery, useUpdateAccessoriesDataMutation, useGetAllDeletedAccessoriesDataQuery } = BrandAPIEndPoint;
