export default (store, action) => {
  console.log('updateHistoryApi')
  console.log({ state: store.getState(), action })
}
