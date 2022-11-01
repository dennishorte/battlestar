const CardUtil = {}

CardUtil.isLand = function(card) {
  return card.type_line.toLowerCase().includes('land')
}

CardUtil.isArtifact = function(card) {
  return card.type_line.toLowerCase().includes('artifact')
}

CardUtil.parseRulesLine = function(line) {
  const output = {
    isScar: false,
    parts: [],
  }

  const newPart = () => ({
    type: 'text',
    text: '',
  })

  if (line.startsWith('+ ')) {
    output.isScar = true
    line = line.slice(2)
  }

  let part = newPart()

  const close = () => {
    if (part.text) {
      output.parts.push(part)
      part = newPart()
    }
  }

  for (let i = 0; i < line.length; i++) {
    const ch = line.charAt(i)

    if (ch === '{') {
      if (part.type === 'symbol') {
        throw new Error('text parse error: already in a symbol')
      }
      close()
      part.type = 'symbol'
    }

    else if (ch === '}') {
      if (part.type !== 'symbol') {
        throw new Error('text parse error: unmatched close curly')
      }
      part.text = this.manaSymbolFromString(part.text)
      close()
    }

    else if (ch === '(') {
      if (part.type === 'reminder') {
        throw new Error('text parse error: already in a reminder')
      }
      close()
      part.type = 'reminder'
    }

    else if (ch === ')') {
      if (part.type !== 'reminder') {
        throw new Error('text parse error: unmatched close paren')
      }
      close()
    }

    else {
      part.text += ch
    }
  }

  close()

  return output
}

CardUtil.parseOracleText = function(text) {
  const output = []

  for (const line of text.split('\n')) {
    try {
      output.push(this.parseRulesLine(line))
    }
    catch (e) {
      console.log(e.message)
      output.push({
        type: 'parse_error',
        text,
      })
    }
  }

  return output
}

CardUtil.frameColor = function(card) {
  if (card.colors.length === 1) {
    switch (card.colors[0]) {
      case 'R': return 'red';
      case 'W': return 'white';
      case 'U': return 'blue';
      case 'G': return 'green';
      case 'B': return 'black';
      default:
        throw new Error('Unknown single color: ' + card.colors[0])
    }
  }

  else if (card.colors.length > 1) {
    return 'gold'
  }

  else if (this.isLand(card)) {
    return 'land'
  }

  else {
    return 'artifact'
  }
}

CardUtil.manaSymbolFromString = function(text) {
  if (text.charAt(0) === '{' && text.charAt(text.length-1) === '}') {
    text = text.substr(1, text.length-2)
  }

  if (text == '1/2') {
    return 'ms-1-2'
  }
  else {
    text = text.replace('/', '').toLowerCase().trim()

    if (text == 't') {
      return 'tap'
    }
    else if (text == 'q') {
      return 'untap'
    }
    else if (text == 'inf') {
      return 'infinity'
    }
    else {
      if (['uw', 'wg', 'gr', 'rb', 'bu', 'w2', 'u2', 'b2', 'r2', 'g2'].indexOf(text) >= 0) {
        text = util.string_reverse(text)
      }

      return text
    }
  }
}

CardUtil.manaSymbolsFromString = function(string) {
  var curr = ''
  let symbols = []

  for (var i = 0; i < string.length; i++) {
    let ch = string.charAt(i)
    curr += ch

    if (ch == '}') {
      symbols.push(this.manaSymbolFromString(curr))
      curr = ''
    }
  }

  return symbols
}

export default CardUtil
