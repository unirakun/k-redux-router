import updateHistoryApi from './updateHistoryApi'

export default store => next => (action) => {
  // update store
  const res = next(action)

  // history-api should match
  updateHistoryApi(store, action)

  return res
}
