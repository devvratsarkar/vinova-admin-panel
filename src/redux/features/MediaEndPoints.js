import { catalogueSlice } from "../services/catalogueSlice";

export const MediaEndPoints = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllMedia: builder.query({
            query: (params = {}) => {
                const query = new URLSearchParams();
                if (params.fromDate) query.append("fromDate", params.fromDate);
                if (params.toDate) query.append("toDate", params.toDate);
                const queryString = query.toString();
                return queryString ? `/get-all-media?${queryString}` : "/get-all-media";
            },
            providesTags: ["MediaList"],
        }),
        addMedia: builder.mutation({
            query: (mediaData) => ({
                url: `/add-media`,
                method: "POST",
                body: mediaData,
            }),
            invalidatesTags: ["MediaList"],
        }),
        getSingleMedia: builder.query({
            query: (mediaId) => `/get-media/${mediaId}`,
        }),
        deleteMedia: builder.mutation({
            query: (mediaId) => ({
                url: `/delete-media/${mediaId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MediaList"],
        }),
    }),
});

export const {
    useGetAllMediaQuery,
    useAddMediaMutation,
    useGetSingleMediaQuery,
    useDeleteMediaMutation,
} = MediaEndPoints;
