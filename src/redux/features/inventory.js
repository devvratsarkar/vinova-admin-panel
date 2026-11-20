import { catalogueSlice } from "../services/catalogueSlice";
import { listParams } from "./listParams";

export const InventoryAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        searchFrameInventory: builder.query({
            query: (search) => `/get-frames-inventory?product_name=${search}`
        }),
        getInventoryAttributes: builder.query({
            query: (id) => `/get-inventory-attributes/${id}`
        }),
        // getInventory: builder.query({
        //     query: (id) => `/get-varients/${id}`
        // }),
        addInventoryVariant: builder.mutation({
            query: (formData) => ({
                url: `/add-inventory-varients`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Inventory"],
        }),
        getAllInventoryVariants: builder.query({
            query: (params = {}) => {
                const query = listParams(params);
                return Object.keys(query).length
                    ? { url: `/get-inventory-varients`, params: query }
                    : `/get-inventory-varients`;
            },
            providesTags: ["Inventory"],
        }),
        getProductInventoryVariant: builder.query({
            query: ({ id, type }) => `/get-varients/${type}/${id}`
        }),
        // PUT update-varients/{size}/{product_id}
        updateInventoryVariant: builder.mutation({
            query: ({ product_id, size, formData }) => ({
                url: `/update-varients/${size}/${product_id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Inventory"],
        }),
        getInventorySizeWise: builder.query({
            query: (arg) => {
                const id = arg && typeof arg === "object" ? arg.id : arg;
                const params = arg && typeof arg === "object" ? listParams(arg) : null;
                return params && Object.keys(params).length
                    ? { url: `/get-inventory-sizewise/${id}`, params }
                    : `/get-inventory-sizewise/${id}`;
            },
            providesTags: ["Inventory"],
        }),
        updateInventoryStatus: builder.mutation({
            query: ({ type, id, status }) => ({
                url: `/update-size-inventory/${type}/${id}`,
                method: "PUT",
                body: { status: Boolean(status) }
            }),
            invalidatesTags: ["Inventory"],
        }),
        copyVariants: builder.mutation({
            query: ({ id, type }) => ({
                url: `/copy-variants/${type}/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Inventory"],
        }),
        softDeleteInventory: builder.mutation({
            query: (id) => ({
                url: `/add-trash-variant/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Inventory", "DeletedInventory"],
        }),
        restoreDeleteInventory: builder.mutation({
            query: (id) => ({
                url: `/restore-trash-variant/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Inventory", "DeletedInventory"],
        }),
        deleteInventory: builder.mutation({
            query: (id) => ({
                url: `/delete-trash-variant/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Inventory", "DeletedInventory"],
        }),
        getAllInventoryTrashVariants: builder.query({
            query: () => `/get-trash-variant`,
            providesTags: ["DeletedInventory"],
        }),
        getAllInventoryWithoutVariant: builder.query({
            query: (params) => {
                const query = params && typeof params === "object" ? listParams(params) : {};
                return Object.keys(query).length
                    ? { url: `/single-variant`, params: query }
                    : `/single-variant`;
            },
            providesTags: ["InventoryWithoutVariant"],
        }),
        getSingleInventoryWithoutVariant: builder.query({
            query: (id) => `/single-variant/${id}`
        }),
        addInventoryWithoutVariant: builder.mutation({
            query: (formData) => ({
                url: `/add-single-variant`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["InventoryWithoutVariant"],
        }),
        editInventoryWithoutVariant: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/single-variant/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["InventoryWithoutVariant"],
        }),
        softDeleteInventoryWithoutVariant: builder.mutation({
            query: (id) => ({
                url: `/single-variant/soft/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["InventoryWithoutVariant", "DeletedInventoryWithoutVariant"],
        }),
        parmanentDeleteInventoryWithoutVariant: builder.mutation({
            query: (id) => ({
                url: `/single-variant/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["InventoryWithoutVariant", "DeletedInventoryWithoutVariant"],
        }),
        getDeletedInventoryWithoutVariant: builder.query({
            query: () => `/single-variant/deleted`,
            providesTags: ["DeletedInventoryWithoutVariant"],
        }),
        restoreInventoryWithoutVariant: builder.mutation({
            query: ({ inventoryWithoutVarientId }) => ({
                url: `/single-variant/restore/${inventoryWithoutVarientId}`,
                method: "PUT",
            }),
            invalidatesTags: ["InventoryWithoutVariant", "DeletedInventoryWithoutVariant"],
        }),
    }),
});

export const { useLazySearchFrameInventoryQuery, useGetInventoryAttributesQuery, useAddInventoryVariantMutation, useGetAllInventoryVariantsQuery, useGetProductInventoryVariantQuery,
    useUpdateInventoryVariantMutation, useGetInventorySizeWiseQuery, useUpdateInventoryStatusMutation, useCopyVariantsMutation, useSoftDeleteInventoryMutation, useRestoreDeleteInventoryMutation, useDeleteInventoryMutation, useGetAllInventoryTrashVariantsQuery, useGetAllInventoryWithoutVariantQuery, useGetSingleInventoryWithoutVariantQuery, useAddInventoryWithoutVariantMutation, useEditInventoryWithoutVariantMutation, useSoftDeleteInventoryWithoutVariantMutation, useParmanentDeleteInventoryWithoutVariantMutation, useGetDeletedInventoryWithoutVariantQuery, useRestoreInventoryWithoutVariantMutation } = InventoryAPIEndPoint;
