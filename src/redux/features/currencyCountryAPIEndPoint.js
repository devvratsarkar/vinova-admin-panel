import { catalogueSlice } from "../services/catalogueSlice";

export const currencyCountryAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({

        //country
        getAllCoutries: builder.query({
            query: () => `/get-country-list`
        }),
        updateCountryStatus: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update-country-status/${id}`,
                method: "PUT",
                body: formData

            })
        }),


        //currency
        createCurrency: builder.mutation({
            query: (formData) => ({
                url: `/currency`,
                method: "POST",
                body: formData
            })
        }),
        getAllCurrencies: builder.query({
            query: () => `/currency`
        }),
        getCurrencyById: builder.query({
            query: (id) => `/currency/${id}`
        }),
        updateCurrency: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/currency/${id}`,
                method: "PUT",
                body: formData
            })
        }),
        deleteCurrency: builder.mutation({
            query: (id) => ({
                url: `/currency/${id}`,
                method: "DELETE"
            })
        }),
        restoreCurrency: builder.mutation({
            query: (id) => ({
                url: `/restore-currency/${id}`,
                method: "PUT"
            })
        }),
        softDeleteCurrency: builder.mutation({
            query: (id) => ({
                url: `/delete-currency/${id}`,
                method: "DELETE"
            })
        }),
        getTrashedCurrency: builder.query({
            query: () => `/soft-deleted-currency`
        }),
        updateCurrencyStatus: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/update-currency-status/${id}`,
                method: "PUT",
                body: formData
            })
        })
    }),
});

export const {
    useGetAllCoutriesQuery,
    useUpdateCountryStatusMutation,
    useCreateCurrencyMutation,
    
    useGetAllCurrenciesQuery,
    useGetCurrencyByIdQuery,
    useUpdateCurrencyMutation,
    useDeleteCurrencyMutation,
    useRestoreCurrencyMutation,
    useSoftDeleteCurrencyMutation,
    useGetTrashedCurrencyQuery,
    useUpdateCurrencyStatusMutation
} = currencyCountryAPIEndPoint;
