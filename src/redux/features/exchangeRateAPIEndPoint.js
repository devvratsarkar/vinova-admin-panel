import { catalogueSlice } from "../services/catalogueSlice";

export const exchangeRateAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        createExchangeRate: builder.mutation({
            query: (formData) => ({
                url: `/exchange-rate`,
                method: "POST",
                body: formData
            })
        }),
        getAllExchangeRates: builder.query({
            query: () => `/exchange-rate`
        }),
        getExchangeRateById: builder.query({
            query: (id) => `/exchange-rate/${id}`
        }),
        updateExchangeRate: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/exchange-rate/${id}`,
                method: "PUT",
                body: formData
            })
        }),
        updateExchangeRateStatus: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/exchange-rate/status/${id}`,
                method: "PUT",
                body: formData
            })
        })
    }),
});

export const {
    useCreateExchangeRateMutation,
    useGetAllExchangeRatesQuery,
    useGetExchangeRateByIdQuery,
    useUpdateExchangeRateMutation,
    useUpdateExchangeRateStatusMutation
} = exchangeRateAPIEndPoint;