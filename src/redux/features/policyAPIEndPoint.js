import { catalogueSlice } from "../services/catalogueSlice";

export const policyAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllPolicies: builder.query({
            query: (type) => (type ? `/all-policy?type=${type}` : `/all-policy`),
        }),
        getPolicy: builder.query({
            query: (id) => `/policy/${id}`,
        }),
        addPolicy: builder.mutation({
            query: (formData) => ({
                url: `/add-policy`,
                method: "POST",
                body: formData,
            }),
        }),
        updatePolicy: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update-policy/${id}`,
                method: "PUT",
                body: formData,
            }),
        }),
        deletePolicy: builder.mutation({
            query: (id) => ({
                url: `/delete-policy/${id}`,
                method: "DELETE",
            }),
        }),
        updatePolicyStatus: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update-status/${id}`,
                method: "PUT",
                body: formData,
            }),
        }),
    }),
});

export const {
    useGetAllPoliciesQuery,
    useGetPolicyQuery,
    useAddPolicyMutation,
    useUpdatePolicyMutation,
    useDeletePolicyMutation,
    useUpdatePolicyStatusMutation,
} = policyAPIEndPoint;
