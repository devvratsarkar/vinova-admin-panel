import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../utils/config';
import toast from 'react-hot-toast';
import { withLangForGetIfSuperAdmin } from '../utils/appendLangToUrl';

const selectToken = state => state.auth.token;
const selectCountry = state => state.auth.country;

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
        const token = selectToken(getState());
        const country = selectCountry(getState());
        headers.set('client-id', '');
        headers.set('client-key', '');
        headers.set('Authorization', `Bearer ${token}`);
        const forcedCountry = headers.get('x-force-country');
        if (forcedCountry) {
            headers.set('x-country-code', forcedCountry);
            headers.delete('x-force-country');
        } else {
            headers.set('x-country-code', country || 'AE');
        }
        return headers;
    },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
    try {
        const finalArgs = withLangForGetIfSuperAdmin(args, api);
        const result = await baseQuery(finalArgs, api, extraOptions);
        if (result.error) {
            toast.error(result?.error?.data?.message);
            throw new Error(result?.error?.data?.message || result?.error?.error);
        }
        return { data: result.data };
    } catch (error) {
        return { error: error.message || 'error2' };
    }
};

export const commonDataSlice = createApi({
    reducerPath: 'commonDataSlice',
    baseQuery: baseQueryWithAuth,
    endpoints: builder => ({}),
    tagTypes: ['Blogs', 'DeletedBlogs', 'BlogCategories', 'DeletedBlogCategories', 'BlogTags', 'DeletedBlogTags', 'Customers', 'Reviews'],
});
