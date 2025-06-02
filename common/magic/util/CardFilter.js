class CardFilter {
  constructor(opts) {
    this.kind = opts.kind
    this.value = opts.value
    this.operator = opts.operator || null
    this.or = opts.or || false
    this.only = opts.only || false

    this.red = opts.red || null
    this.green = opts.green || null
    this.black = opts.black || null
    this.white = opts.white || null
    this.blue = opts.blue || null
  }

  matches(card) {
    if (this.kind === 'legality') {
      return card.isLegalIn(this.value)
    }
    else if (this.kind === 'colors' || this.kind === 'identity') {
      const fieldValue = (this.kind === 'colors' ? card.colors() : card.colorIdentity()).map(c => c.toLowerCase())
      const targetValueMatches = ['white', 'blue', 'black', 'red', 'green']
        .map(color => this[color] ? colorNameToSymbol[color] : undefined)
        .filter(symbol => symbol !== undefined)
        .map(symbol => fieldValue.includes(symbol))

      // If no colors are specified in the filter, match only colorless cards
      if (targetValueMatches.length === 0) {
        return fieldValue.length === 0
      }

      if (this.or) {
        if (this.only) {
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
        if (this.only) {
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
    else {
      const fieldKey = fieldMapping[this.kind]

      // Check if the field is valid before proceeding
      if (!fieldKey) {
        throw new Error(`Unhandled filter field: ${this.kind}`)
      }

      const fieldValues = []

      if (card[fieldKey]()) {
        fieldValues.push(card[fieldKey]())
      }
      else {
        for (let i = 0; i < card.numFaces(); i++) {
          fieldValues.push(card[fieldKey](i))
        }
      }

      if (textFields.includes(this.kind)) {
        const lowerValues = fieldValues.map(x => x ? x.toLowerCase() : '')

        if (this.operator === 'or') {
          const targetValues = this.value.map(v => v.toLowerCase())
          return targetValues.some(targetValue =>
            lowerValues.some(fieldValue => fieldValue.includes(targetValue))
          )
        }

        else {
          const fieldValue = lowerValues.join(' ')
          const targetValue = this.value.toLowerCase()

          if (this.operator === 'and') {
            return fieldValue.includes(targetValue)
          }
          else if (this.operator === 'not') {
            return !fieldValue.includes(targetValue)
          }
          else {
            throw new Error(`Unhandled string operator: ${this.operator}`)
          }
        }
      }
      else if (numberFields.includes(this.kind)) {
        const targetValue = parseFloat(this.value)
        const floatValues = fieldValues.map(val => parseFloat(val))

        return floatValues.some(fieldValue => {
          if (fieldValue === -999) {
            return false
          }
          else if (this.operator === '=') {
            return fieldValue === targetValue
          }
          else if (this.operator === '>=') {
            return fieldValue >= targetValue
          }
          else if (this.operator === '<=') {
            return fieldValue <= targetValue
          }
          else {
            throw new Error(`Unhandled numeric operator: ${this.operator}`)
          }
        })
      }
    }
  }
}

const numberFields = ['cmc', 'power', 'toughness', 'loyalty', 'defense']
const textFields = ['name', 'text', 'flavor', 'set', 'type']
const fieldMapping = {
  cmc: 'cmc',
  colors: 'colors',
  defense: 'defense',
  flavor: 'flavorText',
  identity: 'colorIdentity',
  loyalty: 'loyalty',
  name: 'name',
  power: 'power',
  set: 'set',
  text: 'oracleText',
  toughness: 'toughness',
  type: 'typeLine',
}
const colorNameToSymbol = {
  white: 'w',
  blue: 'u',
  black: 'b',
  red: 'r',
  green: 'g',
}

module.exports = CardFilter
