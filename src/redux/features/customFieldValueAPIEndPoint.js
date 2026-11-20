import { catalogueSlice } from "../services/catalogueSlice";
import { listParams } from "./listParams";

function valueListId(arg) {
    return arg && typeof arg === "object" ? arg.id : arg;
}

export const customFieldValueAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        addCustomFieldValues: builder.mutation({
            query: (formData) => ({
                url: `/add-custom-value`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["CustomFieldValues"],
        }),
        getAllCustomFieldValues: builder.query({
            query: (arg) => {
                const id = valueListId(arg);
                const params = arg && typeof arg === "object" ? listParams(arg) : null;
                return params && Object.keys(params).length
                    ? { url: `/get-all-values/${id}`, params }
                    : `/get-all-values/${id}`;
            },
            providesTags: (result, error, arg) => [{ type: "CustomFieldValues", id: valueListId(arg) || "LIST" }],
        }),
        getSingleCustomFieldValue: builder.query({
            query: (id) => `/get-value-id/${id}`
        }),
        updateCustomFieldValaue: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update-value/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["CustomFieldValues"],
        }),
        getAllDeletedCustomFieldValue: builder.query({
            query: (id) => `/get-soft-delete-value/${id}`
        }),
        restoreCustomFieldValue: builder.mutation({
            query: (id) => ({
                url: `/restore-value/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["CustomFieldValues"],
        }),
        softDeleteCustomFieldValue: builder.mutation({
            query: (id) => ({
                url: `/soft-delete-value/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["CustomFieldValues"],
        }),
        deleteCustomFieldValue: builder.mutation({
            query: (id) => ({
                url: `/delete-field-value/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["CustomFieldValues"],
        }),
        getCustomFieldShapes: builder.query({
            query: () => `/get-custom-shapes`
        })



    }),
});

export const { useAddCustomFieldValuesMutation, useGetAllCustomFieldValuesQuery, useGetSingleCustomFieldValueQuery, useUpdateCustomFieldValaueMutation, useGetAllDeletedCustomFieldValueQuery, useRestoreCustomFieldValueMutation, useSoftDeleteCustomFieldValueMutation, useDeleteCustomFieldValueMutation, useGetCustomFieldShapesQuery } = customFieldValueAPIEndPoint;
