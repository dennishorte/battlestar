import util from './util.js'

interface Choice {
  title: string
  choices?: Choice[]
  selection?: Choice[]
  extra?: boolean
  exclusive?: boolean
}

interface Selector {
  title?: string
  choices?: Choice[] | string[] | unknown[] | '__UNSPECIFIED__'
  selection?: Choice[] | string[] | unknown[]
  count?: number
  min?: number
  max?: number
}

interface Annotation {
  isValid?: boolean
  mismatch?: string
}

interface AnnotatedSelector extends Selector {
  annotation?: Annotation
}

interface ValidateOptions {
  annotate?: boolean
  ignoreTitle?: boolean
}

interface ValidateResult {
  valid: boolean
  mismatch?: string
}

interface MinMaxResult {
  min: number
  max: number
}

function validate(selector: Selector, selection: Selector, opts: ValidateOptions = {}): ValidateResult {
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

function _normalize(selector: Selector): Selector {
  const choices = selector.choices || selector.selection
  if (!choices) {
    return selector
  }

  for (let i = 0; i < choices.length; i++) {
    const opt = choices[i]

    if (typeof opt === 'string') {
      (choices as Choice[])[i] = { title: opt }
    }
    else {
      (choices as Choice[])[i] = _normalize(opt as Selector) as Choice
    }
  }
  return selector
}

function _validate(selector: Selector, selection: AnnotatedSelector, opts: ValidateOptions): ValidateResult {
  if (opts.annotate) {
    selection.annotation = {}
  }

  // If titles don't match, doesn't matter how the choices line up.
  if (!opts.ignoreTitle && selector.title !== selection.title) {
    if (opts.annotate) {
      selection.annotation!.isValid = false
      selection.annotation!.mismatch = 'title'
    }
    return {
      valid: false,
      mismatch: `${selector.title} !== ${selection.title}`
    }
  }

  const { min, max } = minMax(selector)

  // Test each selection in selection to see if it matches a valid choice in selector
  const unused = [...(selector.choices as Choice[])]
  const matched: Choice[] = []
  const unmatched: Choice[] = []
  let exclusive = false
  let count = 0
  for (const sel of (selection.selection as Choice[])) {
    for (const opt of unused) {
      if (sel.title === opt.title) {
        let match = true

        // If the selector selection had sub-choices, this must also validate against those.
        if (opt.choices) {
          if (!sel.selection) {
            match = false
          }
          else {
            match = _validate(opt as Selector, sel as AnnotatedSelector, opts).valid
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
      selection.annotation!.isValid = false
      selection.annotation!.mismatch = 'exclusive'
    }
    return {
      valid: false,
      mismatch: `Exclusive choice mixed with other choices`
    }
  }
  else if (min <= count && count <= max) {
    if (opts.annotate) {
      selection.annotation!.isValid = true
    }
    return { valid: true }
  }
  else {
    if (opts.annotate) {
      selection.annotation!.isValid = false
      selection.annotation!.mismatch = `failed test: ${min} <= ${count} <= ${max}`
    }
    return {
      valid: false,
      mismatch: `Some selections didn't match with any choices in the selector`,
    }
  }
}

function minMax(selector: Selector): MinMaxResult {
  let min: number
  let max: number

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
    max = (selector.choices as unknown[]).length
  }
  else if (selector.min === undefined && selector.max !== undefined) {
    min = 0
    max = selector.max
  }
  else {
    min = selector.min!
    max = selector.max!
  }
  util.assert(min <= max, `min (${min}) must be <= max (${max})`)

  min = Math.min(min, (selector.choices as unknown[]).length)
  max = Math.min(max, (selector.choices as unknown[]).length)

  return { min, max }
}

export { minMax, validate, Selector, Choice, ValidateOptions, ValidateResult, MinMaxResult }
