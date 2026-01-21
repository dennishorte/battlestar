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
  _statsRecordDogmaActions.call(this, player, card)

  const biscuits = _getDogmaBiscuits.call(this, player, card, opts)
  const featuredBiscuit = opts.auspice ? 'p' : card.dogmaBiscuit
  const { sharing, demanding} = _getSharingAndDemanding.call(
    this,
    player,
    featuredBiscuit,
    biscuits,
  )

  const self = this

  this.state.dogmaInfo = {
    leader: player,
    card: card,
    shared: false,
    earlyTerminate: false,

    biscuits,          // Cached biscuits at the beginning of the dogma effect.
    featuredBiscuit,   // Featured biscuit being used for determing sharing/demands, etc.

    sharing,   // Array of players who will share during this dogma action.
    demanding, // Array of players who will be subject to demands during this dogma action.

    // Player who is currently executing an effect.
    // This can be a player who is sharing or being demands.
    acting: null,

    // Tracks if the current effect is a demand effect.
    isDemandEffect: false,

    // Special case for The Big Bang
    theBigBangChange: false,

    opts,

    // Needed for Muhammad Yunus
    recalculateSharingAndDemanding() {
      const { sharing, demanding } = _getSharingAndDemanding.call(
        self,
        player,
        featuredBiscuit,
        biscuits,
      )
      self.state.dogmaInfo.sharing = sharing
      self.state.dogmaInfo.demanding = demanding
    },
  }

  const karmaKind = this.game.aKarma(player, 'dogma', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.acted(player)
    return
  }

  // Sargon of Akkad, for example, modifies who can share.
  for (const player2 of this.game.players.all()) {
    this.game.aKarma(player2, 'share-eligibility', { ...opts, card, leader: player })
  }

  _logSharing.call(this)
  _executeEffects.call(this, player, card, opts)

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

function _executeEffects(player, card, opts) {
  // Store planned effects now, as changes to the stacks shouldn't affect them.
  let effects = []

  if (this.game.settings.version < 4) {
    effects = [
      ...this.game.getVisibleEffectsByColor(card.owner, card.color, 'echo'),
      card.visibleEffects('dogma'),
    ]
  }
  else {
    if (opts.artifact) {
      effects = [card.visibleEffects('dogma')]
    }
    else {
      effects = [
        ...this.game.getVisibleEffectsByColor(card.owner, card.color, 'echo'),
        card.visibleEffects('dogma'),
      ]
    }
  }

  effects = effects.filter(e => e !== undefined)

  for (const e of effects) {
    for (let i = 0; i < e.texts.length; i++) {
      this.game.aOneEffect(player, e.card, e.texts[i], e.impls[i], {
        sharing: this.state.dogmaInfo.sharing,
        demanding: this.state.dogmaInfo.demanding,
        endorsed: opts.endorsed,
        foreseen: opts.foreseen,
      })
      if (this.state.dogmaInfo.earlyTerminate) {
        return
      }
    }
  }
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
  if (this.state.dogmaInfo.shared) {
    const shareKarmaKind = this.game.aKarma(player, 'share', { card })
    if (shareKarmaKind === 'would-instead') {
      this.acted(player)
      return
    }

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
  else if (card.checkHasShare()) {
    this.players.opponents(player).forEach(() => {
      this.game.aKarma(player, 'no-share', { card })
    })
  }
}

function _getBiscuitComparator(player, featuredBiscuit, biscuits) {
  return (other) => {
    if (featuredBiscuit === 'score') {
      return this.game.getScore(other) >= this.game.getScore(player)
    }
    else if (this.state.dogmaInfo.soleMajorityPlayerId === other.id) {
      return true
    }
    else if (this.state.dogmaInfo.soleMajorityPlayerId === player.id) {
      return false
    }
    else {
      return biscuits[other.name][featuredBiscuit] >= biscuits[player.name][featuredBiscuit]
    }
  }
}

function _getDogmaBiscuits(player, card, opts) {
  const biscuits = this.game.getBiscuits()
  const artifactBiscuits = opts.artifact ? card.visibleBiscuitsParsed() : this.util.emptyBiscuits()
  biscuits[player.name] = this.util.combineBiscuits(biscuits[player.name], artifactBiscuits)

  return biscuits
}

function _getSharingAndDemanding(player, featuredBiscuit, biscuits) {
  const biscuitComparator = _getBiscuitComparator.call(this, player, featuredBiscuit, biscuits)
  const otherPlayers = this.players.other(player)

  const sharing = otherPlayers.filter(p => biscuitComparator(p))
  const demanding = otherPlayers.filter(p => !biscuitComparator(p))

  return { sharing, demanding }
}

function _logSharing() {
  if (this.state.dogmaInfo.sharing.length > 0) {
    this.log.add({
      template: 'Effects will share with {players}.',
      args: { players: this.state.dogmaInfo.sharing },
    })
  }

  if (this.state.dogmaInfo.demanding.length > 0) {
    this.log.add({
      template: 'Demands will be made of {players}.',
      args: { players: this.state.dogmaInfo.demanding },
    })
  }
}


module.exports = {
  DogmaAction,
  EndorseAction,

  getDogmaShareInfo(player, card) {
    return _getSharingAndDemanding.call(this, player, card.dogmaBiscuit, this.game.getBiscuits())
  },
}
