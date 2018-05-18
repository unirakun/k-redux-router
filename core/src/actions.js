const navigate = type => (code, pathParams, queryParams) => ({
  type,
  payload: {
    code,
    params: {
      path: pathParams,
      query: queryParams,
    },
  },
})

export const push = navigate('@@router/PUSH')
export const replace = navigate('@@router/REPLACE')
