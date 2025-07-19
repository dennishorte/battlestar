const { BaseActionManager } = require('../lib/game/index.js')
const { GameOverEvent } = require('../lib/game.js')


class UltimateActionManager extends BaseActionManager {
  constructor(game) {
    super(game)
  }

  acted(player) {
    const state = this.game.state

    if (!state.initializationComplete || !state.firstPicksComplete) {
      return
    }

    if (
      !state.dogmaInfo.demanding
      && state.dogmaInfo.acting === player
      && !this.game.checkSameTeam(player, this.game.players.current())
    ) {
      state.shared = true
    }

    // Special handling for "The Big Bang"
    state.dogmaInfo.theBigBangChange = true

    ////////////////////////////////////////////////////////////
    // Color zones that have only one or fewer cards become unsplayed

    for (const player of this.game.players.all()) {
      for (const color of this.game.utilColors()) {
        const zone = this.game.zones.byPlayer(player, color)
        if (zone.cards().length < 2) {
          zone.splay = 'none'
        }
      }
    }

    ////////////////////////////////////////////////////////////
    // Check if any player has won

    // Some karmas create special handling for win conditions
    if (!state.wouldWinKarma) {
      for (const player of this.game.players.all()) {
        if (this.game.getAchievementsByPlayer(player).total >= this.game.getNumAchievementsToWin()) {
          throw new GameOverEvent({
            player,
            reason: 'achievements'
          })
        }
      }
    }
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
      return this.game.cards.byId(cardNames[0])
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
        card = this.game.cards.byId(card)
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
        output = cardNames.map(name => this.game.cards.byId(name))
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

  junk(player, card, opts={}) {
    const karmaKind = this.game.aKarma(player, 'junk', { ...opts, card })
    if (karmaKind === 'would-instead') {
      this.acted(player)
      return
    }

    this.log.add({
      template: '{player} junks {card}',
      args: { player, card }
    })

    const junkedCard = card.moveTo(this.game.zones.byId('junk'))

    // Only mark this player as having acted if something actually changed
    if (junkedCard) {
      this.acted(player)
    }

    // Check if any of the city junk achievements are triggered
    if (
      card.checkHasBiscuit(';')
      && this.game.cards.byId('Glory').zone.id === 'achievements'
    ) {
      this.game.aClaimAchievement(player, { name: 'Glory' })
    }

    if (
      card.checkHasBiscuit(':')
      && this.game.cards.byId('Victory').zone.id === 'achievements'
    ) {
      this.game.aClaimAchievement(player, { name: 'Victory' })
    }

  }

  reveal(player, card) {
    card.reveal()
    this.log.add({
      template: '{player} reveals {card}',
      args: { player, card }
    })
    this.acted(player)
    return card
  }

  junkMany = UltimateActionManager.createManyMethod('junk', 2)
  revealMany = UltimateActionManager.createManyMethod('reveal', 2)

  chooseAndJunk = UltimateActionManager.createChooseAndMethod('junkMany', 2)
  chooseAndReveal = UltimateActionManager.createChooseAndMethod('revealMany', 2)


  ////////////////////////////////////////////////////////////////////////////////
  // Helper methods for creating common classes of action

  static createManyMethod(verb, numArgs) {
    return function(...args) { //player, cards, opts={}) {
      const player = args[0]
      const cards = args[1]
      const opts = args[numArgs] || {}

      const results = []
      let auto = opts.ordered || false
      let remaining = [...cards]
      const startZones = Object.fromEntries(remaining.map(c => [c.id, c.zone]))

      while (remaining.length > 0) {
        // Check if any cards in 'remaining' have been acted on by some other force (karma effect).
        remaining = remaining.filter(c => c.zone === startZones[c.id])
        if (remaining.length === 0) {
          break
        }

        let next
        if (auto || remaining.length === 1) {
          next = remaining[0]
        }
        else {
          next = this.chooseCard(
            player,
            remaining.concat(['auto']),
            { title: `Choose a card to ${verb} next.` },
          )
        }

        if (next === 'auto') {
          auto = true
          continue
        }

        remaining = remaining.filter(card => card !== next)
        const singleArgs = [...args]
        singleArgs[1] = next
        const result = this[verb](...singleArgs)
        if (result !== undefined) {
          results.push(result)
        }
      }
      return results
    }
  }

  static createChooseAndMethod(manyFuncName, numArgs) {
    return function(...args) {
      const player = args[0]
      const choices = args[1]
      const opts = args[numArgs] || {}

      const titleVerb = manyFuncName.slice(1, -4).toLowerCase()
      opts.title = opts.title || `Choose card(s) to ${titleVerb}`

      const cards = this.chooseCards(player, choices, opts)
      if (cards) {
        if (opts.reveal) {
          this.revealMany(player, cards)
        }

        const actionArgs = [...args]
        actionArgs[1] = cards
        return this[manyFuncName](...actionArgs)
      }
      else {
        return []
      }
    }
  }

  static createDrawAndMethod(verb, numArgs) {
    return function(...args) {
      const player = args[0]
      const age = args[1]
      const opts = args[numArgs] || {}

      const card = this.draw(player, { ...opts, age })
      if (card) {
        return this[verb](player, card, opts)
      }
    }
  }
}

module.exports = {
  UltimateActionManager,
}
