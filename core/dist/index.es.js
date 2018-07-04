import r from"path-to-regexp";var t,e,n,o=function(r){return function(t,e,n){return{type:r,payload:{code:t,params:{path:e,query:n}}}}},u={push:o("@@router/PUSH"),replace:o("@@router/REPLACE"),goBack:function(r){return void 0===r&&(r=1),{type:"@@router/GO_BACK",payload:r}},goForward:function(r){return void 0===r&&(r=1),{type:"@@router/GO_FORWARD",payload:r}}},a="@@router/ROUTE_FOUND",i=Object.assign(function(r){return{type:a,payload:Object.assign({found:!0},r)}},{type:a});function c(r,e){return function(n){var o=r.location;if(o.pathname){var u,a=e.getState(n.getState()).routes.array.find(function(r){return!!(u=r.href.regexp.exec(o.pathname))});if(!a)return;u=a.href.parsed.map(function(r){return r.name}).filter(Boolean).reduce(function(r,e,n){return Object.assign(((t={})[e]=u[n+1],t),r)},{}),n.dispatch(i({route:a,params:{path:u,query:function(r){if(r.search.length<2)return{};var t=r.search.substring(1);return JSON.parse('{"'+decodeURI(t).replace(/"/g,'\\"').replace(/&/g,'","').replace(/=/g,'":"')+'"}')}(o)}}))}}}function f(r,t){var e=r.history;return function(r){return function(n){var o,u=n.type,a=n.payload;switch(u){case"@@router/GO_FORWARD":return void e.go(a);case"@@router/GO_BACK":return void e.go(-1*a);case"@@router/REPLACE":case"@@router/PUSH":var c=a.code,f=a.params;void 0===f&&(f={});var s=t.getState(r.getState()).routes.map[c];if(s){var p=s.href,d={};f&&f.path&&p.parsed&&p.parsed.filter(function(r){return"object"==typeof r}).map(function(r){return r.name}).filter(function(r){return f.path[r]}).forEach(function(r){d[r]=f.path[r]});var l="",v=p.base;p.compiled&&(v=p.compiled(d)),f.query&&(l="?"+(o=f.query,Object.keys(o).map(function(r){return encodeURIComponent(r)+"="+encodeURIComponent(o[r])}).join("&"))),v=""+v+l,"@@router/PUSH"===u?e.pushState(void 0,void 0,v):e.replaceState(void 0,void 0,v);var g=Object.assign({},f);return f&&f.path&&(g.path=d),i({route:s,params:g})}return;default:return}}}}function s(r){var t=function(t){return r(t).result},e=function(r){return t(r).route},n=function(r){return function(t){return e(t)[r]}},o=function(r){return t(r).params},u=function(r){return o(r).path},a=function(r){return o(r).query},i=function(r){return function(t){var e=u(t);if(e)return e[r]}},c=function(r){return function(t){if(a(t))return a(t)[r]}};return{getState:r,getRoute:function(t){return function(e){return r(e).routes.map[t]}},getResult:t,getCurrentCode:function(r){return e(r).code},getCurrentRoute:e,isFound:function(r){return t(r).found},getResultParam:n,getParams:o,getPathParams:u,getQueryParams:a,getPathParam:i,getQueryParam:c,getParam:function(r){return function(t){return n(r)(t)||i(r)(t)||c(r)(t)}}}}function p(){return{type:"@@router/INIT"}}function d(r){return!("object"!=typeof r||!r.code)}var l={history:window&&window.history,location:window&&window.location};function v(t,o){void 0===o&&(o=l);var a=Object.assign({},l,o);if(!a.history)throw new Error("[k-redux-router] no history implementation is given");if(!a.location)throw new Error("[k-redux-router] no location implementation is given");var v={array:function(t){var n=[],o=function(t,u,a){var i={};u&&(i=Object.entries(u).filter(function(r){return!d(r[1])}).reduce(function(r,t){return Object.assign(r,((e={})[t[0]]=t[1],e))},{}));var c=a;u&&(c=Object.assign(i,a,{parent:u&&u.code,href:{base:t,compiled:t.includes(":")?r.compile(t):void 0,regexp:r(t),parsed:r.parse(t)}}),n.push(c)),Object.entries(a).filter(function(r){return d(r[1])}).forEach(function(r){var e=r[1];return o([t,r[0]].join("").replace("//","/"),c,e)})};return o("",void 0,t),n.forEach(function(r){Object.entries(r).forEach(function(t){var e=t[0],n=t[1],o=n;d(n)&&(o=n.code),r[e]=o})}),n}(t)};v.map=v.array.reduce(function(r,t){return Object.assign({},r,((n={})[t.code]=t,n))},{});var g=function(r,t){void 0===t&&(t={});var e=Object.assign({},{routes:r,result:{found:!1}}),n=function(r,t){void 0===r&&(r=e),void 0===t&&(t={});var n=t.payload;switch(t.type){case"@@router/ROUTE_FOUND":return Object.assign({},r,{result:n});default:return r}};return Object.assign(n,s(t.getState||function(r){return r.ui.router})),Object.assign(n,u),n}(v,a);return{middleware:function(r,t,e){var n=!1,o=c(t,e),u=f(t,e);return function(r){return function(t){return function(e){if(!e.type||!e.type.startsWith("@@router/"))return t(e);var a=t(e);"@@router/INIT"===e.type&&(o(r),n?console.warn("[k-redux-router] initialized twice"):(n=!0,window&&(window.onpopstate=function(){o(r)}))),n||e.type===i.type||console.warn("[k-redux-router] router should be initialized");var c=u(r)(e);return c&&r.dispatch(c),a}}}}(0,a,g),reducer:g,init:p}}export{u as actions,v as router,s as selectors};