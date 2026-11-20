import { catalogueSlice } from "../services/catalogueSlice";

export const homePageAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHomePage: builder.query({
            query: () => `/home-page`
        }),
        addUpdateHomePage: builder.mutation({
            query: (formData) => ({
                url: `/home-page`,
                method: "POST",
                body: formData
            })
        })
    }),
});

export const { useGetHomePageQuery, useAddUpdateHomePageMutation } = homePageAPIEndPoint;