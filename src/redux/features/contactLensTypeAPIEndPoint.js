import { catalogueSlice } from "../services/catalogueSlice";
import { listParams, listRequest } from "./listParams";

export const contactLensTypeAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllContactLensType: builder.query({
            query: (params = {}) => params?.export
                ? listRequest(`/all-contact-lens-type`, params, "contact-lens-types.csv")
                : ({
                    url: `/all-contact-lens-type`,
                    params: listParams(params),
                }),
            providesTags: ["ContactLensTypes"],
        }),
        getSingleContactLensType: builder.query({
            query: (id) => `/contact-lens-type/${id}`,
        }),
        addContactLensType: builder.mutation({
            query: (data) => ({
                url: `/contact-lens-type`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ContactLensTypes"],
        }),
        updateContactLensType: builder.mutation({
            query: ({ id, data }) => ({
                url: `/contact-lens-type/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ContactLensTypes"],
        }),
        deleteContactLensType: builder.mutation({
            query: (id) => ({
                url: `/contact-lens-type/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ContactLensTypes"],
        }),
        updateContactLensTypeStatus: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/contact-lens-type/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["ContactLensTypes"],
        }),
    }),
});

export const {
    useGetAllContactLensTypeQuery,
    useGetSingleContactLensTypeQuery,
    useAddContactLensTypeMutation,
    useUpdateContactLensTypeMutation,
    useDeleteContactLensTypeMutation,
    useUpdateContactLensTypeStatusMutation,
} = contactLensTypeAPIEndPoint;
