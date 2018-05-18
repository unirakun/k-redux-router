export const push = (code, pathParams, queryParams) => ({
  type: '@@router/PUSH',
  payload: {
    code,
    params: {
      path: pathParams,
      query: queryParams,
    },
  },
})
