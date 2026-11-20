import { catalogueSlice } from "../services/catalogueSlice";
import { listParams, listRequest } from "./listParams";

export const FiltersAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        addLens: builder.mutation({
            query: (formData) => ({
                url: `/lens`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Lenses"],
        }),
        updateLens: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/lens/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Lenses"],
        }),
        getAllLens: builder.query({
            query: (params = {}) => params?.export
                ? listRequest(`/lens`, params, "lenses.csv")
                : ({
                    url: `/lens`,
                    params: listParams(params),
                }),
            providesTags: ["Lenses"],
        }),
        getSingleLens: builder.query({
            query: (id) => `/lens/${id}`
        }),
        getDeletedLens: builder.query({
            query: () => `/lens/all-soft-deleted`,
            providesTags: ["DeletedLenses"],
        }),
        getSelectLens: builder.query({
            query: () => `/lens/all-selected`,
            providesTags: ["Lenses"],
        }),
        softDeleteLens: builder.mutation({
            query: (id) => ({
                url: `/lens/softp-delete/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Lenses", "DeletedLenses"],
        }),
        restoreDeleteLens: builder.mutation({
            query: (id) => ({
                url: `/lens/restore/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Lenses", "DeletedLenses"],
        }),
        deleteLens: builder.mutation({
            query: (id) => ({
                url: `/lens/permanent-delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Lenses", "DeletedLenses"],
        }),
        updateLensStatus: builder.mutation({
            query: (id) => ({
                url: `/lens/status/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Lenses"],
        }),




    }),
});

export const { useAddLensMutation, useUpdateLensMutation, useGetAllLensQuery, useGetSingleLensQuery, useGetDeletedLensQuery, useGetSelectLensQuery, useSoftDeleteLensMutation, useRestoreDeleteLensMutation, useDeleteLensMutation, useUpdateLensStatusMutation } = FiltersAPIEndPoint;
