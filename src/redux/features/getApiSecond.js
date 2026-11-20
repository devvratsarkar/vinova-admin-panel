// created by - devvrat 
import { commonDataSlice } from "../slices/commonApiSlice";
import { listParams, listRequest } from "./listParams";

export const allGetApiCall = commonDataSlice.injectEndpoints({
    endpoints: (builder) => ({
        // blogs 
        getAllBlogs: builder.query({
            query: (params) => {
                if (params?.export) return listRequest(`/blog`, params, "blogs.csv");
                const query = params && typeof params === "object" ? listParams(params) : {};
                return Object.keys(query).length ? { url: `/blog`, params: query } : `/blog`;
            },
            providesTags: ["Blogs"],
        }),
        getSingleBlogs: builder.query({
            query: (blogId) => `/blog/${blogId}`,
        }),
        getTrashedBlogs: builder.query({
            query: () => `/blog/trashed`,
            providesTags: ["DeletedBlogs"],
        }),

        // blog category
        getAllBlogsCategory: builder.query({
            query: (params) => {
                if (params?.export) return listRequest(`/get-blog-category`, params, "blog-categories.csv");
                const query = params && typeof params === "object" ? listParams(params) : {};
                return Object.keys(query).length ? { url: `/get-blog-category`, params: query } : `/get-blog-category`;
            },
            providesTags: ["BlogCategories"],
        }),
        getAllBlogsCategoryTrash: builder.query({
            query: () => `/trashed-blog-category`,
            providesTags: ["DeletedBlogCategories"],
        }),
        getSingleBlogsCategory: builder.query({
            query: (categoryId) => `/blog-category/${categoryId}`,
        }),


        // blog tags
        getAllBlogsTags: builder.query({
            query: (params) => {
                if (params?.export) return listRequest(`/blog-tag`, params, "blog-tags.csv");
                const query = params && typeof params === "object" ? listParams(params) : {};
                return Object.keys(query).length ? { url: `/blog-tag`, params: query } : `/blog-tag`;
            },
            providesTags: ["BlogTags"],
        }),
        getAllBlogsTagsTrash: builder.query({
            query: () => `/blog-tag/trashed`,
            providesTags: ["DeletedBlogTags"],
        }),
        getSingleBlogsTags: builder.query({
            query: ({ tagId }) => `/blog-tags/${tagId}`,
        }),
        // blog comment
        getAllBlogsComments: builder.query({
            query: () => `/all-comments`,
        }),
        updateCommentStatus: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/accept-reject-comment/${id}`,
                method: "PUT",
                body: formData
            })
        }),
        // users
        getCustomer: builder.query({
            query: () => `/get-all-users`,
        }),
        getAllUsers: builder.query({
            query: (params) => {
                if (params?.export) return listRequest(`/all-users`, params, "customers.csv");
                const query = params && typeof params === "object" ? listParams(params) : {};
                return Object.keys(query).length
                    ? { url: `/all-users`, params: query }
                    : `/all-users`;
            },
            providesTags: ["Customers"],
        }),
        getAllContactEnquiries: builder.query({
            query: (params) => {
                if (params?.export) return listRequest(`/all-contacts`, params, "contact-enquiries.csv");
                const query = params && typeof params === "object" ? listParams(params) : {};
                return Object.keys(query).length
                    ? { url: `/all-contacts`, params: query }
                    : `/all-contacts`;
            },
        }),
        getAllEnquiries: builder.query({
            query: ({ page = 1, limit = 10 } = {}) => `/all-enquiries?page=${page}&limit=${limit}`,
        }),
        getAllJobApplications: builder.query({
            query: (params) => {
                if (params?.export) return listRequest(`/all-job-applications`, params, "job-applications.csv");
                const query = params && typeof params === "object" ? listParams(params) : {};
                return Object.keys(query).length
                    ? { url: `/all-job-applications`, params: query }
                    : `/all-job-applications`;
            },
        }),
        getAllOptometristEnquiries: builder.query({
            query: () => `/optometrist-enquiry`,
        }),
        getAllReviews: builder.query({
            query: (params) => {
                if (params?.export) return listRequest(`/all-review`, params, "reviews.csv");
                const query = params && typeof params === "object" ? listParams(params) : {};
                return Object.keys(query).length
                    ? { url: `/all-review`, params: query }
                    : `/all-review`;
            },
            providesTags: ["Reviews"],
        }),
    }),
});

export const {
    // blog
    useGetAllBlogsQuery,
    useGetSingleBlogsQuery,
    useGetTrashedBlogsQuery,

    // blog category
    useGetAllBlogsCategoryQuery,
    useGetAllBlogsCategoryTrashQuery,
    useGetSingleBlogsCategoryQuery,


    // blog tags
    useGetAllBlogsTagsQuery,
    useGetSingleBlogsTagsQuery,
    useGetAllBlogsTagsTrashQuery,
    useGetAllBlogsCommentsQuery,
    useUpdateCommentStatusMutation,

    // users
    useGetCustomerQuery,
    useGetAllUsersQuery,
    useGetAllContactEnquiriesQuery,
    useGetAllEnquiriesQuery,
    useGetAllJobApplicationsQuery,
    useGetAllOptometristEnquiriesQuery,
    useGetAllReviewsQuery,

} = allGetApiCall;
