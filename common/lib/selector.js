const util = require('./util.js')


module.exports = {
  minMax,
  validate,
}


function validate(selector, selection, annotate) {
  if (!annotate) {
    selector = util.deepcopy(selector)
    selection = util.deepcopy(selection)
  }

  return _validate(
    _normalize(selector),
    _normalize(selection),
    annotate
  )
}

function _normalize(selector) {
  const options = selector.options || selector.option
  if (!options) {
    return selector
  }

  for (let i = 0; i < options.length; i++) {
    const opt = options[i]

    if (typeof opt === 'string') {
      options[i] = { name: opt }
    }
    else {
      options[i] = _normalize(opt)
    }
  }
  return selector
}

function _validate(selector, selection, annotate) {
  if (annotate) {
    selection.annotation = {}
  }

  // If names don't match, doesn't matter how the options line up.
  if (selector.name !== selection.name) {
    if (annotate) {
      selection.annotation.isValid = false
      selection.annotation.mismatch = 'name'
    }
    return {
      valid: false,
      mismatch: `${selector.name} !== ${selection.name}`
    }
  }

  const { min, max } = minMax(selector)

  // Test each option in selection to see if it matches a valid choice in selector
  const unused = [...selector.options]
  const matched = []
  const unmatched = []
  let exclusive = false
  let count = 0
  for (const sel of selection.option) {
    for (const opt of unused) {
      if (sel.name === opt.name) {
        let match = true

        // If the selector option had sub-options, this must also validate against those.
        if (opt.options) {
          if (!sel.option) {
            match = false
          }
          else {
            match = _validate(opt, sel, annotate).valid
          }
        }

        if (match) {
          util.array.remove(unused, opt)
          matched.push(sel)
          if (!opt.extra) {
            count += 1
          }
          if (opt.exclusive) {
            exclusive = true
          }
          break
        }
      }
    }
    if (!matched.includes(sel)) {
      unmatched.push(sel)
    }
  }

  if (unmatched.length > 0) {
    const name = unmatched[0].name
    return {
      valid: false,
      mismatch: `Selection ${name} didn't exist in the options`
    }
  }
  else if (exclusive && count > 1) {
    if (annotate) {
      selection.annotation.isValid = false
      selection.annotation.mismatch = 'exclusive'
    }
    return {
      valid: false,
      mismatch: `Exclusive option mixed with other options`
    }
  }
  else if (min <= count && count <= max) {
    if (annotate) {
      selection.annotation.isValid = true
    }
    return { valid: true }
  }
  else {
    if (annotate) {
      selection.annotation.isValid = false
      selection.annotation.mismatch = `failed test: ${min} <= ${count} <= ${max}`
    }
    return {
      valid: false,
      mismatch: `Some selections didn't match with any options in the selector`,
    }
  }
}

function minMax(selector) {
  let min
  let max

  if (selector.count) {
    min = selector.count
    max = selector.count
  }
  else if (selector.min === undefined && selector.max === undefined) {
    min = 1
    max = 1
  }
  else if (selector.min !== undefined && selector.max === undefined) {
    min = selector.min
    max = selector.options.length
  }
  else if (selector.min === undefined && selector.max !== undefined) {
    min = 0
    max = selector.max
  }
  else {
    min = selector.min
    max = selector.max
  }
  util.assert(min <= max, `min (${min}) must be <= max (${max})`)

  return { min, max }
}
