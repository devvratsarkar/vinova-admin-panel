import { catalogueSlice } from "../services/catalogueSlice";
import { listParams, listRequest } from "./listParams";

export const BrandAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        addBrand: builder.mutation({
            query: (formData) => ({
                url: `/add-brand`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Brands"],
        }),
        updateBrand: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update-brand/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Brands"],
        }),
        getBrands: builder.query({
            query: (params = {}) => params?.export
                ? listRequest(`/get-brand`, params, "brands.csv")
                : ({
                    url: `/get-brand`,
                    params: listParams(params),
                }),
            providesTags: ["Brands"],
        }),
        getSingleBrand: builder.query({
            query: (id) => `/get-brand/${id}`
        }),
        softDeleteBrand: builder.mutation({
            query: (id) => ({
                url: `/soft-delete-brand/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Brands", "DeletedBrands"],
        }),
        restoreDeleteBrand: builder.mutation({
            query: (id) => ({
                url: `/restore-soft-delete-brand/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Brands", "DeletedBrands"],
        }),
        deleteBrandNew: builder.mutation({
            query: (id) => ({
                url: `/delete-brand/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Brands", "DeletedBrands"],
        }),
        getDeletedBrands: builder.query({
            query: () => `/get-soft-delete-brand`,
            providesTags: ["DeletedBrands"],
        }),
        updateBrandStatus: builder.mutation({
            query: (id) => ({
                url: `/brand-status-update/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Brands"],
        }),
        getBrandsSelect: builder.query({
            query: () => `/get-brand-select`,
            providesTags: ["Brands"],
        }),



    }),
});

export const { useAddBrandMutation, useUpdateBrandMutation, useGetBrandsQuery, useGetSingleBrandQuery, useSoftDeleteBrandMutation, useRestoreDeleteBrandMutation, useDeleteBrandNewMutation, useGetDeletedBrandsQuery, useUpdateBrandStatusMutation, useGetBrandsSelectQuery } = BrandAPIEndPoint;
