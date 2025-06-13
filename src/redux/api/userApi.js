import { baseApi } from './baseApi';

const UserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllusers: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/users?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: 'GET',
      }),
      providesTags: ['user'],
    }),
    blockUnblockUser: builder.mutation({
      query: (payload) => ({ url: `/users/change-status`, method: 'PATCH', body: payload }),
      invalidatesTags: ['user'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['user'],
    }),
  }),
});

export const { useGetAllusersQuery, useBlockUnblockUserMutation, useDeleteUserMutation } = UserApi;
