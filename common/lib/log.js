module.exports = {
  apply,
  toString,
}

function apply(entry) {
  return templateSubstitute(entry.template, entry.args)
}

function toString(entry) {
  const tokens = templateSubstitute(entry.template, entry.args)
  const message = tokens.map(t => t.value).join(' ')
  return `${entry.actor}: ${message}`
}

function templateSubstitute(template, args) {
  const tokens = templateTokenize(template)

  return tokens.map(({ substitute, token }) => {
    if (substitute) {
      const { value, kind, classes } = args[token]
      return {
        classes: classes.join(' '),
        value: token === 'card' ? kind : value
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
      token: token.trim(),
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
  push(template.substr(prev, template.length - prev), false)

  return tokens
}
