import { catalogueSlice } from "../services/catalogueSlice";
import { listParams } from "./listParams";

export const questionsAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        addQuestion: builder.mutation({
            query: (formData) => ({
                url: `/questions`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Questions"],
        }),
        updateQuestion: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/questions/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Questions"],
        }),
        getAllQuestions: builder.query({
            query: (params = {}) => ({
                url: `/questions`,
                method: "GET",
                params: listParams(params),
            }),
            providesTags: ["Questions"],
        }),
        getQuestionById: builder.query({
            query: (id) => ({
                url: `/questions/${id}`,
                method: "GET"
            })
        }),
        softDeleteQuestion: builder.mutation({
            query: (id) => ({
                url: `/questions/soft/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Questions", "DeletedQuestions"],
        }),
        restoreDeletedQuestion: builder.mutation({
            query: (id) => ({
                url: `/questions/restore/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Questions", "DeletedQuestions"],
        }),
        permanentDeleteQuestion: builder.mutation({
            query: (id) => ({
                url: `/questions/permanent/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Questions", "DeletedQuestions"],
        }),
        getAllSoftDeletedQuestions: builder.query({
            query: () => ({
                url: `/questions/all-soft-deleted`,
                method: "GET"
            }),
            providesTags: ["DeletedQuestions"],
        }),
        updateQuestionStatus: builder.mutation({
            query: (id) => ({
                url: `/questions-status/${id}`,
                method: "PUT"
            }),
            invalidatesTags: ["Questions"],
        })
    }),
});

export const { useAddQuestionMutation, useUpdateQuestionMutation, useGetAllQuestionsQuery, useGetQuestionByIdQuery, useSoftDeleteQuestionMutation, useRestoreDeletedQuestionMutation, usePermanentDeleteQuestionMutation, useGetAllSoftDeletedQuestionsQuery, useUpdateQuestionStatusMutation } = questionsAPIEndPoint;