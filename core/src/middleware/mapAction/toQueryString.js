// https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
export default obj => Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&')
