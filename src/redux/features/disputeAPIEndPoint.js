import { catalogueSlice } from "../services/catalogueSlice";
import { listRequest } from "./listParams";

export const disputeAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllDisputes: builder.query({
            query: (params = {}) => params?.export
                ? listRequest(`/get-all-disputes`, params, "disputes.csv")
                : ({
                url: `/get-all-disputes`,
                params: {
                    ...(params.search && { search: params.search }),
                    ...(params.status && { status: params.status }),
                    ...(params.fromDate && { fromDate: params.fromDate }),
                    ...(params.toDate && { toDate: params.toDate }),
                    ...(params.page && { page: params.page }),
                    ...(params.limit && { limit: params.limit }),
                },
            }),
        }),
        getDisputeMessages: builder.query({
            query: (id) => `/get-dispute-messages/${id}`,
        }),
        updateDisputeStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/update-dispute-status/${id}`,
                method: "PUT",
                body: { status },
            }),
        }),
        sendDisputeMessage: builder.mutation({
            query: (body) => ({
                url: `/send-dispute-message`,
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useGetAllDisputesQuery,
    useGetDisputeMessagesQuery,
    useUpdateDisputeStatusMutation,
    useSendDisputeMessageMutation,
} = disputeAPIEndPoint;
