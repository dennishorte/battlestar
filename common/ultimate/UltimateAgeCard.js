const { UltimateBaseCard } = require('./UltimateBaseCard.js')
const util = require('../lib/util.js')

class UltimateAgeCard extends UltimateBaseCard {
  constructor(game, data) {
    super(game, data)

    Object.assign(this, {
      version: 2,
      name: '',
      color: '',
      age: 1,
      visibleAge: null,
      expansion: '',
      biscuits: '',
      dogmaBiscuit: '',
      echo: [],
      karma: [],
      dogma: [],
      dogmaImpl: [],
      echoImpl: [],
      karmaImpl: [],
      ...data,
    })
  }

  checkBiscuitIsVisible(biscuit, splay) {
    if (!splay) {
      if (this.owner) {
        if (this.checkIsTopCard()) {
          splay = 'top'
        }
        else {
          splay = this.game.zones.byPlayer(this.owner, this.color).splay
        }
      }
      else {
        throw new Error('Cannot calculate the splay for a card with no owner: ' + this.name)
      }
    }

    if (biscuit === 'h') {
      // m also counts as an h
      const mIsVisible = this.checkBiscuitIsVisible('m', splay)
      if (mIsVisible) {
        return true
      }
    }

    const biscuitIndex = this.biscuits.indexOf(biscuit)
    switch (splay) {
      case 'left': return biscuitIndex === 3 || biscuitIndex === 5
      case 'right': return biscuitIndex === 0 || biscuitIndex === 1
      case 'up': return biscuitIndex === 1 || biscuitIndex === 2 || biscuitIndex === 3
      case 'aslant': return biscuitIndex === 0 || biscuitIndex === 1 || biscuitIndex === 2 || biscuitIndex === 3
      case 'top': return biscuitIndex !== -1
      default: return false
    }
  }

  checkEchoIsVisible(splay) {
    return this.checkBiscuitIsVisible('&', splay)
  }

  checkHasDemandExplicit() {
    return this
      .dogma
      .some(text => text.toLowerCase().startsWith('i demand'))
  }

  checkHasCompelExplicit() {
    return this
      .dogma
      .some(text => text.toLowerCase().startsWith('i compel'))
  }

  checkHasDemand() {
    return this.checkHasDemandExplicit() || this.checkHasCompelExplicit()
  }

  checkHasShare() {
    const shareDogmaEffect = !this.checkHasDemand()
    const shareEchoEffect = !!this.echo
    return shareDogmaEffect || shareEchoEffect
  }

  checkIsArtifact() {
    return (
      this.expansion === 'arti'
      && this.name !== 'Timbuktu'
      && this.name !== 'Complex Numbers'
      && this.name !== 'Newton-Wickins Telescope'
      && this.name !== 'Ching Shih'
      && this.name !== 'Safety Pin'
    )
  }

  checkIsCity() {
    return this.expansion === 'city' || this.isCity
  }

  checkIsEchoes() {
    return this.expansion === 'echo' || this.name === 'Safety Pin'
  }

  checkIsFigure() {
    return this.expansion === 'figs' || this.name === 'Ching Shih'
  }

  checkIsOnPlayerBoard(player) {
    if (!this.zone) {
      return false
    }

    const re = /^players.([^.]+).(yellow|red|green|blue|purple)$/i
    const match = this.zone.id.match(re)

    return match && (!player || match[1] === player.name)
  }

  checkHasEcho() {
    return this.echo.length > 0
  }

  checkHasBonus() {
    const re = /[0-9ab]/gi
    const match = this.biscuits.match(re)
    return match !== null
  }

  checkHasDiscoverBiscuit() {
    if (this.biscuits.length < 6) {
      return false
    }

    const biscuit = this.biscuits[4]
    return (
      biscuit === 'l'
      || biscuit === 'c'
      || biscuit === 'i'
      || biscuit === 's'
      || biscuit === 'k'
      || biscuit === 'f'
    )
  }

  checkIsTopCard() {
    if (!this.owner) {
      return false
    }

    return this.game.cards.top(this.owner, this.color).id === this.id
  }

  checkSharesBiscuit(other) {
    const biscuits = 'lciskf'.split('')
    for (const biscuit of biscuits) {
      if (this.checkHasBiscuit(biscuit) && other.checkHasBiscuit(biscuit)) {
        return true
      }
    }
    return false
  }

  getAge() {
    return this.checkIsOnPlayerBoard() ? (this.visibleAge || this.age) : this.age
  }

  getBiscuitCount(biscuit) {
    return this.biscuits.split(biscuit).length - 1
  }

  visibleBiscuitsParsed() {
    return this.game.util.parseBiscuits(this.visibleBiscuits())
  }

  visibleBiscuits() {
    const isInBiscuitZone = this.zone.isColorZone() || this.zone.isArtifactZone() || this.zone.isMuseumZone()

    if (!isInBiscuitZone) {
      throw new Error('Cannot detect biscuits outside of biscuit zones')
    }

    const isTopCard = this.zone.isArtifactZone() || this.zone.isMuseumZone() || this.zone.cardlist()[0].id === this.id

    // If this is a top card, return all of its biscuits
    if (isTopCard) {
      if (this.biscuits.length === 4) {
        return this.biscuits
      }
      else {
        // This ensures the meld biscuits from cities are executed in the correct order.
        return this.biscuits[0] + this.biscuits.slice(4, 6) + this.biscuits.slice(1, 4)
      }
    }

    // Otherwise, return based on the splay of this card's zone
    const splay = this.zone.splay
    if (splay === 'none') {
      return ''
    }
    else if (splay === 'left') {
      return this.biscuits.slice(3,4) + this.biscuits.slice(5,6)
    }
    else if (splay === 'right') {
      return this.biscuits.slice(0, 2)
    }
    else if (splay === 'up') {
      return this.biscuits.slice(1, 4)
    }
    else if (splay === 'aslant') {
      return this.biscuits.slice(0, 4)
    }
    else {
      throw new Error(`Unknown splay type: ${splay}`)
    }
  }

  getBonuses(splay) {
    const rx = /([abt1-9])/g
    const matches = this
      .visibleBiscuits()
      .match(rx)

    if (!matches) {
      return []
    }

    else {
      return matches.map(bonus => {
        if (bonus === 't') {
          return 12
        }
        else {
          return parseInt(bonus, 16)
        }
      })
    }
  }

  getHexIndex() {
    if (this.biscuits.includes('m')) {
      return this.biscuits.indexOf('m')
    }
    else {
      return this.biscuits.indexOf('h')
    }
  }

  getKarmaInfo(trigger) {
    const matches = []
    for (let i = 0; i < this.karma.length; i++) {
      const impl = this.karmaImpl[i]
      const triggers = util.getAsArray(impl, 'trigger')
      if (triggers.includes(trigger)) {
        matches.push({
          card: this,
          index: i,
          text: this.karma[i],
          impl: this.karmaImpl[i],
        })
      }
    }
    return matches
  }

  getImpl(kind) {
    if (kind.startsWith('karma')) {
      kind = kind.substr(6)
      const impl = this.karmaImpl.find(impl => impl.trigger === kind)

      // Other implementation types return the entire array. Since karma impls
      // are a non-homogenous array, they they need to grab the correct element
      // and re-wrap it in an array to match the format used by other impl kinds.
      if (impl) {
        return [impl]
      }
      else {
        return []
      }
    }
    else {
      return this[`${kind}Impl`]
    }
  }

  inHand(player) {
    return this.owner === player && this.zone.id.endsWith('hand')
  }
}

module.exports = {
  UltimateAgeCard,
}
