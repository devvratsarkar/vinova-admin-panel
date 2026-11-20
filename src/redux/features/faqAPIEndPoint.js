import { catalogueSlice } from "../services/catalogueSlice";

export const faqAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllFaq: builder.query({
            query: () => `/faqs`
        }),
        getSingleFaq: builder.query({
            query: (id) => `/faqs/${id}`
        }),
        addFaq: builder.mutation({
            query: (formData) => ({
                url: `/faqs`,
                method: "POST",
                body: formData
            })
        }),
        updateFaq: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/faqs/${id}`,
                method: "PUT",
                body: formData
            })
        }),
        deleteFaq: builder.mutation({
            query: (id) => ({
                url: `/faqs/${id}`,
                method: "DELETE",
            })
        }),
        updateFaqStatus: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/faqs-status/${id}`,
                method: "PUT",
                body: formData
            })
        }),

    }),
});

export const { useGetAllFaqQuery, useGetSingleFaqQuery, useAddFaqMutation, useUpdateFaqMutation, useDeleteFaqMutation, useUpdateFaqStatusMutation } = faqAPIEndPoint;
