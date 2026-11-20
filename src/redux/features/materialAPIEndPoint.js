import { catalogueSlice } from "../services/catalogueSlice";
import { listParams, listRequest } from "./listParams";

export const materialAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllMaterials: builder.query({
            query: (params = {}) => params?.export
                ? listRequest(`/material`, params, "materials.csv")
                : ({
                    url: `/material`,
                    params: listParams(params),
                }),
            providesTags: ["Materials"],
        }),
        getSingleMaterial: builder.query({
            query: (id) => `/material/${id}`,
        }),
        addMaterial: builder.mutation({
            query: (data) => ({
                url: `/material`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Materials"],
        }),
        updateMaterial: builder.mutation({
            query: ({ id, data }) => ({
                url: `/material/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Materials"],
        }),
        deleteMaterial: builder.mutation({
            query: (id) => ({
                url: `/material/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Materials"],
        }),
        updateMaterialStatus: builder.mutation({
            query: (id) => ({
                url: `/material-status/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Materials"],
        }),
    }),
});

export const {
    useGetAllMaterialsQuery,
    useGetSingleMaterialQuery,
    useAddMaterialMutation,
    useUpdateMaterialMutation,
    useDeleteMaterialMutation,
    useUpdateMaterialStatusMutation,
} = materialAPIEndPoint;

export const getMaterialSelectOptions = (data) =>
    (data?.data?.data || data?.data || []).map((item) => ({
        label: item.name,
        value: item.name,
    }));
