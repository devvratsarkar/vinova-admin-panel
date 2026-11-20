import { catalogueSlice } from "../services/catalogueSlice";

export const membershipPlanAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllMembershipPlans: builder.query({
            query: () => `/membership-plan`,
            providesTags: ["MembershipPlans"],
        }),
        addMembershipPlan: builder.mutation({
            query: (formData) => ({
                url: `/membership-plan`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["MembershipPlans"],
        }),
        updateMembershipPlan: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/membership-plan/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["MembershipPlans"],
        }),
        deleteMembershipPlan: builder.mutation({
            query: (id) => ({
                url: `/membership-plan/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MembershipPlans"],
        }),
        restoreMembershipPlan: builder.mutation({
            query: (id) => ({
                url: `/restore-membership-plan/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["MembershipPlans"],
        }),
        getTrashedMembershipPlans: builder.query({
            query: () => `/membership-plan/trashed`,
            providesTags: ["MembershipPlans"],
        }),
    }),
});

export const {
    useGetAllMembershipPlansQuery,
    useAddMembershipPlanMutation,
    useUpdateMembershipPlanMutation,
    useDeleteMembershipPlanMutation,
    useRestoreMembershipPlanMutation,
    useGetTrashedMembershipPlansQuery,
} = membershipPlanAPIEndPoint;
