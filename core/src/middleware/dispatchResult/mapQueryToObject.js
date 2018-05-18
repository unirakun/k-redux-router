/* eslint-env browser */

// https://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
export default () => {
  const { location } = window

  if (location.search.length < 2) return {}

  const search = location.search.substring(1)
  return JSON.parse(`{"${decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`)
}
