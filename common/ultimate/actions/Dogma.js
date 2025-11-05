function DogmaAction(player, card, opts={}) {
  this.log.add({
    template: '{player} activates the dogma effects of {card}',
    classes: ['player-action'],
    args: { player, card }
  })
  this.log.indent()

  DogmaHelper.call(this, player, card, opts)

  this.log.outdent()

  this.game.mResetDogmaInfo()
}

function DogmaHelper(player, card, opts={}) {
  const karmaKind = this.game.aKarma(player, 'dogma', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.acted(player)
    return
  }

  const shareData = getDogmaShareInfo.call(this, player, card, opts)

  _initializeGlobalContext.call(this, shareData.biscuits, shareData.featuredBiscuit)
  _logSharing.call(this, shareData)
  _executeEffects.call(this, player, card, shareData, opts)

  if (this.state.dogmaInfo.earlyTerminate) {
    return
  }

  _shareBonus.call(this, player, card)
}

function EndorseAction(player, color) {
  this.log.add({
    template: '{player} endorses {color}',
    args: { player, color }
  })
  this.log.indent()

  this.state.didEndorse = true

  const card = this.game.cards.top(player, color)

  // Junk a card
  const featuredBiscuit = card.dogmaBiscuit
  const cities = this
    .game
    .cards.tops(player)
    .filter(card => card.checkIsCity())
    .filter(card => card.biscuits.includes(featuredBiscuit))
  const junkChoices = this
    .cards
    .byPlayer(player, 'hand')
    .filter(card => cities.some(city => card.getAge() <= city.getAge()))
    .map(card => card.id)

  this.chooseAndJunk(player, junkChoices, {
    title: 'Junk a card to endorse'
  })

  DogmaHelper.call(this, player, card, { endorsed: true })

  this.log.outdent()
}

function _executeEffects(player, card, shareData, opts) {
  // Store planned effects now, as changes to the stacks shouldn't affect them.
  const effects = [
    ...this.game.getVisibleEffectsByColor(card.owner, card.color, 'echo'),
    card.visibleEffects('dogma'),
  ].filter(e => e !== undefined)

  const effectOpts = {
    sharing: shareData.sharing,
    demanding: shareData.demanding,
    endorsed: opts.endorsed,
    foreseen: opts.foreseen,
  }

  _statsRecordDogmaActions.call(this, player, card, effectOpts)

  for (const e of effects) {
    for (let i = 0; i < e.texts.length; i++) {
      const result = this.game.aOneEffect(player, e.card, e.texts[i], e.impls[i], effectOpts)
      if (this.state.dogmaInfo.earlyTerminate) {
        return
      }
    }
  }
}

function _initializeGlobalContext(biscuits, featuredBiscuit) {
  this.state.shared = false
  this.state.couldShare = false

  this.state.dogmaInfo.biscuits = biscuits
  this.state.dogmaInfo.featuredBiscuit = featuredBiscuit
  this.state.dogmaInfo.earlyTerminate = false
}

function _statsRecordDogmaActions(player, card) {
  if (card.name in this.game.stats.dogmaActions) {
    this.game.stats.dogmaActions[card.name] += 1
  }
  else {
    this.game.stats.dogmaActions[card.name] = 1
  }
}


function _shareBonus(player, card) {
  // Share bonus
  if (this.state.shared) {
    this.log.add({
      template: '{player} draws a sharing bonus',
      args: { player }
    })
    this.log.indent()
    const expansion = this.game.getExpansionList().includes('figs') ? 'figs' : ''
    this.draw(player, {
      exp: expansion,
      share: true,
      featuredBiscuit: this.state.dogmaInfo.featuredBiscuit
    })
    this.log.outdent()
  }

  // Grace Hopper and Susan Blackmore have "if your opponent didn't share" karma effects
  else if (this.state.couldShare) {
    for (const other of this.players.opponents(player)) {
      this.game.aKarma(other, 'no-share', { card, leader: player })
    }
  }
}

function _getBiscuitComparator(player, featuredBiscuit, biscuits, opts) {

  // Some karmas affect how sharing is calculated by adjusting the featured biscuit.
  const featuredBiscuitKarmas = this
    .game
    .getInfoByKarmaTrigger(player, 'featured-biscuit')
    .filter(info => info.impl.matches(this, player, { biscuit: featuredBiscuit }))

  let adjustedBiscuit

  if (opts.noBiscuitKarma || featuredBiscuitKarmas.length === 0) {
    adjustedBiscuit = featuredBiscuit
  }
  else if (featuredBiscuitKarmas.length === 1) {
    const info = featuredBiscuitKarmas[0]
    this.log.add({
      template: '{card} karma: {text}',
      args: {
        card: info.card,
        text: info.text
      }
    })
    adjustedBiscuit = this.game.aCardEffect(player, info, { baseBiscuit: featuredBiscuit })
  }
  else {
    throw new Error('Multiple biscuit karmas are not supported')
  }

  return (other) => {
    if (adjustedBiscuit === 'score') {
      return this.game.getScore(other) >= this.game.getScore(player)
    }
    else if (this.state.dogmaInfo.soleMajority === other) {
      return true
    }
    else if (this.state.dogmaInfo.soleMajority === player) {
      return false
    }
    else {
      return biscuits[other.name][adjustedBiscuit] >= biscuits[player.name][adjustedBiscuit]
    }
  }
}

function _getDogmaBiscuits(player, card, opts) {
  const biscuits = this.game.getBiscuits()
  const artifactBiscuits = opts.artifact ? card.visibleBiscuitsParsed() : this.util.emptyBiscuits()
  biscuits[player.name] = this.util.combineBiscuits(biscuits[player.name], artifactBiscuits)

  return biscuits
}

function getDogmaShareInfo(player, card, opts={}) {
  // Store the biscuits now because changes caused by the dogma action should
  // not affect the number of biscuits used for evaluting the effect.
  const biscuits = opts.biscuits || _getDogmaBiscuits.call(this, player, card, opts)

  const featuredBiscuit = opts.featuredBiscuit || card.dogmaBiscuit

  const { sharing, demanding } = _getSharingAndDemanding.call(this, player, featuredBiscuit, biscuits, opts)

  return {
    biscuits,
    featuredBiscuit,
    hasShare: card.checkHasShare(),
    hasDemand: card.checkHasDemandExplicit(),
    hasCompel: card.checkHasCompelExplicit(),
    sharing,
    demanding,
  }
}

function _getSharingAndDemanding(player, featuredBiscuit, biscuits, opts={}) {
  const biscuitComparator = _getBiscuitComparator.call(this, player, featuredBiscuit, biscuits, opts)
  const otherPlayers = this.players.other(player)

  const sharing = otherPlayers.filter(p => biscuitComparator(p))
  const demanding = otherPlayers.filter(p => !biscuitComparator(p))

  return { sharing, demanding }
}

function _logSharing(shareData) {
  if (shareData.sharing.length > 0) {
    this.log.add({
      template: 'Effects will share with {players}.',
      args: { players: shareData.sharing },
    })
  }

  if (shareData.demanding.length > 0) {
    this.log.add({
      template: 'Demands will be made of {players}.',
      args: { players: shareData.demanding },
    })
  }
}


module.exports = {
  DogmaAction,
  EndorseAction,

  getDogmaShareInfo, // used by UI in app
}
