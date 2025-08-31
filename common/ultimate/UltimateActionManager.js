const { BaseActionManager } = require('../lib/game/index.js')
const { GameOverEvent } = require('../lib/game.js')

const { DogmaAction, EndorseAction } = require('./actions/Dogma.js')
const { DrawAction } = require('./actions/Draw.js')
const { MeldAction } = require('./actions/Meld.js')

const util = require('../lib/util.js')


class UltimateActionManager extends BaseActionManager {
  constructor(game) {
    super(game)
  }

  // Some actions are very complex, and so are separated into their own files
  dogma = DogmaAction
  draw = DrawAction
  endorse = EndorseAction
  meld = MeldAction

  acted(player) {
    if (!this.state.initializationComplete || !this.state.firstPicksComplete) {
      return
    }

    if (
      !this.state.dogmaInfo.demanding
      && this.state.dogmaInfo.acting
      && this.state.dogmaInfo.acting.name === player.name
      && !this.game.checkSameTeam(player, this.players.current())
    ) {
      this.state.shared = true
    }

    // Special handling for "The Big Bang"
    this.state.dogmaInfo.theBigBangChange = true

    ////////////////////////////////////////////////////////////
    // Color zones that have only one or fewer cards become unsplayed

    for (const player of this.players.all()) {
      for (const color of this.game.util.colors()) {
        const zone = this.zones.byPlayer(player, color)
        if (zone.cardlist().length < 2) {
          zone.splay = 'none'
        }
      }
    }

    ////////////////////////////////////////////////////////////
    // Check if any player has won

    // Some karmas create special handling for win conditions
    if (!this.state.wouldWinKarma) {
      for (const player of this.players.all()) {
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
    if (this.state.dogmaInfo.mayIsMust) {
      opts.min = Math.max(1, opts.min || 1)
    }

    return super.choose(player, choices, opts)
  }

  chooseYesNo(player, title) {
    if (this.game.state.dogmaInfo.mayIsMust) {
      this.game.log.add({
        template: '{player} is being blackmailed, so must choose yes',
        args: { player }
      })
      return true
    }
    else {
      return super.chooseYesNo(player, title)
    }
  }

  chooseAge(player, ages, opts={}) {
    if (!ages) {
      ages = this.game.util.ages()
    }
    else {
      ages = [...ages]
    }

    const selected = this.choose(player, ages, { ...opts, title: 'Choose Age' })
    if (selected) {
      return selected[0]
    }
  }

  chooseCards(player, cards, opts={}) {
    if (cards.length === 0 || opts.count === 0 || opts.max === 0) {
      this.log.addNoEffect()
      return []
    }

    const choiceMap = cards.map(card => {
      if (card === 'auto') {
        // 'auto' is a special keyword used createManyMethod that allows players
        // to skip manually ordering the actions on many cards.
        return { name: 'auto', card: 'auto' }
      }
      else if (!card.id) {
        card = this.cards.byId(card)
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

      if (cardNames.includes('auto')) {
        return ['auto']
      }
      else if (cardNames[0].startsWith('*')) {
        // Card names were hidden. Convert back to arbitrary matching cards.
        output = []

        for (const name of cardNames) {
          const mapping = choiceMap.find(m => m.name === name && !output.includes(m.card))
          output.push(mapping.card)
        }
      }
      else {
        output = cardNames.map(name => this.cards.byId(name))
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

  chooseColor(player) {
    return this.choose(player, this.util.colors(), { title: 'Choose a color' })[0]
  }

  claimAchievement(player, opts={}) {
    // Identify the card to be achieved
    const card = function() {
      // ...Sometimes, a card is passed directly
      if (opts.card) {
        return opts.card
      }

      // ...Sometimes, we get a specific card, by name
      else if (opts.name) {
        return this.cards.byId(opts.name)
      }

      // ...Sometimes, the player is just getting a standard achievement, by age and expansion
      else if (opts.age) {
        return this
          .game
          .cards
          .byZone('achievements')
          .filter(card => !card.isSpecialAchievement && !card.isDecree)
          .find(c => c.getAge() === opts.age && c.expansion === opts.expansion)
      }

      else {
        return undefined
      }
    }.call(this)

    if (!card) {
      throw new Error(`Unable to find achievement given opts: ${JSON.stringify(opts)}`)
    }

    // Special achievements can only be claimed from the achievements zone
    if (card.isSpecialAchievement && card.zone.id !== 'achievements') {
      console.log(card.name, card.zone.id)
      return
    }

    // Handle karma
    const karmaKind = this.game.aKarma(player, 'achieve', { ...opts, card })
    if (karmaKind === 'would-instead') {
      this.acted(player)
      return
    }

    // Do the actual achievement claiming
    const source = card.zone
    card.moveTo(this.zones.byPlayer(player, 'achievements'))

    this.log.add({
      template: '{player} achieves {card} from {zone}',
      args: { player, card, zone: source }
    })

    this.acted(player)

    // Draw figures if the player claimed a standard achievement
    if (opts.isStandard && this.game.getExpansionList().includes('figs')) {
      const others = this
        .players
        .startingWith(player)
        .filter(other => !this.checkSameTeam(player, other))

      for (const opp of others) {
        this.draw(opp, { exp: 'figs' })
      }
    }

    return card
  }

  foreshadow = UltimateActionManager.insteadKarmaWrapper('foreshadow', (player, card) => {
    const zoneLimit = this.game.getForecastLimit(player)
    const target = this.zones.byPlayer(player, 'forecast')

    if (target.cardlist().length >= zoneLimit) {
      this.log.add({
        template: '{player} has reached the limit for their forecast',
        args: { player },
      })
      return
    }
    else {
      card.moveTo(target)

      this.log.add({
        template: '{player} foreshadows {card} from {zone}',
        args: { player, card, zone: card.zone }
      })

      this.acted(player)
      return card
    }
  })

  junk = UltimateActionManager.insteadKarmaWrapper('junk', (player, card) => {
    this.log.add({
      template: '{player} junks {card}',
      args: { player, card }
    })

    const junkedCard = card.moveTo(this.zones.byId('junk'))

    // Only mark this player as having acted if something actually changed
    if (junkedCard) {
      this.acted(player)
    }

    // Check if any of the city junk achievements are triggered
    if (card.checkHasBiscuit(';')) {
      this.claimAchievement(player, { name: 'Glory' })
    }

    if (card.checkHasBiscuit(':')) {
      this.claimAchievement(player, { name: 'Victory' })
    }
  })

  junkAvailableAchievement(player, ages, opts={}) {
    const eligible = ages.flatMap(age => this.game.getAvailableAchievementsByAge(player, age))

    const card = this.chooseCards(player, eligible, {
      title: 'Choose an achievement to junk',
      hidden: true,
      ...opts
    })[0]

    if (card) {
      this.junk(player, card)
    }
  }

  junkDeck(player, age, opts={}) {
    const cards = this.cards.byDeck('base', age)
    if (cards.length === 0) {
      this.log.add({
        template: 'The {age} deck is already empty.',
        args: { age },
      })
      return
    }

    let doJunk = true
    if (opts.optional) {
      doJunk = this.chooseYesNo(player, `Junk the ${age} deck?`)
    }

    if (doJunk) {
      this.log.add({
        template: '{player} moves all cards in {age} deck to the junk',
        args: { player, age }
      })

      const cards = this.cards.byDeck('base', age)
      this.junkMany(player, cards, { ordered: true })
    }
    else {
      this.log.add({
        template: '{player} chooses not to junk the {age} deck',
        args: { player, age }
      })
    }
  }

  return = UltimateActionManager.insteadKarmaWrapper('return', (player, card, opts={}) => {
    if (!opts.silent) {
      this.log.add({
        template: '{player} returns {card}',
        args: { player, card }
      })
    }

    card.moveHome()
    this.acted(player)
    return card
  })

  reveal = UltimateActionManager.insteadKarmaWrapper('reveal', (player, card) => {
    card.reveal()
    this.log.add({
      template: '{player} reveals {card}',
      args: { player, card }
    })
    this.acted(player)
    return card
  })

  safeguard = UltimateActionManager.insteadKarmaWrapper('safeguard', (player, card) => {
    const safeLimit = this.game.getSafeLimit(player)
    const safeZone = this.zones.byPlayer(player, 'safe')

    if (safeZone.cardlist().length >= safeLimit) {
      this.log.add({
        template: '{player} has reached their safe limit',
        args: { player }
      })
      return
    }

    this.log.add({
      template: '{player} safeguards {card} from {zone}',
      args: { player, card, zone: card.zone },
    })

    const moved = card.moveTo(safeZone)

    if (moved) {
      this.acted(player)
    }

    return card
  })

  safeguardAvailableAchievement(player, age) {
    const availableAchievements = this.game.getAvailableAchievementsByAge(player, age)

    if (availableAchievements.length === 0) {
      this.log.add({ template: 'No available achievements of age ' + age })
    }
    else {
      this.safeguard(player, availableAchievements[0])
    }
  }

  score = UltimateActionManager.insteadKarmaWrapper('score', (player, card) => {
    const target = this.zones.byPlayer(player, 'score')
    card.moveTo(target)
    this.log.add({
      template: '{player} scores {card}',
      args: { player, card }
    })
    this.acted(player)
    return card
  })

  splay(player, color, direction, opts={}) {
    util.assert(direction, 'No direction specified for splay')

    const owner = opts.owner || player

    const zone = this.zones.byPlayer(owner, color)
    if (zone.cardlist().length < 2) {
      this.log.add({
        template: `Cannot splay ${color} ${direction}`
      })
      return
    }

    // A color cannot be replayed in the same direction it is already splayed
    if (zone.splay === direction) {
      this.log.add({
        template: `{zone} is already splayed ${direction}`,
        args: { zone }
      })
      return
    }

    // Karmas don't trigger if someone else is splaying your cards.
    if (owner === player) {
      const karmaKind = this.game.aKarma(player, 'splay', { ...opts, color, direction })
      if (karmaKind === 'would-instead') {
        this.acted(player)
        return
      }
    }

    // Perform the actual splay
    if (zone.splay !== direction) {
      zone.splay = direction

      if (player === owner) {
        this.log.add({
          template: '{player} splays {color} {direction}',
          args: { player, color, direction }
        })
      }

      else {
        this.log.add({
          template: "{player} splays {player2}'s {color} {direction}",
          args: { player, player2: owner, color, direction }
        })
      }

      this.acted(player)
    }

    this.game._maybeDrawCity(owner)

    return color
  }

  transfer(player, card, target, opts={}) {
    if (target.toBoard) {
      target = this.zones.byPlayer(target.player, card.color)
    }

    // TODO: Figure out how to make insteadKarmaWrapper work with this
    const karmaKind = this.game.aKarma(player, 'transfer', { ...opts, card, target })
    if (karmaKind === 'would-instead') {
      this.acted(player)
      return
    }

    card.moveTo(target, 0)
    this.log.add({
      template: '{player} transfers {card} to {zone}',
      args: { player, card, zone: target }
    })
    this.acted(player)
    return card
  }

  tuck = UltimateActionManager.insteadKarmaWrapper('tuck', (player, card) => {
    const target = this.zones.byPlayer(player, card.color)
    card.moveTo(target)
    this.log.add({
      template: '{player} tucks {card}',
      args: { player, card }
    })
    if (card.color === 'green') {
      util.array.pushUnique(this.state.tuckedGreenForPele, player)
    }
    this.acted(player)

    return card
  })

  junkMany = UltimateActionManager.createManyMethod('junk', 2)
  meldMany = UltimateActionManager.createManyMethod('meld', 2)
  revealMany = UltimateActionManager.createManyMethod('reveal', 2)
  returnMany = UltimateActionManager.createManyMethod('return', 2)
  safeguardMany = UltimateActionManager.createManyMethod('safeguard', 2)
  scoreMany = UltimateActionManager.createManyMethod('score', 2)
  transferMany = UltimateActionManager.createManyMethod('transfer', 3)
  tuckMany = UltimateActionManager.createManyMethod('tuck', 2)

  chooseAndJunk = UltimateActionManager.createChooseAndMethod('junkMany', 2)
  chooseAndMeld = UltimateActionManager.createChooseAndMethod('meldMany', 2)
  chooseAndReveal = UltimateActionManager.createChooseAndMethod('revealMany', 2)
  chooseAndReturn = UltimateActionManager.createChooseAndMethod('returnMany', 2)
  chooseAndSafeguard = UltimateActionManager.createChooseAndMethod('safeguardMany', 2)
  chooseAndScore = UltimateActionManager.createChooseAndMethod('scoreMany', 2)
  chooseAndTransfer = UltimateActionManager.createChooseAndMethod('transferMany', 3)
  chooseAndTuck = UltimateActionManager.createChooseAndMethod('tuckMany', 2)

  drawAndJunk = UltimateActionManager.createDrawAndMethod('junk', 2)
  drawAndMeld = UltimateActionManager.createDrawAndMethod('meld', 2)
  drawAndReveal = UltimateActionManager.createDrawAndMethod('reveal', 2)
  drawAndReturn = UltimateActionManager.createDrawAndMethod('return', 2)
  drawAndSafeguard = UltimateActionManager.createDrawAndMethod('safeguard', 2)
  drawAndScore = UltimateActionManager.createDrawAndMethod('score', 2)
  drawAndTuck = UltimateActionManager.createDrawAndMethod('tuck', 2)


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

      const titleVerb = manyFuncName.slice(0, -4).toLowerCase()
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

      const card = this.game.actions.draw(player, { ...opts, age })
      if (card) {
        return this[verb](player, card, opts)
      }
    }
  }

  static insteadKarmaWrapper(actionName, impl) {
    return function(player, card, opts={}) {
      const karmaKind = this.game.aKarma(player, actionName, { ...opts, card })
      if (karmaKind === 'would-instead') {
        this.acted(player)
        return
      }

      return impl.call(this, player, card, opts)
    }
  }
}

module.exports = {
  UltimateActionManager,
}
