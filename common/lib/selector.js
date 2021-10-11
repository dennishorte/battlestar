const util = require('./util.js')


function validate(selector, selection) {
  // Sometimes options are just a simple array.
  // To make the validation code simpler, convert array options into a selector dict.
  if (Array.isArray(selector)) {
    selector = {
      operator: 'choose',
      min: 1,
      max: 1,
      options: selector,
    }
  }

  // When only selecting a single option, selectors support returning a string.
  // To make the validation code simpler, convert single string selections into an array.
  if (typeof selection === 'string') {
    selection = [selection]
  }


}
