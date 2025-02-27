const util = require('../../lib/util.js')

function CardBase() {
  this.version

  this.id
  this.name
  this.color
  this.age
  this.visibleAge
  this.expansion
  this.biscuits
  this.dogmaBiscuit
  this.inspire
  this.echo
  this.karma
  this.dogma

  this.dogmaImpl
  this.inspireImpl
  this.karmaImpl
}

CardBase.prototype.checkBiscuitIsVisible = function(biscuit, splay) {
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
    case 'top': return biscuitIndex !== -1
    default: return false
  }
}

CardBase.prototype.checkEchoIsVisible = function(splay) {
  return this.checkBiscuitIsVisible('&', splay)
}

CardBase.prototype.checkHasDemandExplicit = function() {
  return this
    .dogma
    .some(text => text.toLowerCase().startsWith('i demand'))
}

CardBase.prototype.checkHasBiscuit = function(biscuit) {
  return this
    .getBiscuits('top')
    .includes(biscuit)
}

CardBase.prototype.checkHasCompelExplicit = function() {
  return this
    .dogma
    .some(text => text.toLowerCase().startsWith('i compel'))
}

CardBase.prototype.checkHasDemand = function() {
  return this
    .dogma
    .some(text => this.checkHasDemandExplicit() || this.checkHasCompelExplicit())
}

CardBase.prototype.checkHasShare = function() {
  const shareDogmaEffect = this
    .dogma
    .some(text => !this.checkHasDemand())

  const shareEchoEffect = !!this.echo

  return shareDogmaEffect || shareEchoEffect
}

CardBase.prototype.checkInspireIsVisible = function(splay) {
  return this.checkBiscuitIsVisible('*', splay)
}

CardBase.prototype.checkIsArtifact = function() {
  return (
    this.expansion === 'arti'
    && this.name !== 'Timbuktu'
    && this.name !== 'Complex Numbers'
    && this.name !== 'Newton-Wickins Telescope'
    && this.name !== 'Ching Shih'
    && this.name !== 'Safety Pin'
  )
}

CardBase.prototype.checkIsCity = function() {
  return this.expansion === 'city' || this.isCity
}

CardBase.prototype.checkIsEchoes = function() {
  return this.expansion === 'echo' || this.name === 'Safety Pin'
}

CardBase.prototype.checkIsFigure = function() {
  return this.expansion === 'figs' || this.name === 'Ching Shih'
}

CardBase.prototype.checkIsOnPlayerBoard = function(player) {
  if (!this.zone) {
    return false
  }

  const re = /^players.([^.]+).(yellow|red|green|blue|purple)$/i
  const match = this.zone.match(re)

  return match && (!player || match[1] === player.name)
}

CardBase.prototype.checkHasEcho = function() {
  return this.echo.length > 0
}

CardBase.prototype.checkHasBonus = function() {
  const re = /[0-9ab]/gi
  const match = this.biscuits.match(re)
  return match !== null
}

CardBase.prototype.checkHasDiscoverBiscuit = function() {
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

CardBase.prototype.checkSharesBiscuit = function(other) {
  const biscuits = 'lciskf'.split('')
  for (const biscuit of biscuits) {
    if (this.checkHasBiscuit(biscuit) && other.checkHasBiscuit(biscuit)) {
      return true
    }
  }
  return false
}

// Battleship Yamato has age 8 everywhere except when on a player's board, when it is 11.
CardBase.prototype.getAge = function() {
  return this.checkIsOnPlayerBoard() ? (this.visibleAge || this.age) : this.age
}

CardBase.prototype.getBiscuits = function(splay) {
  if (splay === 'top') {
    return this.biscuits
  }
  else if (splay === 'none') {
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

CardBase.prototype.getBonuses = function(splay) {
  if (!splay) {
    splay = 'top'
  }

  const rx = /([ab1-9])/g
  const matches = this
    .getBiscuits(splay)
    .match(rx)

  if (!matches) {
    return []
  }

  else {
    return matches
      .map(bonus => parseInt(bonus, 16))
  }
}

CardBase.prototype.getHexIndex = function() {
  if (this.biscuits.includes('m')) {
    return this.biscuits.indexOf('m')
  }
  else {
    return this.biscuits.indexOf('h')
  }
}

CardBase.prototype.getKarmaInfo = function(trigger) {
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

CardBase.prototype.getImpl = function(kind) {
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

module.exports = CardBase
