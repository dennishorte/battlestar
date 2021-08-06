const util = {}


util.foo = function() {
  console.log('Hello')
}


export default {
  install: function(Vue) {
    Object.defineProperty(Vue.prototype, '$util', { value: util })
  },
}
