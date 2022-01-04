const util = require('../../lib/util.js')

module.exports = function(context) {
  if (!context.data.initialized) {
    initialize(context)
  }

  return nextStep(context)
}

function nextStep(context) {
  const { game } = context
  const { sharing, demanding, returned } = context.data
  game.rk.increment(context.data, 'effectIndex')

  // Clear this each time so that it doesn't get transmitted incorrectly forward.
  if (returned) {
    game.rk.removeKey(context.data, 'returned')
  }

  if (context.data.effectIndex < context.data.effects.length) {
    const effect = context.data.effects[context.data.effectIndex]
    const dogma = game
      .getCardData(effect.card)
      .getImpl(effect.kind)[effect.implIndex]

    // Don't demand from self.
    if (
      dogma.demand
      && effect.leader === effect.player
    ) {
      return nextStep(context)
    }

    // Can't demand from this player.
    else if (
      dogma.demand
      && !demanding.includes(effect.player)
    ) {
      // Only show the stands strong messages once.
      if (effect.stepIndex === 0) {
        game.mLog({
          template: '{player} stands strong in the face of demands',
          args: {
            player: actor
          }
        })
      }
      return nextStep(context)
    }

    // Sharing doesn't apply to this player.
    else if (
      effect.leader != effect.player
      && !dogma.demand
      && !sharing.includes(effect.player)
    ) {
      // Only show the doesn't share message once.
      if (effect.stepIndex === 0) {
        game.mLog({
          template: `{player} isn't ready for {card} yet`,
          args: {
            player: effect.player,
            card: effect.card
          },
        })
      }
      return nextStep(context)
    }

    // Effect will target this player.
    else {
      return context.push('action-dogma-one-effect', {
        effect,
        playerName: effect.player,
        returned,
      })
    }
  }
  else {
    return context.done()
  }
}

function initialize(context) {
  const { game, actor } = context
  const card = game.getCardData(context.data.card)

  // Prep biscuits
  const biscuits = util.array.toDict(
    game.getPlayerAll(),
    p => ({ [p.name]: game.getBiscuits(p) })
  )
  game.rk.addKey(context.data, 'biscuits', biscuits)

  // Prep card effects (echo and dogma)
  const firstToPlay = game.getPlayerFollowing(actor)
  const players = game.getPlayerAllFrom(firstToPlay)
  const effects = game
    .aListCardsForDogmaByColor(actor, card.color)
    .flatMap(card => expandByKinds(game, card))       // { card, kind }
    .flatMap(effect => expandByImpl(game, effect))    // { implIndex }
    .flatMap(effect => expandByPlayers(game, effect, players)) // { player }
    .flatMap(effect => expandBySteps(game, effect))   // { stepIndex }
    .map(effect => Object.assign(effect, { leader: actor.name }))

  // Store effect info on context
  game.rk.addKey(context.data, 'effects', effects)
  game.rk.addKey(context.data, 'effectIndex', -1)
  game.rk.addKey(context.data, 'featuredBiscuit', card.dogmaBiscuit)

  game.mLog({
    template: '{player} activates the dogma effect of {card}',
    args: {
      player: actor,
      card: card
    }
  })

  // Determine sharing
  const sharing = game
    .getPlayerAll()
    .filter(p => p.name !== actor.name)
    .filter(p => biscuits[p.name][card.dogmaBiscuit] >= biscuits[actor.name][card.dogmaBiscuit])
    .map(p => p.name)
  game.rk.addKey(context.data, 'sharing', sharing)

  const hasEchoEffects = effects.length > 1
  const hasSharableEffects =
    card.dogmaImpl.some(impl => impl.steps.some(s => !s.demand))
    || hasEchoEffects
  if (sharing.length > 0 && hasSharableEffects) {
    game.mLog({
      template: 'sharing with {players}',
      args: {
        players: sharing.join(', ')
      }
    })
  }

  // Determine demanding, if appropriate
  const demanding = game
    .getPlayerAll()
    .filter(p => p.name !== actor.name)
    .filter(p => biscuits[p.name][card.dogmaBiscuit] < biscuits[actor.name][card.dogmaBiscuit])
    .map(p => p.name)
  game.rk.addKey(context.data, 'demanding', demanding)

  const hasDemands = card.dogmaImpl.some(impl => impl.steps.some(s => s.demand))
  if (demanding.length > 0 && hasDemands) {
    game.mLog({
      template: 'demanding from {players}',
      args: {
        players: demanding.join(', ')
      }
    })
  }

  // Initialization complete
  game.rk.addKey(context.data, 'initialized', true)
}

function expandByKinds(game, card) {
  const output = []

  if (game.checkEchoIsVisibile(card)) {
    output.push({
      card,
      kind: 'echo'
    })
  }

  if (game.checkCardIsTop(card)) {
    output.push({
      card,
      kind: 'dogma'
    })
  }
  return output
}

function expandByImpl(game, effect) {
  const card = game.getCardData(effect.card)
  const impl = card[`${effect.kind}Impl`]
  util.assert(impl.length > 0, `Expected ${effect} impl to exist`)
  return impl.map((i, implIndex) => Object.assign({...effect}, { implIndex }))
}

function expandByPlayers(game, effect, players) {
  return players.map(p => Object.assign({...effect}, { player: p.name }))
}

function expandBySteps(game, effect) {
  const steps = game
    .getCardData(effect.card)
    .getImpl(effect.kind)[effect.implIndex]
    .steps
  return steps.map((s, stepIndex) => Object.assign({...effect}, { stepIndex }))
}
