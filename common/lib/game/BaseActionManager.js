const selector = require('../selector.js')

class BaseActionManager {
  constructor(game) {
    this.game = game
    this.log = game.log
  }

  choose(player, choices, opts={}) {
    if (choices.length === 0) {
      this.log.addNoEffect()
      return []
    }

    let title = opts.title || 'Choose'
    if (opts.min === 0) {
      title = '(optional) ' + title
    }

    const chooseSelector = {
      actor: player.name,
      title,
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

  chooseYesNo(player, title) {
    const choice = this.choose(player, ['yes', 'no'], { title })
    return choice[0] === 'yes'
  }
}

module.exports = {
  BaseActionManager,
}
