import { catalogueSlice } from "../services/catalogueSlice";

export const careerPageAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCareerPage: builder.query({
            query: () => `/get-career-page`
        }),
        addUpdateCareerPage: builder.mutation({
            query: (formData) => ({
                url: `/add-update-career`,
                method: "POST",
                body: formData
            })
        })
    }),
});

export const { useGetCareerPageQuery, useAddUpdateCareerPageMutation } = careerPageAPIEndPoint;