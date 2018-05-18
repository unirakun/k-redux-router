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
export const goBack = (times = 1) => ({ type: '@@router/GO_BACK', payload: times })
