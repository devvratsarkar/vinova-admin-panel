import { catalogueSlice } from "../services/catalogueSlice";

export const aboutUsAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAboutUsPage: builder.query({
            query: (lang) =>
                lang ? `/get-aboutUs-page?lang=${lang}` : `/get-aboutUs-page`,
        }),
        addUpdateAboutUsPage: builder.mutation({
            query: (formData) => ({
                url: `/add-update-aboutUs`,
                method: "POST",
                body: formData,
            }),
        }),
    }),
});

export const { useGetAboutUsPageQuery, useAddUpdateAboutUsPageMutation } = aboutUsAPIEndPoint;
