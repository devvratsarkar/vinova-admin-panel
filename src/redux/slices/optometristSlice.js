import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { OPTOMETRIST_API_BASE_URL } from '../../utils/config';
import toast from 'react-hot-toast';

const selectToken = (state) => state.auth.token;
const selectCountry = (state) => state.auth.country;

const baseQuery = fetchBaseQuery({
    baseUrl: OPTOMETRIST_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = selectToken(getState());
        const country = selectCountry(getState());
        headers.set('client-id', '');
        headers.set('client-key', '');
        headers.set('Authorization', `Bearer ${token}`);
        headers.set('x-country-code', country || 'IR');
        return headers;
    },
});

const requestUrl = (args) => (typeof args === 'string' ? args : args?.url || '')

const baseQueryWithAuth = async (args, api, extraOptions) => {
    try {
        const result = await baseQuery(args, api, extraOptions);
        if (result.error) {
            const url = String(requestUrl(args));
            const method = typeof args === 'object' ? String(args.method || 'GET').toUpperCase() : 'GET';
            if (url.includes('availability') && method === 'GET' && result.error.status === 404) {
                return { data: { data: {}, http_status_code: 404 } };
            }
            if (url.includes('appointments') && method === 'GET' && result.error.status === 404) {
                return { data: { data: [], http_status_code: 404 } };
            }
            if (url.includes('appointments') && method === 'POST' && result.error.status === 404) {
                return { error: result.error };
            }
            if (url.includes('/customers') && method === 'GET' && result.error.status === 404) {
                return { data: { data: [], http_status_code: 404 } };
            }
            const path = url.split('?')[0]
            if (method === 'GET' && result.error.status === 404 && /\/(banks|withdrawal-requests|transactions)$/.test(path)) {
                return { data: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1 }, http_status_code: 200, success: true } };
            }
            const errorText = String(result.error.error || result.error?.data?.message || '')
            const aborted = result.error.status === 'FETCH_ERROR' && /abort/i.test(errorText)
            if (!aborted && result.error?.data?.message) toast.error(result.error.data.message)
            if (aborted) return { error: result.error }
            console.log('result.error --- ', result.error);
            
            throw new Error(result?.error?.data?.message || result?.error?.error);
        }
        return { data: result.data };
    } catch (error) {
        console.log('error --- ', error);
        return { error: error.message || 'error2' };
    }
};

export const optometristSlice = createApi({
    reducerPath: 'optometristSlice',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['OptometristProfile', 'OptometristBank', 'OptometristWithdrawal', 'OptometristTransaction'],
    endpoints: builder => ({}),
});

