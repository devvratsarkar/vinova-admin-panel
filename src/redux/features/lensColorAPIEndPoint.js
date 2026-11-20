import { catalogueSlice } from "../services/catalogueSlice";
import { listParams } from "./listParams";

export const lensColorAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        addLensColor: builder.mutation({
            query: (formData) => ({
                url: `/lens-color`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["LensColors"],
        }),
        updateLensColor: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/lens-color/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["LensColors"],
        }),
        getLensColor: builder.query({
            query: (params = {}) => ({
                url: `/lens-color`,
                params: listParams(params),
            }),
            providesTags: ["LensColors"],
        }),
        getSingleLensColor: builder.query({
            query: (id) => `/lens-color/${id}`,
        }),
        softDeleteLensColor: builder.mutation({
            query: (id) => ({
                url: `/lens-color/soft/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["LensColors", "DeletedLensColors"],
        }),
        restoreDeleteLensColor: builder.mutation({
            query: (id) => ({
                url: `/lens-color/restore/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["LensColors", "DeletedLensColors"],
        }),
        deleteLensColor: builder.mutation({
            query: (id) => ({
                url: `/lens-color/permanent/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["LensColors", "DeletedLensColors"],
        }),
        getAllSoftDeletedLensColor: builder.query({
            query: (params = {}) => ({
                url: `/lens-color/all-soft-deleted`,
                params: {
                    ...(params.search && { search: params.search }),
                },
            }),
            providesTags: ["DeletedLensColors"],
        }),
        updateLinseColorStatus:builder.mutation({
            query: (id) => ({
                url: `/lens-color-status/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["LensColors"],
        })
    }),
});

export const { useAddLensColorMutation, useUpdateLensColorMutation, useGetLensColorQuery, useGetSingleLensColorQuery, useSoftDeleteLensColorMutation, useRestoreDeleteLensColorMutation, useDeleteLensColorMutation, useGetAllSoftDeletedLensColorQuery, useUpdateLinseColorStatusMutation } = lensColorAPIEndPoint;
