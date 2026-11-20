import { optometristSlice } from "../slices/optometristSlice";
import { csvRequest } from "../../utils/fileDownload";

export const optometristAPIEndPoint = optometristSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ---------------optometrist-------------
        getOptometristUserProfile: builder.query({
            query: () => `/get-user-profile`,
            providesTags: ['OptometristProfile'],
        }),
        payOptometristPlan: builder.mutation({
            query: (body) => ({
                url: `/plan/pay`,
                method: "POST",
                body,
            }),
        }),
        renewOptometristPlan: builder.mutation({
            query: (body) => ({
                url: `/plan/renew`,
                method: "POST",
                body,
            }),
            invalidatesTags: ['OptometristProfile'],
        }),
        getOptometristPlanHistory: builder.query({
            query: ({ page, limit, status, plan_type, search, fromDate, toDate, export: shouldExport } = {}) => {
                const params = {}
                if (!shouldExport && page) params.page = page
                if (!shouldExport && limit) params.limit = limit
                if (status) params.status = status
                if (plan_type) params.plan_type = plan_type
                if (search) params.search = search
                if (fromDate) params.fromDate = fromDate
                if (toDate) params.toDate = toDate
                if (shouldExport) return csvRequest(`/plan-history`, params, 'plan-history.csv')
                return { url: `/plan-history`, params }
            },
        }),
        getOptometristPlanInvoice: builder.query({
            query: (id) => ({
                url: `/plan-history/${encodeURIComponent(id)}/invoice`,
                responseHandler: async (response) => {
                    const type = response.headers.get('content-type') || ''
                    if (!response.ok || type.includes('json')) {
                        const raw = await response.text()
                        try {
                            return raw ? JSON.parse(raw) : {}
                        } catch {
                            return { message: raw }
                        }
                    }
                    return response.blob()
                },
            }),
        }),
        getOptometristDashboard: builder.query({
            query: ({ period, fromDate, toDate } = {}) => {
                const params = {}
                if (period) params.period = period
                if (fromDate) params.fromDate = fromDate
                if (toDate) params.toDate = toDate
                return { url: `/dashboard`, params }
            },
        }),
        updateOptometristProfile: builder.mutation({
            query: (formData) => ({
                url: `/update-profile`,
                method: "PUT",
                body: formData,
            }),
        }),
        changeOptometristPassword: builder.mutation({
            query: (body) => ({
                url: `/change-password`,
                method: "POST",
                body,
            }),
        }),
        getAllOptometristStoreData: builder.query({
            query: (params) => params?.trash ? { url: `/store`, params: { trash: true } } : `/store`,
        }),
        addOptometristStore: builder.mutation({
            query: (formData) => ({
                url: `/store`,
                method: "POST",
                body: formData,
            }),
        }),
        getSingleOptometristStore: builder.query({
            query: (id) => `/store/${id}`
        }),
        updateSingleOptometristStoreData: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/store/${id}`,
                method: "PUT",
                body: formData
            })
        }),
        updateSingleOptometristStoreData: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/store/${id}`,
                method: "PUT",
                body: formData
            })
        }),
        getAllDeletedOptometristStoreData: builder.query({
            query: () => `/store/deleted`,
        }),
        softDeleteOptometristStore: builder.mutation({
            query: (id) => ({
                url: `/store/soft-delete/${id}`,
                method: "PUT",
            })
        }),
        restoreDeleteOptometristStore: builder.mutation({
            query: (id) => ({
                url: `/store/restore/${id}`,
                method: "PUT",
            })
        }),
        permanentDeleteOptometristStore: builder.mutation({
            query: (id) => ({
                url: `/store/${id}`,
                method: "DELETE",
            })
        }),
        getOptometristServices: builder.query({
            query: () => `/service`,
        }),
        addOptometristService: builder.mutation({
            query: (body) => ({
                url: `/service`,
                method: "POST",
                body,
            }),
        }),
        updateOptometristService: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/service/${id}`,
                method: "PUT",
                body,
            }),
        }),
        getOptometristWorkingRules: builder.query({
            query: (arg = {}) => {
                const visit_type = arg?.visit_type
                return {
                    url: `/working-rules`,
                    ...(visit_type ? { params: { visit_type } } : {}),
                }
            },
        }),
        saveOptometristWorkingRules: builder.mutation({
            query: (body) => ({
                url: `/working-rules`,
                method: "POST",
                body,
            }),
        }),
        getOptometristAvailability: builder.query({
            query: () => `/availability`,
        }),
        saveOptometristAvailability: builder.mutation({
            query: (body) => ({
                url: `/availability`,
                method: "POST",
                body,
            }),
        }),
        getOptometristAppointments: builder.query({
            query: ({ status, payment_status, type, fromDate, toDate, search, page, limit, export: shouldExport } = {}) => {
                const params = {}
                if (status && status !== 'all') params.status = status
                if (payment_status && payment_status !== 'all') params.payment_status = payment_status
                if (type && type !== 'all') params.type = type
                if (fromDate) params.fromDate = fromDate
                if (toDate) params.toDate = toDate
                if (search) params.search = search
                if (!shouldExport && page) params.page = page
                if (!shouldExport && limit) params.limit = limit
                if (shouldExport) return csvRequest(`/appointments`, params, 'appointments.csv')
                return { url: `/appointments`, params }
            },
        }),
        acceptOptometristAppointment: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/appointments/${id}/accept`,
                method: "PUT",
                body,
            }),
        }),
        rejectOptometristAppointment: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/appointments/${id}/reject`,
                method: "PUT",
                body,
            }),
        }),
        completeOptometristAppointment: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/appointments/${id}/complete`,
                method: "PUT",
                body,
            }),
        }),
        // updateOptometristAppointment: builder.mutation({
        //     query: ({ id, ...body }) => ({
        //         url: `/appointments/${id}`,
        //         method: "PUT",
        //         body,
        //     }),
        // }),
        getOptometristCustomers: builder.query({
            query: ({ filter, search, page, limit, export: shouldExport } = {}) => {
                const params = {}
                if (filter && filter !== 'all') params.filter = filter
                if (search) params.search = search
                if (!shouldExport && page) params.page = page
                if (!shouldExport && limit) params.limit = limit
                if (shouldExport) return csvRequest(`/customers`, params, 'customers.csv')
                return { url: `/customers`, params }
            },
        }),
        addOptometristCustomer: builder.mutation({
            query: (body) => ({
                url: `/customers`,
                method: "POST",
                body,
            }),
        }),
        addOptometristPrescription: builder.mutation({
            query: (body) => ({
                url: `/prescriptions`,
                method: "POST",
                body,
            }),
        }),
        uploadOptometristPrescription: builder.mutation({
            query: (formData) => ({
                url: `/prescriptions`,
                method: "POST",
                body: formData,
            }),
        }),
        updateOptometristPrescription: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/prescriptions/${id}`,
                method: "PUT",
                body,
            }),
        }),
        reuploadOptometristPrescription: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/prescriptions/${id}`,
                method: "PUT",
                body: formData,
            }),
        }),
        deleteOptometristPrescription: builder.mutation({
            query: (id) => ({
                url: `/prescriptions/${id}`,
                method: "DELETE",
            }),
        }),
        getOptometristBanks: builder.query({
            query: () => `/banks`,
            providesTags: ['OptometristBank'],
        }),
        getOptometristBank: builder.query({
            query: (id) => `/banks/${encodeURIComponent(id)}`,
            providesTags: ['OptometristBank'],
        }),
        addOptometristBank: builder.mutation({
            query: (body) => ({
                url: `/banks`,
                method: "POST",
                body,
            }),
            invalidatesTags: ['OptometristBank'],
        }),
        updateOptometristBank: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/banks/${encodeURIComponent(id)}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ['OptometristBank'],
        }),
        deleteOptometristBank: builder.mutation({
            query: (id) => ({
                url: `/banks/${encodeURIComponent(id)}`,
                method: "DELETE",
            }),
            invalidatesTags: ['OptometristBank'],
        }),
        getOptometristWithdrawalRequests: builder.query({
            query: ({ page, limit, status } = {}) => {
                const params = {}
                if (page) params.page = page
                if (limit) params.limit = limit
                if (status) params.status = status
                return { url: `/withdrawal-requests`, params }
            },
            providesTags: ['OptometristWithdrawal'],
        }),
        createOptometristWithdrawalRequest: builder.mutation({
            query: (body) => ({
                url: `/withdrawal-requests`,
                method: "POST",
                body,
            }),
            invalidatesTags: ['OptometristWithdrawal', 'OptometristTransaction', 'OptometristProfile'],
        }),
        getOptometristTransactions: builder.query({
            query: ({ page, limit, type, transaction_type, status, search, fromDate, toDate, export: shouldExport } = {}) => {
                const params = {}
                if (!shouldExport && page) params.page = page
                if (!shouldExport && limit) params.limit = limit
                if (type) params.type = type
                if (transaction_type) params.transaction_type = transaction_type
                if (status) params.status = status
                if (search) params.search = search
                if (fromDate) params.fromDate = fromDate
                if (toDate) params.toDate = toDate
                if (shouldExport) return csvRequest(`/transactions`, params, 'transactions.csv')
                return { url: `/transactions`, params }
            },
            providesTags: ['OptometristTransaction'],
        }),

    }),
});

export const {
    // optometrist 
    useGetOptometristUserProfileQuery,
    usePayOptometristPlanMutation,
    useRenewOptometristPlanMutation,
    useGetOptometristPlanHistoryQuery,
    useLazyGetOptometristPlanInvoiceQuery,
    useGetOptometristDashboardQuery,
    useUpdateOptometristProfileMutation,
    useChangeOptometristPasswordMutation,
    useGetAllOptometristStoreDataQuery,
    useAddOptometristStoreMutation,
    useGetSingleOptometristStoreQuery,
    useUpdateSingleOptometristStoreDataMutation,
    useGetAllDeletedOptometristStoreDataQuery,
    useSoftDeleteOptometristStoreMutation,
    useRestoreDeleteOptometristStoreMutation,
    usePermanentDeleteOptometristStoreMutation,
    useGetOptometristServicesQuery,
    useAddOptometristServiceMutation,
    useUpdateOptometristServiceMutation,
    useGetOptometristWorkingRulesQuery,
    useSaveOptometristWorkingRulesMutation,
    useGetOptometristAvailabilityQuery,
    useSaveOptometristAvailabilityMutation,
    useGetOptometristAppointmentsQuery,
    useAcceptOptometristAppointmentMutation,
    useRejectOptometristAppointmentMutation,
    useCompleteOptometristAppointmentMutation,
    // useUpdateOptometristAppointmentMutation,
    useGetOptometristCustomersQuery,
    useAddOptometristCustomerMutation,
    useAddOptometristPrescriptionMutation,
    useUploadOptometristPrescriptionMutation,
    useUpdateOptometristPrescriptionMutation,
    useReuploadOptometristPrescriptionMutation,
    useDeleteOptometristPrescriptionMutation,
    useGetOptometristBanksQuery,
    useGetOptometristBankQuery,
    useAddOptometristBankMutation,
    useUpdateOptometristBankMutation,
    useDeleteOptometristBankMutation,
    useGetOptometristWithdrawalRequestsQuery,
    useCreateOptometristWithdrawalRequestMutation,
    useGetOptometristTransactionsQuery,
} = optometristAPIEndPoint;
