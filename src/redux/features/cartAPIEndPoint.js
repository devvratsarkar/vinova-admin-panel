import { catalogueSlice } from "../services/catalogueSlice";

export const cartAPIEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCarts: builder.query({
            query: (params = {}) => {
                const query = new URLSearchParams();
                if (params.search) query.append("search", params.search);
                if (params.fromDate) query.append("fromDate", params.fromDate);
                if (params.toDate) query.append("toDate", params.toDate);
                if (params.page) query.append("page", params.page);
                if (params.limit) query.append("limit", params.limit);
                const queryString = query.toString();
                return queryString ? `/all-cart?${queryString}` : "/all-cart";
            },
        }),
        getSingleCart: builder.query({
            query: (id) => `/cart/${id}`
        }),
        getWishlist: builder.query({
            query: (params = {}) => {
                const query = new URLSearchParams();
                if (params.search) query.append("search", params.search);
                if (params.fromDate) query.append("fromDate", params.fromDate);
                if (params.toDate) query.append("toDate", params.toDate);
                if (params.page) query.append("page", params.page);
                if (params.limit) query.append("limit", params.limit);
                const queryString = query.toString();
                return queryString ? `/wishlist?${queryString}` : "/wishlist";
            },
            providesTags: [{ type: "Wishlist", id: "LIST" }],
        }),
        removeWishlist: builder.mutation({
            query: (id) => ({
                url: `/remove-wishlist/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
        }),
    }),
});

export const {
    useGetAllCartsQuery,
    useGetSingleCartQuery,
    useGetWishlistQuery,
    useRemoveWishlistMutation,
} = cartAPIEndPoint;