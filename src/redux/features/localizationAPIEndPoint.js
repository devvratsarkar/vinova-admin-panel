import { catalogueSlice } from "../services/catalogueSlice";

export const localizationAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllTranslationData: builder.query({
            query: (lang) => ({
                url: lang != null && lang !== "" ? `/translation?lang=${lang}` : `/translation`,
                headers: { "x-force-country": "AE" }
            }),
        }),
        addNewLanguage: builder.mutation({
            query: (formData) => ({
                url: `/translation`,
                method: "POST",
                body: formData,
                headers: { "x-force-country": "AE" }
            }),
        }),


    }),
});

export const { useGetAllTranslationDataQuery, useAddNewLanguageMutation } = localizationAPIEndPoint;