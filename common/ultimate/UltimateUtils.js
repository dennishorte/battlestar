const util = require('../lib/util.js')


class UltimateUtils {
  constructor(game) {
    this.game = game
  }

  biscuitNames() {
    const names = []
    if (this.game.state.useAgeZero) {
      names.push('meat')
    }
    names.push('castle', 'clock', 'coin', 'factory', 'leaf', 'lightbulb', 'person')
    return names
  }

  biscuitNameToIcon(name) {
    switch (name) {
      case 'meat': return 'r'
      case 'castle': return 'k'
      case 'clock': return 'i'
      case 'coin': return 'c'
      case 'factory': return 'f'
      case 'leaf': return 'l'
      case 'lightbulb': return 's'
      case 'person': return 'p'
    }

    throw new Error('Unknown biscuit name: ' + name)
  }

  biscuitIconToName(icon) {
    switch (icon) {
      case 'r': return 'meat'
      case 'k': return 'castle'
      case 'i': return 'clock'
      case 'c': return 'coin'
      case 'f': return 'factory'
      case 'l': return 'leaf'
      case 's': return 'lightbulb'
      case 'p': return 'person'
    }

    throw new Error('Unknown biscuit icon: ' + icon)
  }

  colors() {
    return [
      'red',
      'yellow',
      'green',
      'blue',
      'purple',
    ]
  }

  colorToDecree(color) {
    switch (color) {
      case 'red': return 'War'
      case 'yellow': return 'Expansion'
      case 'green': return 'Trade'
      case 'blue': return 'Advancement'
      case 'purple': return 'Rivalry'
      default:
        throw new Error(`Unknown color ${color}`)
    }
  }

  combineBiscuits(left, right) {
    const combined = this.emptyBiscuits()
    for (const biscuit of Object.keys(combined)) {
      combined[biscuit] += left[biscuit]
      combined[biscuit] += right[biscuit]
    }
    return combined
  }

  emptyBiscuits() {
    const biscuits = {}
    if (this.game.state.useAgeZero) {
      biscuits.r = 0
    }
    biscuits.c = 0
    biscuits.f = 0
    biscuits.i = 0
    biscuits.k = 0
    biscuits.l = 0
    biscuits.s = 0
    biscuits.p = 0
    return biscuits
  }

  highestCards(cards) {
    const sorted = [...cards].sort((l, r) => r.getAge() - l.getAge())
    return util.array.takeWhile(sorted, card => card.getAge() === sorted[0].getAge())
  }

  lowestCards(cards) {
    const sorted = [...cards].sort((l, r) => l.getAge() - r.getAge())
    return util.array.takeWhile(sorted, card => card.getAge() === sorted[0].getAge())
  }

  parseBiscuits(biscuitString) {
    const counts = this.emptyBiscuits()
    for (const ch of biscuitString) {
      if (Object.hasOwn(counts, ch)) {
        counts[ch] += 1
      }
    }
    return counts
  }

  separateByAge(cards) {
    const byAge = {}
    for (const card of cards) {
      if (Object.hasOwn(byAge, card.age)) {
        byAge[card.age].push(card)
      }
      else {
        byAge[card.age] = [card]
      }
    }
    return byAge
  }

  serializeObject(obj) {
    if (typeof obj === 'object') {
      util.assert(obj.id !== undefined, 'Object has no id. Cannot serialize.')
      return obj.id
    }
    else if (typeof obj === 'string') {
      return obj
    }
    else {
      throw new Error(`Cannot serialize element of type ${typeof obj}`)
    }
  }
}

module.exports = {
  UltimateUtils,
}
