const util = require('./util.js')


module.exports = {
  getSelectorType,
  minMax,
  validate,
}

// Returns the selector type: 'select' or 'action'
// Backward compatible: treats __UNSPECIFIED__ as 'action'
function getSelectorType(selector) {
  if (selector.type) {
    return selector.type
  }
  // Backward compatibility: __UNSPECIFIED__ means action type
  if (selector.choices === '__UNSPECIFIED__') {
    return 'action'
  }
  return 'select'
}


function validate(selector, selection, opts={}) {
  if (!opts.annotate) {
    selector = util.deepcopy(selector)
    selection = util.deepcopy(selection)
  }

  return _validate(
    _normalize(selector),
    _normalize(selection),
    opts
  )
}

function _normalize(selector) {
  const choices = selector.choices || selector.selection
  if (!choices) {
    return selector
  }

  for (let i = 0; i < choices.length; i++) {
    const opt = choices[i]

    if (typeof opt === 'string') {
      choices[i] = { title: opt }
    }
    else {
      choices[i] = _normalize(opt)
    }
  }
  return selector
}

function _validate(selector, selection, opts) {
  if (opts.annotate) {
    selection.annotation = {}
  }

  // If titles don't match, doesn't matter how the choices line up.
  if (!opts.ignoreTitle && selector.title !== selection.title) {
    if (opts.annotate) {
      selection.annotation.isValid = false
      selection.annotation.mismatch = 'title'
    }
    return {
      valid: false,
      mismatch: `${selector.title} !== ${selection.title}`
    }
  }

  // Action-type selectors have freeform input, just check title matched
  if (getSelectorType(selector) === 'action') {
    if (opts.annotate) {
      selection.annotation.isValid = true
    }
    return { valid: true }
  }

  const { min, max } = minMax(selector)

  // Test each selection in selection to see if it matches a valid choice in selector
  const unused = [...selector.choices]
  const matched = []
  const unmatched = []
  let exclusive = false
  let count = 0
  for (const sel of selection.selection) {
    for (const opt of unused) {
      if (sel.title === opt.title) {
        let match = true

        // If the selector selection had sub-choices, this must also validate against those.
        if (opt.choices) {
          if (!sel.selection) {
            match = false
          }
          else {
            match = _validate(opt, sel, opts).valid
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
    const title = unmatched[0].title
    return {
      valid: false,
      mismatch: `Selection ${title} didn't exist in the choices`
    }
  }
  else if (exclusive && count > 1) {
    if (opts.annotate) {
      selection.annotation.isValid = false
      selection.annotation.mismatch = 'exclusive'
    }
    return {
      valid: false,
      mismatch: `Exclusive choice mixed with other choices`
    }
  }
  else if (min <= count && count <= max) {
    if (opts.annotate) {
      selection.annotation.isValid = true
    }
    return { valid: true }
  }
  else {
    if (opts.annotate) {
      selection.annotation.isValid = false
      selection.annotation.mismatch = `failed test: ${min} <= ${count} <= ${max}`
    }
    return {
      valid: false,
      mismatch: `Invalid number of options selected: expected ${min}-${max}, got ${count}`,
    }
  }
}

function minMax(selector) {
  // Action-type selectors don't have enumerated choices
  if (getSelectorType(selector) === 'action') {
    return { min: 0, max: Infinity }
  }

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
    max = selector.choices.length
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

  min = Math.min(min, selector.choices.length)
  max = Math.min(max, selector.choices.length)

  return { min, max }
}
