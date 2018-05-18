const type = '@@router/ROUTE_FOUND'

export default Object.assign(
  result => ({ type, payload: Object.assign({ found: true }, result) }),
  {
    type,
  },
)
