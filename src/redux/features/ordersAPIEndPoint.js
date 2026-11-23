import { catalogueSlice } from "../services/catalogueSlice";
import { listRequest } from "./listParams";

export const ordersAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrders: builder.query({
            query: (params = {}) => {
                if (params.export) return listRequest(`/all-orders`, params, "orders.csv", ["page", "limit", "status", "payment_status", "fromDate", "toDate", "isprescription", "search"]);
                const query = new URLSearchParams();
                if (params.status) query.append("status", params.status);
                if (params.payment_status) query.append("payment_status", params.payment_status);
                if (params.fromDate) query.append("fromDate", params.fromDate);
                if (params.toDate) query.append("toDate", params.toDate);
                if (params.isprescription) query.append("isprescription", params.isprescription);
                if (params.search) query.append("search", params.search);
                if (params.page) query.append("page", params.page);
                if (params.limit) query.append("limit", params.limit);
                const queryString = query.toString();
                return queryString ? `/all-orders?${queryString}` : "/all-orders";
            },
            providesTags: (result) => {
                const payload = result?.data;
                const rows = Array.isArray(payload)
                    ? payload
                    : [payload?.orders, payload?.rows, payload?.data].find(Array.isArray) || [];
                return [
                    ...rows.map(({ id, _id }) => ({ type: "Orders", id: id || _id })),
                    { type: "Orders", id: "LIST" },
                ];
            },
        }),
        getSingleOrder: builder.query({
            query: (id) => `/get-order/${id}`,
            providesTags: (result, error, id) => [{ type: "Orders", id }],
        }),
        getAllHtoOrders: builder.query({
            query: (params = {}) => {
                if (params.export) return listRequest(`/all-hto-orders`, params, "hto-orders.csv", ["page", "limit", "status", "payment_status", "fromDate", "toDate", "search"]);
                const query = new URLSearchParams();
                if (params.status) query.append("status", params.status);
                if (params.payment_status) query.append("payment_status", params.payment_status);
                if (params.fromDate) query.append("fromDate", params.fromDate);
                if (params.toDate) query.append("toDate", params.toDate);
                if (params.search) query.append("search", params.search);
                if (params.page) query.append("page", params.page);
                if (params.limit) query.append("limit", params.limit);
                const queryString = query.toString();
                return queryString ? `/all-hto-orders?${queryString}` : "/all-hto-orders";
            },
            providesTags: (result) => {
                const payload = result?.data;
                const rows = Array.isArray(payload)
                    ? payload
                    : [payload?.orders, payload?.rows, payload?.data].find(Array.isArray) || [];
                return [
                    ...rows.map(({ id, _id }) => ({ type: "HtoOrders", id: id || _id })),
                    { type: "HtoOrders", id: "LIST" },
                ];
            },
        }),
        getHtoOrder: builder.query({
            query: (id) => `/get-hto-order/${id}`,
            providesTags: (result, error, id) => [{ type: "HtoOrders", id }],
        }),
        updateHtoOrderStatus: builder.mutation({
            query: ({ orderBody, orderId }) => ({
                url: `/update-hto-order-status/${orderId}`,
                method: "PUT",
                body: orderBody
            }),
            invalidatesTags: (result, error, { orderId }) => [
                { type: "HtoOrders", id: orderId },
                { type: "HtoOrders", id: "LIST" },
            ],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ orderBody, orderId }) => ({
                url: `/update-order-status/${orderId}`,
                method: "PUT",
                body: orderBody
            }),
            invalidatesTags: (result, error, { orderId }) => [
                { type: "Orders", id: orderId },
                { type: "Orders", id: "LIST" },
            ],
        }),
        markAsPaid: builder.mutation({
            query: ({ orderId }) => ({
                url: `/mark-as-paid/${orderId}`,
                method: "PUT",
                // body: 
            }),
            invalidatesTags: (result, error, { orderId }) => [
                { type: "Orders", id: orderId },
                { type: "Orders", id: "LIST" },
            ],
        }),
    })
})


export const { useGetAllOrdersQuery, useGetSingleOrderQuery, useGetAllHtoOrdersQuery, useGetHtoOrderQuery, useUpdateHtoOrderStatusMutation, useUpdateOrderStatusMutation, useMarkAsPaidMutation } = ordersAPIEndPoint
