const util = require('./util.js')

module.exports = {
  apply,
  toString,
}

function apply(entry) {
  return templateSubstitute(entry.template, entry.args)
}

function toString(entry) {
  const tokens = templateSubstitute(entry.template, entry.args)
  const message = tokens.map(t => t.value).join('')

  let indent = ''
  for (let i = 0; i < entry.indent; i++) {
    indent += '..'
  }

  return `${indent}${message}`
}

function templateSubstitute(template, args) {
  const tokens = templateTokenize(template)

  return tokens.map(({ substitute, token }) => {
    if (substitute) {
      if (Object.keys(args).includes(token)) {
        const { value, kind, classes } = args[token]
        return {
          classes: classes.join(' '),
          value: value,
        }
      }
      else {
        return {
          classes: '',
          value: '{' + token + '}'
        }
      }
    }
    else {
      return {
        classes: '',
        value: token,
      }
    }
  })
}

function templateTokenize(template) {
  let prev = 0
  let state = 'out'
  const tokens = []

  const push = function(token, substitute) {
    tokens.push({
      substitute: substitute,
      token: token,
    })
  }

  for (let i = 0; i < template.length; i++) {
    if (template[i] == '{') {
      if (state === 'in') throw 'Nested curly braces'
      state = 'in'

      if (prev == i) continue

      push(template.substr(prev, i-prev), false)
      prev = i
    }
    else if (template[i] == '}') {
      if (state !== 'in') throw 'Unmatched closing curly brace'
      push(template.substr(prev+1, i-prev-1), true)
      state = 'out'
      prev = i + 1
    }
  }

  // Catch the last token, if any
  if (prev != template.length) {
    push(template.substr(prev, template.length - prev), false)
  }

  return tokens
}
