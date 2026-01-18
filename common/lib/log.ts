interface LogArg {
  value: unknown
  classes?: string[]
}

interface LogEntry {
  type?: 'chat' | 'log'
  template: string
  args: Record<string, LogArg>
  indent: number
  author?: string
  text?: string
}

interface ChatEntry {
  type: 'chat'
  author: string
  text: string
}

interface Token {
  substitute: boolean
  token: string
}

interface FormattedToken {
  classes: string
  value: unknown
}

function apply(entry: LogEntry): FormattedToken[] {
  return templateSubstitute(entry.template, entry.args)
}

function toString(entry: LogEntry | ChatEntry): string {
  if (entry.type === 'chat') {
    return `chat> ${entry.author} ${entry.text}`
  }

  else {
    const tokens = templateSubstitute((entry as LogEntry).template, (entry as LogEntry).args)
    const message = tokens.map(t => t.value).join('')

    let indent = ''
    for (let i = 0; i < (entry as LogEntry).indent; i++) {
      indent += '..'
    }

    return `${indent}${message}`
  }
}

function templateSubstitute(template: string, args: Record<string, LogArg>): FormattedToken[] {
  const tokens = templateTokenize(template)

  return tokens.map(({ substitute, token }) => {
    if (substitute) {
      if (Object.keys(args).includes(token)) {
        const { value, classes } = args[token]
        return {
          classes: (classes || []).join(' '),
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

function templateTokenize(template: string): Token[] {
  let prev = 0
  let state: 'in' | 'out' = 'out'
  const tokens: Token[] = []

  const push = function(token: string, substitute: boolean): void {
    tokens.push({
      substitute: substitute,
      token: token,
    })
  }

  for (let i = 0; i < template.length; i++) {
    if (template[i] == '{') {
      if (state === 'in') {
        throw 'Nested curly braces'
      }
      state = 'in'

      if (prev == i) {
        continue
      }

      push(template.substr(prev, i-prev), false)
      prev = i
    }
    else if (template[i] == '}') {
      if (state !== 'in') {
        throw 'Unmatched closing curly brace'
      }
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

export { apply, toString, LogEntry, ChatEntry, LogArg, FormattedToken }
