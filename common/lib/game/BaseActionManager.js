const { GameProxy } = require('./GameProxy.js')
const selector = require('../selector.js')

class BaseActionManager {
  constructor(game) {
    this.game = game
    return GameProxy.create(this)
  }

  choose(player, choices, opts={}) {
    if (choices.length === 0) {
      this.log.addNoEffect()
      return []
    }

    let title = opts.title || 'Choose'
    if (opts.min === 0) {
      opts.title = '(optional) ' + title
    }

    const chooseSelector = {
      actor: player.name,
      choices: choices,
      ...opts
    }

    const selected = this.game.requestInputSingle(chooseSelector)

    // Validate counts
    const { min, max } = selector.minMax(chooseSelector)

    if (selected.length < min || selected.length > max) {
      throw new Error('Invalid number of options selected')
    }

    if (selected.length === 0) {
      this.log.addDoNothing(player)
      return []
    }
    else {
      return selected
    }
  }

  chooseCard(player, choices, opts={}) {
    return this.chooseCards(player, choices, opts)[0]
  }

  chooseCards(player, choices, opts={}) {
    const choiceNames = choices.map(c => c.name).sort()
    const selection = this.choose(player, choiceNames, opts)
    const used = []

    return selection.map(s => {
      const card = choices.find(c => c.name === s && !used.includes(c))
      used.push(card)
      return card
    })
  }

  choosePlayer(player, choices, opts={}) {
    const playerNames = this.choose(
      player,
      choices.map(player => player.name),
      { ...opts, title: 'Choose Player' },
    )
    return choices.find(p => p.name === playerNames[0])
  }

  chooseYesNo(player, title) {
    const choice = this.choose(player, ['yes', 'no'], { title, count: 1 })
    return choice[0] === 'yes'
  }

  flipCoin(player) {
    const choice = this.choose(player, ['heads', 'tails'], {
      title: 'Call it...'
    })[0]
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

  rollDie(player, faces) {
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

module.exports = {
  BaseActionManager,
}
