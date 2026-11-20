import { catalogueSlice } from "../services/catalogueSlice";

export const CategoryAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategorySelect: builder.query({
            query: () => `/all-category-select`,
            providesTags: ["Categories"],
        }),
        addCategory: builder.mutation({
            query: (formData) => ({
                url: `/category/create`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Categories"],
        }),
        getAllCategory: builder.query({
            query: (params = {}) => ({
                url: `/category`,
                params: {
                    ...(params.page && { page: params.page }),
                    ...(params.limit && { limit: params.limit }),
                    ...(params.search && { search: params.search }),
                    ...(params.parent_category && { parent_category: params.parent_category }),
                    ...(params.type && { type: params.type }),
                    ...(params.status && { status: params.status }),
                    ...(params.fromDate && { fromDate: params.fromDate }),
                    ...(params.toDate && { toDate: params.toDate }),
                },
            }),
            providesTags: ["Categories"],
        }),
        updateCategoryStatus: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update-status-category/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Categories"],
        }),
        getSingleCategory: builder.query({
            query: (id) => `/get-category/${id}`
        }),
        updateCategory: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update-category/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Categories"],
        }),
        softDeleteCategory: builder.mutation({
            query: (id) => ({
                url: `/soft-delete-category/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Categories", "DeletedCategories"],
        }),
        restoreCategory: builder.mutation({
            query: (id) => ({
                url: `/restore-category/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Categories", "DeletedCategories"],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/delete-category/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Categories", "DeletedCategories"],
        }),
        getAllDeletedCategory: builder.query({
            query: () => `/get-deleted-category`,
            providesTags: ["DeletedCategories"],
        }),
    }),
});

export const { useGetAllCategorySelectQuery, useAddCategoryMutation, useGetAllCategoryQuery, useUpdateCategoryStatusMutation, useGetSingleCategoryQuery, useUpdateCategoryMutation, useSoftDeleteCategoryMutation, useDeleteCategoryMutation, useGetAllDeletedCategoryQuery, useRestoreCategoryMutation } = CategoryAPIEndPoint;
