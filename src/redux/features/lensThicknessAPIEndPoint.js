import { catalogueSlice } from "../services/catalogueSlice";
import { listParams, listRequest } from "./listParams";

export const LensThicknessAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        addLensThickness: builder.mutation({
            query: (formData) => ({
                url: `/lens-size`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["LensThickness"],
        }),
        updateLensThickness: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/lens-size/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["LensThickness"],
        }),
        getAllLensThickness: builder.query({
            query: (params = {}) => params?.export
                ? listRequest(`/lens-size`, params, "lens-sizes.csv")
                : ({
                    url: `/lens-size`,
                    params: listParams(params),
                }),
            providesTags: ["LensThickness"],
        }),
        getSingleLensThickness: builder.query({
            query: (id) => `/lens-size/${id}`
        }),
        getAllDeletedLensThickness: builder.query({
            query: (params = {}) => ({
                url: `/lens-size/all-soft-deleted`,
                params: {
                    ...(params.search && { search: params.search }),
                },
            }),
            providesTags: ["DeletedLensThickness"],
        }),
        softDeleteLensThickness: builder.mutation({
            query: (id) => ({
                url: `/lens-size/soft-delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["LensThickness", "DeletedLensThickness"],
        }),
        restoreDeleteLensThickness: builder.mutation({
            query: (id) => ({
                url: `/lens-size/restore/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["LensThickness", "DeletedLensThickness"],
        }),
        deleteLensThickness: builder.mutation({
            query: (id) => ({
                url: `/lens-size/permanent-delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["LensThickness", "DeletedLensThickness"],
        }),
        updateLensThicknessStatus: builder.mutation({
            query: (id) => ({
                url: `/lens-size/update-status/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["LensThickness"],
        }),
    }),
});

export const { useAddLensThicknessMutation, useUpdateLensThicknessMutation, useGetAllLensThicknessQuery, useGetSingleLensThicknessQuery, useGetAllDeletedLensThicknessQuery, useSoftDeleteLensThicknessMutation, useRestoreDeleteLensThicknessMutation, useDeleteLensThicknessMutation, useUpdateLensThicknessStatusMutation } = LensThicknessAPIEndPoint;
