import {
    createSelector,
    createEntityAdapter
  } from "@reduxjs/toolkit";
  import { apiSlice } from "../../app/api/apiSlice"
  
  const scoresAdapter = createEntityAdapter({})
  
  const initialState = scoresAdapter.getInitialState()
  
  export const scoresApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getScores: builder.query({
            query: () => '/scores',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedScores = responseData.map(score => {
                    score.id = score._id
                    return score
                });
                return scoresAdapter.setAll(initialState, loadedScores)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Score', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Score', id }))
                    ]
                } else return [{ type: 'Score', id: 'LIST' }]
            }
        }),
        addNewScore: builder.mutation({
            query: initialScoreData => ({
                url: '/scores',
                method: 'POST',
                body: {
                    ...initialScoreData,
                }
            }),
            invalidatesTags: [
                { type: 'Score', id: "LIST" }
            ]
        }),
        updateScore: builder.mutation({
            query: initialScoreData => ({
                url: '/scores',
                method: 'PATCH',
                body: {
                    ...initialScoreData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Score', id: arg.id }
            ]
        }),
        deleteScore: builder.mutation({
            query: ({ id }) => ({
                url: `/scores`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Score', id: arg.id }
            ]
        }),
    }),
  })
  
  export const {
    useGetScoresQuery,
    useAddNewScoreMutation,
    useUpdateScoreMutation,
    useDeleteScoreMutation,
  } = scoresApiSlice
  
  // returns the query result object
  export const selectScoresResult = scoresApiSlice.endpoints.getScores.select()
  // creates memoized selector
  const selectScoresData = createSelector(
      selectScoresResult,
      scoresResult => scoresResult.data // normalized state object with ids & entities
    )
    
    //getSelectors creates these selectors and we rename them with aliases using destructuring
    export const {
        selectAll: selectAllScores,
        selectById: selectScoreById,
        selectIds: selectScoreIds
        // Pass in a selector that returns the scores slice of state
    } = scoresAdapter.getSelectors(state => selectScoresData(state) ?? initialState)
    