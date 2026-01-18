import type { Game } from './GameProxy.js'
import { GameProxy } from './GameProxy.js'
import * as selector from '../selector.js'
import util from '../util.js'

// Forward declarations for circular dependencies
interface BasePlayer {
  name: string
}

interface BaseCard {
  id: string | null
  name?: string | (() => string)
}

interface LogManager {
  add(entry: { template: string; args?: Record<string, unknown>; classes?: string[] }): void
  addNoEffect(): void
  addDoNothing(player: BasePlayer): void
}

interface ChooseOptions {
  title?: string
  min?: number
  max?: number
  count?: number
  guard?: (cards: BaseCard[]) => boolean
  [key: string]: unknown
}

interface ChooseSelector {
  actor: string
  choices: unknown[]
  title?: string
  min?: number
  max?: number
  count?: number
  [key: string]: unknown
}

interface NestedSelection {
  title: string
  selection: unknown[]
}

class BaseActionManager {
  game: Game

  // Proxied property from game
  declare log: LogManager

  constructor(game: Game) {
    this.game = game
    return GameProxy.create(this)
  }

  choose(player: BasePlayer, choices: unknown[], opts: ChooseOptions = {}): unknown[] {
    if (choices.length === 0) {
      this.log.addNoEffect()
      return []
    }

    let title = opts.title || 'Choose'
    if (opts.min === 0) {
      opts.title = '(optional) ' + title
    }

    const chooseSelector: ChooseSelector = {
      actor: player.name,
      choices: choices,
      ...opts
    }

    const selected = this.game.requestInputSingle(chooseSelector) as unknown[]

    this._validateChooseResponse(selected, chooseSelector)

    if (selected.length === 0) {
      this.log.addDoNothing(player)
      return []
    }
    else {
      return selected
    }
  }

  _validateChooseResponse(selected: unknown[], chooseSelector: ChooseSelector): boolean {
    // Validate counts
    const { min, max } = selector.minMax(chooseSelector)
    if (selected.length < min || selected.length > max) {
      throw new Error(`Invalid number of options selected: ${selected.length}. min=${min} max=${max}`)
    }

    // Validate the selected items were all in choices.
    // Pop each item out of this copy of the choices to make sure duplicate options are handled properly.
    const choicesCopy = [...chooseSelector.choices]
    for (let selection of selected) {
      const index = this._validateChooseResponse_getIndexOfSelection(selection, choicesCopy)
      if (index === -1) {
        const selected = JSON.stringify(selection)
        const valid = JSON.stringify(chooseSelector.choices)
        throw new Error(`Invalid option selected: ${selected}. Valid options were: ${valid}.`)
      }
      else {
        util.array.remove(choicesCopy, selection)
      }
    }

    return true
  }

  _validateChooseResponse_getIndexOfSelection(selection: unknown, choices: unknown[]): number {
    if (typeof selection === 'object' && selection !== null) {
      const nestedSelection = selection as NestedSelection
      const index = (choices as NestedSelection[]).findIndex(ch => ch.title === nestedSelection.title)
      const option = choices[index] as ChooseSelector
      this._validateChooseResponse(nestedSelection.selection, option)

      // If _validateChooseResponse doesn't throw an exception, it succeeded.
      return index
    }
    else {
      return choices.indexOf(selection)
    }
  }

  chooseCard(player: BasePlayer, choices: BaseCard[], opts: ChooseOptions = {}): BaseCard | undefined {
    return this.chooseCards(player, choices, opts)[0]
  }

  chooseCards(player: BasePlayer, choices: BaseCard[], opts: ChooseOptions = {}): BaseCard[] {
    while (true) {
      const choiceNames = choices.map(c => (c as any).name).sort()
      const selection = this.choose(player, choiceNames, opts) as string[]
      const used: BaseCard[] = []

      const selectedCards = selection.map(s => {
        const card = choices.find(c => (c as any).name === s && !used.some(u => u.id === c.id))!
        used.push(card)
        return card
      })

      if (opts.guard && !opts.guard(selectedCards)) {
        this.log.add({ template: 'Invalid selection' })
        continue
      }
      else {
        return selectedCards
      }
    }
  }

  choosePlayer(player: BasePlayer, choices: BasePlayer[], opts: ChooseOptions = {}): BasePlayer | undefined {
    const playerNames = this.choose(
      player,
      choices.map(player => player.name),
      { ...opts, title: 'Choose Player' },
    ) as string[]
    return choices.find(p => p.name === playerNames[0])
  }

  chooseYesNo(player: BasePlayer, title: string): boolean {
    const choice = this.choose(player, ['yes', 'no'], { title, count: 1 }) as string[]
    return choice[0] === 'yes'
  }

  flipCoin(player: BasePlayer): boolean {
    const choice = (this.choose(player, ['heads', 'tails'], {
      title: 'Call it...'
    }) as string[])[0]
    const value = this.game.random() < .5 ? 'heads' : 'tails'

    this.log.add({
      template: '{player} calls {choice}',
      args: { player, choice },
    })

    this.log.add({
      template: '...and the flip comes up: ' + value
    })

    return value === choice
  }

  rollDie(player: BasePlayer, faces: number): void {
    const result = Math.floor(this.game.random() * faces) + 1

    const extra = faces === 2
      ? (result === 1 ? ' (heads)' : ' (tails)')
      : ''

    this.log.add({
      template: `{player} rolled ${result} on a d${faces}${extra}`,
      args: { player },
      classes: ['die-roll'],
    })
  }
}

export { BaseActionManager, ChooseOptions, ChooseSelector }
