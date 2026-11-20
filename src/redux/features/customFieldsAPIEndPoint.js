import { catalogueSlice } from "../services/catalogueSlice";
import { listParams, listRequest } from "./listParams";

export const customFieldsAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        addCustomField: builder.mutation({
            query: (formData) => ({
                url: `/add-custom-field`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["CustomFields"],
        }),
        getAllCustomFields: builder.query({
            query: (params = {}) => params?.export
                ? listRequest(`/get-all-fields`, params, "custom-fields.csv")
                : ({
                    url: `/get-all-fields`,
                    params: listParams(params),
                }),
            providesTags: ["CustomFields"],
        }),
        getSingleCustomeField: builder.query({
            query: (id) => `/get-field-id/${id}`
        }),
        updateCustomField: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update-custom-field/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["CustomFields"],
        }),
        getAllDeletedCustomField: builder.query({
            query: () => `/get-soft-delete-field`,
            providesTags: ["DeletedCustomFields"],
        }),
        softDeleteCustomField: builder.mutation({
            query: (id) => ({
                url: `/soft-delete-field/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["CustomFields", "DeletedCustomFields"],
        }),
        restoreDeletedCustomFields: builder.mutation({
            query: (id) => ({
                url: `/restore-field/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["CustomFields", "DeletedCustomFields"],
        }),
        deletedCustomFiels: builder.mutation({
            query: (id) => ({
                url: `/delete-field/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["CustomFields", "DeletedCustomFields"],
        })
    }),
});

export const { useAddCustomFieldMutation, useGetAllCustomFieldsQuery, useGetSingleCustomeFieldQuery, useUpdateCustomFieldMutation, useGetAllDeletedCustomFieldQuery, useSoftDeleteCustomFieldMutation, useRestoreDeletedCustomFieldsMutation, useDeletedCustomFielsMutation } = customFieldsAPIEndPoint;
