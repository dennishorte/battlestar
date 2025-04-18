class CardMethods {
  matchesFilters(filters) {
    return filters.every(filter => _applyOneFilter(card, filter))
  }
}

module.exports = CardMethods


////////////////////////////////////////////////////////////////////////////////
// Filter Logic

const numberFields = ['cmc', 'power', 'toughness', 'loyalty', 'defense']
const textFields = ['name', 'text', 'flavor', 'set', 'type']
const fieldMapping = {
  cmc: 'cmc',
  colors: 'colors',
  defense: 'defense',
  flavor: 'flavor_text',
  identity: 'color_identity',
  loyalty: 'loyalty',
  name: 'name',
  power: 'power',
  set: 'set',
  text: 'oracle_text',
  toughness: 'toughness',
  type: 'type_line',
}
const colorNameToSymbol = {
  white: 'W',
  blue: 'U',
  black: 'B',
  red: 'R',
  green: 'G',
}

function _applyOneFilter(card, filter) {
  if (card.data) {
    card = card.data
  }

  if (filter.kind === 'legality') {
    return 'legal' in card && card.legal.includes(filter.value)
  }
  else if (filter.kind === 'colors' || filter.kind === 'identity') {
    const fieldKey = fieldMapping[filter.kind]
    const fieldValue = fieldKey in card ? card[fieldKey] : []
    const targetValueMatches = ['white', 'blue', 'black', 'red', 'green']
      .map(color => filter[color] ? colorNameToSymbol[color] : undefined)
      .filter(symbol => symbol !== undefined)
      .map(symbol => fieldValue.includes(symbol))

    if (filter.or) {
      if (filter.only) {
        return (
          targetValueMatches.some(x => x)
          && fieldValue.length === targetValueMatches.filter(x => x).length
        )
      }
      else {
        return targetValueMatches.some(x => x)
      }
    }
    else {  // and
      if (filter.only) {
        return (
          targetValueMatches.every(x => x)
          && fieldValue.length === targetValueMatches.length
        )
      }
      else {
        return targetValueMatches.every(x => x)
      }
    }
  }
  else if (textFields.includes(filter.kind)) {
    const fieldKey = fieldMapping[filter.kind]

    const fieldValues = []

    if (fieldKey in card) {
      fieldValues.push(card[fieldKey])
    }
    else {
      for (const face of card.card_faces) {
        if (fieldKey in face) {
          fieldValues.push(face[fieldKey])
        }
      }
    }

    if (filter.operator === 'or') {
      const fieldValue = fieldValues.map(v => v.toLowerCase())
      const targetValues = filter.value.map(v => v.toLowerCase())
      return targetValues.some(v => fieldValue.includes(v))
    }

    else {
      const fieldValue = fieldValues.join(' ').toLowerCase()
      const targetValue = filter.value.toLowerCase()

      if (filter.operator === 'and') {
        return fieldValue.includes(targetValue)
      }
      else if (filter.operator === 'not') {
        return !fieldValue.includes(targetValue)
      }
      else {
        throw new Error(`Unhandled string operator: ${filter.operator}`)
      }
    }
  }
  else if (numberFields.includes(filter.kind)) {
    const fieldKey = fieldMapping[filter.kind]
    const targetValue = parseFloat(filter.value)

    let fieldValues = []
    if (fieldKey in card) {
      fieldValues.push(card[fieldKey])
    }
    else {
      for (const face of card.card_faces) {
        if (fieldKey in face) {
          fieldValues.push(face[fieldKey])
        }
      }
    }
    fieldValues = fieldValues.map(val => parseFloat(val))


    return fieldValues.some(fieldValue => {
      if (fieldValue === -999) {
        return false
      }
      else if (filter.operator === '=') {
        return fieldValue === targetValue
      }
      else if (filter.operator === '>=') {
        return fieldValue >= targetValue
      }
      else if (filter.operator === '<=') {
        return fieldValue <= targetValue
      }
      else {
        throw new Error(`Unhandled numeric operator: ${filter.operator}`)
      }
    })
  }
  else {
    throw new Error(`Unhandled filter field: ${filter.kind}`)
  }

  return false
}
