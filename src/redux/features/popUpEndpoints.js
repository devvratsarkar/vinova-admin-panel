import { catalogueSlice } from "../services/catalogueSlice";
import { listRequest } from "./listParams";

export const popUpEndPoints = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllPopUps: builder.query({
            query: () => `/get-pop-ups`,
        }),
        addPopUp: builder.mutation({
            query: (popUpBody) => ({
                url: `add-pop-up`,
                method: "POST",
                body: popUpBody
            })
        }),
        getSinglePOPUP: builder.query({
            query: (popupID) => `/get-pop-up/${popupID}`
        }),
        updatePopup: builder.mutation({
            query: ({ popupData, popupId }) => ({
                url: `update-pop-up/${popupId}`,
                method: "PUT",
                body: popupData
            })
        }),
        getLoginData: builder.query({
            query: (params = {}) => {
                if (params.export) return listRequest(`/get-login-data`, params, "login-data.csv");
                const query = new URLSearchParams();
                if (params.search) query.append("search", params.search);
                if (params.fromDate) query.append("fromDate", params.fromDate);
                if (params.toDate) query.append("toDate", params.toDate);
                if (params.page) query.append("page", params.page);
                if (params.limit) query.append("limit", params.limit);
                const queryString = query.toString();
                return queryString ? `/get-login-data?${queryString}` : "/get-login-data";
            },
        }),
        deletePopUp: builder.mutation({
            query: (popUpId) => ({
                url: `delete-pop-up/${popUpId}`,
                method: "DELETE"
            })
        })

    }),
});

export const { useGetAllPopUpsQuery, useAddPopUpMutation, useGetSinglePOPUPQuery, useUpdatePopupMutation, useGetLoginDataQuery, useDeletePopUpMutation } = popUpEndPoints;
