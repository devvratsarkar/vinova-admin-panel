import { catalogueSlice } from "../services/catalogueSlice";

export const JobOpeningAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        addJobOpening: builder.mutation({
            query: (formData) => ({
                url: `/add-job-opening`,
                method: "POST",
                body: formData,
            }),
        }),

        getJobOpenings: builder.query({
            query: (params) => params?.trash ? { url: `/job-opening`, params: { trash: true } } : `/job-opening`,
        }),

        getTrashedJobOpenings: builder.query({
            query: () => `/trashed-job-opening`,
        }),

        getSingleJobOpening: builder.query({
            query: (id) => `/single-job-opening/${id}`,
        }),

        editJobOpening: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/edit-job-opening/${id}`,
                method: "PUT",
                body: formData,
            }),
        }),

        changeJobOpeningStatus: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/job-opening-status-change/${id}`,
                method: "PUT",
                body: formData
            }),
        }),

        deleteJobOpening: builder.mutation({
            query: (id) => ({
                url: `/delete-job-opening/${id}`,
                method: "DELETE",
            }),
        }),

        softDeleteJobOpening: builder.mutation({
            query: (id) => ({
                url: `/soft-delete-job-opening/${id}`,
                method: "PUT",
            }),
        }),

        restoreJobOpening: builder.mutation({
            query: (id) => ({
                url: `/restore-job-opening/${id}`,
                method: "PUT",
            }),
        }),
    }),
});


export const {
    useAddJobOpeningMutation,
    useGetJobOpeningsQuery,
    useGetTrashedJobOpeningsQuery,
    useGetSingleJobOpeningQuery,
    useEditJobOpeningMutation,
    useChangeJobOpeningStatusMutation,
    useDeleteJobOpeningMutation,
    useSoftDeleteJobOpeningMutation,
    useRestoreJobOpeningMutation,
} = JobOpeningAPIEndPoint;
