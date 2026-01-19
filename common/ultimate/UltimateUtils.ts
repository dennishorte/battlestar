import util from '../lib/util.js'

import type { BiscuitCounts } from './UltimatePlayer.js'

interface Card {
  getAge(): number
  age: number
}

interface Game {
  // Game reference (not used in most methods)
}

class UltimateUtils {
  game: Game

  constructor(game: Game) {
    this.game = game
  }

  biscuitNames(): string[] {
    return [
      'castle',
      'clock',
      'coin',
      'factory',
      'leaf',
      'lightbulb',
      'person',
    ]
  }

  biscuitNameToIcon(name: string): string {
    switch (name) {
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

  biscuitIconToName(icon: string): string {
    switch (icon) {
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

  colors(): string[] {
    return [
      'red',
      'yellow',
      'green',
      'blue',
      'purple',
    ]
  }

  colorToDecree(color: string): string {
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

  combineBiscuits(left: BiscuitCounts, right: BiscuitCounts): BiscuitCounts {
    const combined = this.emptyBiscuits()
    for (const biscuit of Object.keys(combined) as (keyof BiscuitCounts)[]) {
      combined[biscuit] += left[biscuit]
      combined[biscuit] += right[biscuit]
    }
    return combined
  }

  emptyBiscuits(): BiscuitCounts {
    return {
      c: 0,
      f: 0,
      i: 0,
      k: 0,
      l: 0,
      s: 0,
      p: 0,
    }
  }

  highestCards(cards: Card[]): Card[] {
    const sorted = [...cards].sort((l, r) => r.getAge() - l.getAge())
    return util.array.takeWhile(sorted, (card: Card) => card.getAge() === sorted[0].getAge())
  }

  lowestCards(cards: Card[]): Card[] {
    const sorted = [...cards].sort((l, r) => l.getAge() - r.getAge())
    return util.array.takeWhile(sorted, (card: Card) => card.getAge() === sorted[0].getAge())
  }

  parseBiscuits(biscuitString: string): BiscuitCounts {
    const counts = this.emptyBiscuits()
    for (const ch of biscuitString) {
      if (Object.hasOwn(counts, ch)) {
        counts[ch as keyof BiscuitCounts] += 1
      }
    }
    return counts
  }

  separateByAge(cards: Card[]): Record<number, Card[]> {
    const byAge: Record<number, Card[]> = {}
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

  serializeObject(obj: unknown): string {
    if (typeof obj === 'object' && obj !== null) {
      const objWithId = obj as { id?: string }
      util.assert(objWithId.id !== undefined, 'Object has no id. Cannot serialize.')
      return objWithId.id!
    }
    else if (typeof obj === 'string') {
      return obj
    }
    else {
      throw new Error(`Cannot serialize element of type ${typeof obj}`)
    }
  }
}

export { UltimateUtils }
