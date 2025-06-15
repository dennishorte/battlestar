const { BaseActionManager } = require('../lib/game/BaseActionManager.js')


class UltimateActionManager extends BaseActionManager {
  constructor(game) {
    super(game)
  }

  choose(player, choices, opts={}) {
    if (this.game.state.dogmaInfo.mayIsMust) {
      opts.min = Math.max(1, opts.min || 1)
    }

    return super.choose(player, choices, opts)
  }

  chooseCard(player, cards, opts={}) {
    // TODO: convert this to just call chooseCards

    if (cards.length === 0) {
      this.log.addNoEffect()
      return undefined
    }

    if (!opts.title) {
      opts.title = 'Choose a Card'
    }

    const cardNames = this.choose(
      player,
      cards.map(c => c.name || c).sort(),
      opts
    )

    if (cardNames.length === 0) {
      this.log.addDoNothing(player)
      return undefined
    }
    else if (cardNames[0] === 'auto') {
      // TODO: Handle auto as an object that can be passed in and then return that special object.
      //       This allows a more generalized system where non-card options can be passed in along with cards.
      return 'auto'
    }
    else {
      return this.game.getCardByName(cardNames[0])
    }
  }

  chooseCards(player, cards, opts={}) {
    if (cards.length === 0 || opts.count === 0 || opts.max === 0) {
      this.log.addNoEffect()
      return []
    }

    if (opts.lowest) {
      cards = this.game.utilLowestCards(cards)
    }

    const choiceMap = cards.map(card => {
      if (!card.id) {
        card = this.game.getCardByName(card)
      }

      if (opts.hidden) {
        return { name: card.getHiddenName(this.game), card }
      }
      else {
        return { name: card.id, card }
      }
    })

    opts.title = opts.title || 'Choose Cards(s)'
    const choices = choiceMap.map(x => x.name)

    if (opts.hidden) {
      choices.sort()
    }

    let output

    while (true) {
      const cardNames = this.choose(
        player,
        choices,
        opts
      )

      if (cardNames.length === 0) {
        this.log.addDoNothing(player)
        return []
      }

      if (cardNames[0].startsWith('*')) {
        // Card names were hidden. Convert back to arbitrary matching cards.
        output = []
        for (const name of cardNames) {
          const mapping = choiceMap.find(m => m.name === name && !output.includes(m.card))
          output.push(mapping.card)
        }
      }
      else {
        output = cardNames.map(name => this.game.getCardByName(name))
      }

      if (opts.guard && !opts.guard(output)) {
        this.log.add({ template: 'invalid selection' })
        continue
      }
      else {
        break
      }
    }

    return output
  }
}

module.exports = {
  UltimateActionManager,
}
