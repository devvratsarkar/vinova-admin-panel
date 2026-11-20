import { catalogueSlice } from "../services/catalogueSlice";

export const userProfileAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateProfile: builder.mutation({
            query: (formData) => ({
                url: `/update-profile`,
                method: "PUT",
                body: formData
            })
        }),
        changePassword: builder.mutation({
            query: (formData) => ({
                url: `/change-password`,
                method: "PUT",
                body: formData
            })
        })
    }),
});

export const { useUpdateProfileMutation, useChangePasswordMutation } = userProfileAPIEndPoint;
