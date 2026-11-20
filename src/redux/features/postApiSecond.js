// created by - devvrat 
import { postApiDataSlice } from "../services/allPostApi";
import { commonDataSlice } from "../slices/commonApiSlice";

function refreshLists(tags) {
  return async (_arg, { dispatch, queryFulfilled }) => {
    try {
      await queryFulfilled;
      dispatch(commonDataSlice.util.invalidateTags(tags));
    } catch {
      // A failed save should leave the current list in place.
    }
  };
}

export const allPostApiCall = postApiDataSlice.injectEndpoints({
  endpoints: (builder) => ({
    // blogs
    editBlog: builder.mutation({
      query: ({ blogData, blogId }) => ({
        url: `/blog/edit/${blogId}`,
        method: "PUT",
        body: blogData,
      }),
      async onQueryStarted(_arg, api) {
        return refreshLists(["Blogs", "DeletedBlogs"])(_arg, api);
      },
    }),

    addNewBlog: builder.mutation({
      query: (blogData) => ({
        url: `/blog/create`,
        method: "POST",
        body: blogData,
      }),
      async onQueryStarted(_arg, api) {
        return refreshLists(["Blogs", "DeletedBlogs"])(_arg, api);
      },
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blog/soft-delete/${id}`,
        method: "PUT",
        // body: blogData,
      }),
      async onQueryStarted(_arg, api) {
        return refreshLists(["Blogs", "DeletedBlogs"])(_arg, api);
      },
    }),
    permanentBlog: builder.mutation({
      query: (id) => ({
        url: `/blog/delete/${id}`,
        method: "DELETE",
        // body: blogData,
      }),
      async onQueryStarted(_arg, api) {
        return refreshLists(["Blogs", "DeletedBlogs"])(_arg, api);
      },
    }),
    restoreDeletedPost: builder.mutation({
      query: (id) => ({
        url: `/blog/restore/${id}`,
        method: "PUT",
        // body: blogData,
      }),
      async onQueryStarted(_arg, api) {
        return refreshLists(["Blogs", "DeletedBlogs"])(_arg, api);
      },
    }),


    // blog category
    addNewBlogCategory: builder.mutation({
      query: (blogCategoryData) => ({
        url: `/blog-category/create`,
        method: "POST",
        body: blogCategoryData,
      }),
      onQueryStarted: refreshLists(["BlogCategories", "DeletedBlogCategories"]),
    }),
    editBlogCategory: builder.mutation({
      query: ({ cateId, cateData }) => ({
        url: `/update-blog-category/${cateId}`,
        method: "PUT",
        body: cateData,
      }),
      onQueryStarted: refreshLists(["BlogCategories", "DeletedBlogCategories"]),
    }),
    softDeleteBlogCategory: builder.mutation({
      query: (cateId) => ({
        url: `/soft-delete-blog-category/${cateId}`,
        method: "PUT",
        // body: cateData,
      }),
      onQueryStarted: refreshLists(["BlogCategories", "DeletedBlogCategories"]),
    }),
    permanentDeleteBlogCategory: builder.mutation({
      query: (cateId) => ({
        url: `/blog-category/delete/${cateId}`,
        method: "DELETE",
        // body: cateData,
      }),
      onQueryStarted: refreshLists(["BlogCategories", "DeletedBlogCategories"]),
    }),
    restoreDeletedBlogCategory: builder.mutation({
      query: (cateId) => ({
        url: `/delete-blog-category/${cateId}`,
        method: "PUT",
        // body: cateData,
      }),
      onQueryStarted: refreshLists(["BlogCategories", "DeletedBlogCategories"]),
    }),


    // blog tag
    addNewBlogTag: builder.mutation({
      query: (blogCategoryData) => ({
        url: `/blog-tag/create`,
        method: "POST",
        body: blogCategoryData,
      }),
      onQueryStarted: refreshLists(["BlogTags", "DeletedBlogTags"]),
    }),
    editBlogTag: builder.mutation({
      query: ({ id, data }) => ({
        url: `/blog-tag/update/${id}`,
        method: "PUT",
        body: data,
      }),
      onQueryStarted: refreshLists(["BlogTags", "DeletedBlogTags"]),
    }),
    softDeleteBlogTag: builder.mutation({
      query: (id) => ({
        url: `/blog-tag/soft-delete/${id}`,
        method: "PUT",
        // body: data,
      }),
      onQueryStarted: refreshLists(["BlogTags", "DeletedBlogTags"]),
    }),
    permanentDeleteBlogTag: builder.mutation({
      query: (id) => ({
        url: `/blog-tag/delete/${id}`,
        method: "DELETE",
        // body: data,
      }),
      onQueryStarted: refreshLists(["BlogTags", "DeletedBlogTags"]),
    }),
    retoreDeleteBlogTag: builder.mutation({
      query: (id) => ({
        url: `/blog-tag/restore/${id}`,
        method: "PUT",
      }),
      onQueryStarted: refreshLists(["BlogTags", "DeletedBlogTags"]),
    }),

    // customer
    updateCustomer: builder.mutation({
      query: (id) => ({
        url: `/update-user-status/${id}`,
        method: "PUT",
      }),
      onQueryStarted: refreshLists(["Customers"]),
    }),
    changeCustomerPassword: builder.mutation({
      query: (data) => ({
        url: `/user-change-password`,
        method: "POST",
        body: data,
      }),
    }),
    updateSubscribersStatus: builder.mutation({
      query: (id) => ({
        url: `/updateSubscribersStatus/${id}`,
        method: "PUT",
        // body: data,
      }),
    }),
    updateVendorStatus: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/approve-vendor-request/${id}`,
        body: formData,
        method: "PUT",
      }),
    }),
    updateOptometristEnquiryStatus: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/optometrist-enquiry/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),

    // review
    addReview: builder.mutation({
      query: (data) => ({
        url: `/review/create`,
        method: "POST",
        body: data,
      }),
      onQueryStarted: refreshLists(["Reviews"]),
    }),
    updateReviewStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/update-review-status/${id}`,
        method: "PUT",
        body: { status },
      }),
      onQueryStarted: refreshLists(["Reviews"]),
    }),
    packageBookingPaymentStatus: builder.mutation({
      query: (id) => ({
        url: `/booking-amount-paid/${id}`,
        method: "PUT"
      })
    }),
    blogBulkDelete: builder.mutation({
      query: (formData) => ({
        url: `/delete-comments`,
        method: "POST",
        body: formData
      })
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/delete-comment/${id}`,
        method: "DELETE"
      })
    })
  }),
});

export const {
  // blog
  useEditBlogMutation,
  useAddNewBlogMutation,
  useDeleteBlogMutation,
  usePermanentBlogMutation,
  useRestoreDeletedPostMutation,

  // blog category
  useAddNewBlogCategoryMutation,
  useEditBlogCategoryMutation,
  useSoftDeleteBlogCategoryMutation,
  usePermanentDeleteBlogCategoryMutation,
  useRestoreDeletedBlogCategoryMutation,


  // blog tag
  useAddNewBlogTagMutation,
  useEditBlogTagMutation,
  useSoftDeleteBlogTagMutation,
  usePermanentDeleteBlogTagMutation,
  useRetoreDeleteBlogTagMutation,


  // customer
  useUpdateCustomerMutation,
  useChangeCustomerPasswordMutation,
  useUpdateSubscribersStatusMutation,
  useUpdateVendorStatusMutation,
  useUpdateOptometristEnquiryStatusMutation,


  // review
  useAddReviewMutation,
  useUpdateReviewStatusMutation,

  usePackageBookingPaymentStatusMutation,

  useBlogBulkDeleteMutation,
  useDeleteCommentMutation
} = allPostApiCall;