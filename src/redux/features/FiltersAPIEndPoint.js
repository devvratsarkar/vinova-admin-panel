import { catalogueSlice } from "../services/catalogueSlice";
import { listParams } from "./listParams";

export const FiltersAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllSelectFilters: builder.query({
            query: () => `/filter/all-select`,
            providesTags: ["Filters"],
        }),
        addFilters: builder.mutation({
            query: (formData) => ({
                url: `/filter`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Filters"],
        }),
        updateFilters: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/filter/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Filters"],
        }),
        getAllFilters: builder.query({
            query: (params = {}) => ({
                url: `/filter`,
                params: listParams(params),
            }),
            providesTags: ["Filters"],
        }),
        getSingleFilter: builder.query({
            query: (id) => `/filter/${id}`
        }),
        softDeleteFilters: builder.mutation({
            query: (id) => ({
                url: `/filter/soft/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Filters", "DeletedFilters"],
        }),
        softDeleteLensType: builder.mutation({
            query: (id) => ({
                url: `/filter/soft/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Filters", "DeletedFilters"],
        }),
        restoreDeleteFilters: builder.mutation({
            query: (id) => ({
                url: `/filter/restore/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Filters", "DeletedFilters"],
        }),
        deleteFilters: builder.mutation({
            query: (id) => ({
                url: `/filter/permanent/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Filters", "DeletedFilters"],
        }),
        getAllDeletedFilters: builder.query({
            query: (params = {}) => ({
                url: `/filter/all-soft-deleted`,
                params: {
                    ...(params.search && { search: params.search }),
                },
            }),
            providesTags: ["DeletedFilters"],
        }),
        updateFilterStatus: builder.mutation({
            query: (id) => ({
                url: `/filter/update-status/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Filters"],
        }),
        updateLensTypeStatus: builder.mutation({
            query: (id) => ({
                url: `/filter/status/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Filters"],
        })

    }),
});

export const { useGetAllSelectFiltersQuery, useAddFiltersMutation, useUpdateFiltersMutation, useGetAllFiltersQuery, useGetSingleFilterQuery, useSoftDeleteFiltersMutation, useSoftDeleteLensTypeMutation, useRestoreDeleteFiltersMutation, useDeleteFiltersMutation, useGetAllDeletedFiltersQuery, useUpdateFilterStatusMutation, useUpdateLensTypeStatusMutation } = FiltersAPIEndPoint;
