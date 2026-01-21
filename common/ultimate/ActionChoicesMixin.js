/**
 * ActionChoicesMixin - Generates valid action choices for the current player
 *
 * This mixin provides methods that generate the available choices for each
 * action type (Achieve, Decree, Dogma, Draw, Auspice, Endorse, Meld).
 *
 * Usage: Object.assign(Innovation.prototype, ActionChoicesMixin)
 */

const util = require('../lib/util.js')

const ActionChoicesMixin = {

  _generateActionChoices() {
    const choices = []
    choices.push(this._generateActionChoicesAchieve())
    choices.push(this._generateActionChoicesDecree())
    choices.push(this._generateActionChoicesDraw())
    choices.push(this._generateActionChoicesDogma())
    choices.push(this._generateActionChoicesEndorse())
    choices.push(this._generateActionChoicesAuspice())
    choices.push(this._generateActionChoicesMeld())
    return choices
  },

  _generateActionChoicesAchieve() {
    const player = this.players.current()

    return {
      title: 'Achieve',
      choices: this.getEligibleAchievements(player),
      min: 0,
    }
  },

  _generateActionChoicesDecree() {
    const player = this.players.current()

    const figuresInHand = this
      .zones
      .byPlayer(player, 'hand')
      .cardlist()
      .filter(c => c.checkIsFigure())

    const figuresByAge = this.util.separateByAge(figuresInHand)

    const availableDecrees = []

    if (this.findKarmasByTrigger(player, 'decree-for-any-three').length > 0 && figuresInHand.length >= 3) {
      for (const color of this.util.colors()) {
        availableDecrees.push(this.util.colorToDecree(color))
      }
    }

    if (Object.keys(figuresByAge).length >= 3) {
      figuresInHand
        .map(card => card.color)
        .map(color => this.util.colorToDecree(color))
        .forEach(decree => util.array.pushUnique(availableDecrees, decree))
    }

    if (figuresInHand.length >= 2) {
      this
        .findKarmasByTrigger(player, 'decree-for-two')
        .map(info => info.impl.decree)
        .forEach(decree => util.array.pushUnique(availableDecrees, decree))
    }

    return {
      title: 'Decree',
      choices: availableDecrees.sort(),
      min: 0,
    }
  },

  getDogmaTargets(player) {
    return this
      .util.colors()
      .map(color => this.zones.byPlayer(player, color))
      .filter(zone => this.checkZoneHasVisibleDogmaOrEcho(player, zone))
      .map(zone => zone.cardlist()[0])
  },

  _generateActionChoicesDogma() {
    const player = this.players.current()

    const dogmaTargets = this.cards.tops(player).filter(card => card.dogma.length > 0)

    const extraEffects = this
      .findKarmasByTrigger(player, 'list-effects')
      .flatMap(info => info.impl.func(this, player))

    const allTargets = util
      .array
      .distinct([...dogmaTargets, ...extraEffects])
      .map(card => {
        const shareInfo = this.getDogmaShareInfo(player, card)
        const subtitles = []

        if (card.checkHasShare() && shareInfo.sharing.length > 0) {
          const shareNames = shareInfo.sharing.map(p => p.name).join(', ')
          subtitles.push(`share with ${shareNames}`)
        }

        if (card.checkHasCompelExplicit() && shareInfo.sharing.length > 0) {
          const compelNames = shareInfo.sharing.map(p => p.name).join(', ')
          subtitles.push(`compel ${compelNames}`)
        }

        if (card.checkHasDemandExplicit() && shareInfo.demanding.length > 0) {
          const demandNames = shareInfo.demanding.map(p => p.name).join(', ')
          subtitles.push(`demand ${demandNames}`)
        }

        return {
          title: card.name,
          subtitles,
        }
      })

    return {
      title: 'Dogma',
      choices: allTargets,
      min: 0,
    }
  },

  _generateActionChoicesDraw() {
    return {
      title: 'Draw',
      choices: ['draw a card'],
      min: 0,
    }
  },

  _generateActionChoicesAuspice() {
    const standardBiscuits = Object.keys(this.util.emptyBiscuits())
    const _isStandardBiscuit = function(biscuit) {
      return standardBiscuits.includes(biscuit)
    }
    const player = this.players.current()
    const topFigureBiscuits = this
      .cards
      .tops(player)
      .filter(card => card.checkIsFigure())
      .flatMap(card => card.biscuits.split('').filter(biscuit => _isStandardBiscuit(biscuit)))
      .filter(biscuit => biscuit !== 'p') // Can't auspice person biscuits because that doesn't change anything.

    const validAuspiceTargets = this
      .cards
      .tops(player)
      .filter(card => topFigureBiscuits.includes(card.dogmaBiscuit))
      .filter(card => card.dogma.length > 0)

    return {
      title: 'Auspice',
      choices: validAuspiceTargets.map(card => card.name),
      min: 0,
    }
  },

  _generateActionChoicesEndorse() {
    const player = this.players.current()

    const lowestHandAge = this
      .zones.byPlayer(player, 'hand')
      .cardlist()
      .map(card => card.getAge())
      .sort((l, r) => l - r)[0] || 99

    const cities = this
      .cards.tops(player)
      .filter(card => card.checkIsCity())
      .filter(city => city.getAge() >= lowestHandAge)

    const stacksWithEndorsableEffects = this
      .cards.tops(player)
      .map(card => this.zones.byPlayer(player, card.color))

    const colors = []

    if (!this.state.didEndorse) {
      for (const zone of stacksWithEndorsableEffects) {
        if (zone.cardlist().length === 0) {
          throw new Error('"Endorsable" stack has no cards: ' + zone.id)
        }

        const dogmaBiscuit = zone.cardlist()[0].dogmaBiscuit
        const canEndorse = cities.some(city => city.biscuits.includes(dogmaBiscuit))
        if (canEndorse) {
          colors.push(zone.color)
        }
      }
    }

    return {
      title: 'Endorse',
      choices: colors,
      min: 0,
    }
  },

  _generateActionChoicesMeld() {
    const player = this.players.current()
    const cards = this
      .zones
      .byPlayer(player, 'hand')
      .cardlist()

    this
      .cards
      .byPlayer(player, 'museum')
      .filter(card => !card.isMuseum)
      .forEach(card => cards.push(card))

    return {
      title: 'Meld',
      choices: cards.map(c => c.id),
      min: 0,
      max: 1,
    }
  },

}

module.exports = {
  ActionChoicesMixin,
}
