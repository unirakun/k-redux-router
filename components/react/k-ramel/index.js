!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("react"),require("prop-types"),require("@k-ramel/react")):"function"==typeof define&&define.amd?define(["exports","react","prop-types","@k-ramel/react"],t):t(e["@k-redux-router/react-kramel"]={},e.React,null,null)}(this,function(e,t,r,n){"use strict";t=t&&t.hasOwnProperty("default")?t.default:t,r=r&&r.hasOwnProperty("default")?r.default:r;var o=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},u=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},c=function(e,t){var r={};for(var n in e)t.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(e,n)&&(r[n]=e[n]);return r},a=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},s=function(e,r){return function(n){var c,s;return s=c=function(c){function s(t,n){o(this,s);var u=a(this,(s.__proto__||Object.getPrototypeOf(s)).call(this,t,n));return u.toShow=function(){var t=u.context.store.getState();if(t.ui.router&&t.ui.router.result){var n=t.ui.router.result.route;if(r&&r.absolute){var o=e===n.code;o!==u.state.show&&u.setState(function(e){return i({},e,{show:o})})}else{for(var c=e===n.code;n&&n.parent&&!c;)n=t.ui.router.routes.map[n.parent],c=e===n.code;c!==u.state.show&&u.setState(function(e){return i({},e,{show:c})})}}else console.error("[k-redux-router] | There is no route found in `state.ui.router.result`")},u.state={show:!1},u}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(s,t.Component),u(s,[{key:"componentWillMount",value:function(){var e=this;this.unsubscribe=this.context.store.subscribe(function(){e.toShow()}),this.toShow()}},{key:"componentWillUnmount",value:function(){this.unsubscribe()}},{key:"render",value:function(){return this.state.show?t.createElement(n,this.props):null}}]),s}(),c.displayName=function(e){return"router("+(e.displayName||e.name||e.constructor&&e.constructor.name||"Unknown")+")"}(n),c.contextTypes={store:function(){return null}},s}};s.absolute=function(e,t){return s(e,i({},t,{absolute:!0}))};var l=function(e){var r=e.href,n=e.onClick,o=c(e,["href","onClick"]),u=o.className,i=o.children,a="",s=r.base;return r.compiled&&(s=r.compiled(o.path)),o.query&&(a="?"+toQueryString(o.query)),s=""+s+a,t.createElement("a",{className:u,href:s,onClick:n},i)};l.propTypes={className:r.string,children:r.node,href:r.string,onClick:r.func},l.defaultProps={className:void 0,children:void 0,href:void 0,onClick:void 0};var f=n.inject(function(e,t,r){var n=t.onClick,o=t.code,u=t.query,i=c(t,["onClick","code","query"]);r.router;return{href:e.getState().ui.router.routes.map[o],onClick:function(t){n&&n(t),function(e){return function(e){return!!(e.shiftKey||e.altKey||e.metaKey||e.ctrlKey)}(e)||function(e){return e.button&&0!==e.button}(e)||e.defaultPrevented}(t)||(e.dispatch(e.ui.router.push(o,i,u)),t.preventDefault())}}})(l);e.driver=function(){console.log("DRIVER TODO [k-redux-router]")},e.forRoute=s,e.Link=f,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=index.js.map