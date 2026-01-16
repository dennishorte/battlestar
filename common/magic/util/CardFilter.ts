interface CardFilterOptions {
  kind: string
  value: string | string[]
  operator?: string | null
  or?: boolean
  only?: boolean
  red?: boolean | null
  green?: boolean | null
  black?: boolean | null
  white?: boolean | null
  blue?: boolean | null
}

interface FilterableCard {
  isLegalIn(format: string): boolean
  colors(): string[]
  colorIdentity(): string[]
  numFaces(): number
  cmc(faceIndex?: number): number | null
  power(faceIndex?: number): number | string | null
  toughness(faceIndex?: number): number | string | null
  loyalty(faceIndex?: number): number | string | null
  defense(faceIndex?: number): number | string | null
  name(faceIndex?: number): string | null
  oracleText(faceIndex?: number): string | null
  flavorText(faceIndex?: number): string | null
  set(faceIndex?: number): string | null
  typeLine(faceIndex?: number): string | null
  [key: string]: unknown
}

class CardFilter {
  kind: string
  value: string | string[]
  operator: string | null
  or: boolean
  only: boolean
  red: boolean | null
  green: boolean | null
  black: boolean | null
  white: boolean | null
  blue: boolean | null

  constructor(opts: CardFilterOptions) {
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

  matches(card: FilterableCard): boolean {
    if (this.kind === 'legality') {
      return card.isLegalIn(this.value as string)
    }
    else if (this.kind === 'colors' || this.kind === 'identity') {
      const fieldValue = (this.kind === 'colors' ? card.colors() : card.colorIdentity()).map(c => c.toLowerCase())
      const targetValueMatches = (['white', 'blue', 'black', 'red', 'green'] as const)
        .map(color => this[color] ? colorNameToSymbol[color] : undefined)
        .filter((symbol): symbol is string => symbol !== undefined)
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
      const fieldKey = fieldMapping[this.kind as keyof typeof fieldMapping]

      // Check if the field is valid before proceeding
      if (!fieldKey) {
        throw new Error(`Unhandled filter field: ${this.kind}`)
      }

      const fieldValues: (string | number | null)[] = []
      const fieldMethod = card[fieldKey] as (faceIndex?: number) => string | number | null

      if (fieldMethod.call(card)) {
        fieldValues.push(fieldMethod.call(card))
      }
      else {
        for (let i = 0; i < card.numFaces(); i++) {
          fieldValues.push(fieldMethod.call(card, i))
        }
      }

      if (textFields.includes(this.kind)) {
        const lowerValues = fieldValues.map(x => x ? String(x).toLowerCase() : '')

        if (this.operator === 'or') {
          const targetValues = (this.value as string[]).map(v => v.toLowerCase())
          return targetValues.some(targetValue =>
            lowerValues.some(fieldValue => fieldValue.includes(targetValue))
          )
        }

        else {
          const fieldValue = lowerValues.join(' ')
          const targetValue = (this.value as string).toLowerCase()

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
        const targetValue = parseFloat(this.value as string)
        const floatValues = fieldValues.map(val => parseFloat(String(val)))

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

    return false
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
} as const

const colorNameToSymbol: Record<string, string> = {
  white: 'w',
  blue: 'u',
  black: 'b',
  red: 'r',
  green: 'g',
}

module.exports = CardFilter

export { CardFilter, CardFilterOptions, FilterableCard }
