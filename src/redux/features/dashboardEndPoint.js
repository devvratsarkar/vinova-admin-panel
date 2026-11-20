import { catalogueSlice } from "../services/catalogueSlice";

export const dashboardEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboard: builder.query({
            query: ({ period, fromDate, toDate } = {}) => {
                const params = new URLSearchParams()
                if (period)   params.append('period',   period)
                if (fromDate) params.append('fromDate', fromDate)
                if (toDate)   params.append('toDate',   toDate)
                const qs = params.toString()
                return qs ? `/dashboard?${qs}` : `/dashboard`
            }
        }),
        getDashboardData: builder.query({
            query: () => `/dashboard-data`
        }),
        getIncomeData: builder.query({
            query: ({ period }) => `/get-income-data?period=${period}`
        }),
        getOrderData: builder.query({
            query: () => `get-order-data`
        }),
        getCompleteDashBoardData: builder.query({
            query: ({ period, fromDate, toDate }) => `/get-dashboard-data?period=${period}&fromDate=${fromDate}&toDate=${toDate}`
        }),
        getAnalytics: builder.query({
            query: () => `/analytics`,
        }),
    }),
});

export const {
    useGetDashboardQuery,
    useGetDashboardDataQuery,
    useGetIncomeDataQuery,
    useGetOrderDataQuery,
    useGetCompleteDashBoardDataQuery,
    useGetAnalyticsQuery,
} = dashboardEndPoint;
