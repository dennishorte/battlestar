const util = require('../../lib/util.js')

module.exports = function(context) {
  if (!context.data.initialized) {
    initialize(context)
  }

  return nextStep(context)
}

function nextStep(context) {
  const { game, actor } = context
  const { sharing, demanding, phase } = context.data
  game.rk.increment(context.data, 'effectIndex')

  if (phase === 'dogma') {
    if (context.data.effectIndex < context.data.effects.length) {
      const effect = context.data.effects[context.data.effectIndex]

      return context.push('action-dogma-one-effect', {
        effect,
        sharing: context.data.sharing,
        demanding: context.data.demanding,
        biscuits: context.data.biscuits,
      })
    }
    else {
      game.rk.put(context.data, 'phase', 'share')
      return nextStep(context)
    }
  }

  else if (phase === 'share') {
    return maybeDrawShareBonus(context)
  }

  else if (phase === 'cleanup') {
    game.mResetDogmaInfo()
    return context.done()
  }

  else {
    throw new Error(`Unknown phase in actionDogma.js: ${phase}`)
  }
}

function maybeDrawShareBonus(context) {
  const { game, actor } = context
  const { sharing } = context.data

  game.rk.put(context.data, 'phase', 'cleanup')

  const dogmaInfo = game.getDogmaInfo()
  for (const playerName of sharing) {
    if (dogmaInfo[playerName].acted && !game.checkPlayersAreTeammates(actor, playerName)) {
      return game.aDrawShareBonus(context, actor)
    }
  }

  return nextStep(context)
}

function initialize(context) {
  const { game } = context

  game.mResetDogmaInfo()
  _logDogmaActivation(context)
  _determineEffects(context)
  _determineBiscuits(context)
  _determineDemands(context)
  _determineShares(context)

  game.rk.addKey(context.data, 'phase', 'dogma')

  // Initialization complete
  game.rk.addKey(context.data, 'initialized', true)
}

function _determineBiscuits(context) {
  const { game } = context
  const biscuits = util.array.toDict(
    game.getPlayerAll(),
    p => ({ [p.name]: game.getBiscuits(p) })
  )
  game.rk.addKey(context.data, 'biscuits', biscuits)
  return biscuits
}

function _determineDemands(context) {
  const { game, actor } = context
  const { biscuits } = context.data

  const card = game.getCardData(context.data.card)
  const targetBiscuits = biscuits[actor.name].final[card.dogmaBiscuit]
  const firstToPlay = game.getPlayerFollowing(actor)
  const players = game.getPlayerAllFrom(firstToPlay)

  const demanding = game
    .getPlayerAll()
    .filter(p => p.name !== actor.name)
    .filter(p => biscuits[p.name].final[card.dogmaBiscuit] < targetBiscuits)
    .map(p => p.name)
  game.rk.addKey(context.data, 'demanding', demanding)

  const hasDemands = card.dogmaImpl.some(impl => impl.steps.some(s => s.demand))
  if (demanding.length > 0 && hasDemands) {
    game.mLog({
      template: 'will demand from {players}',
      args: {
        players: demanding.join(', ')
      }
    })
  }
}

function _determineEffects(context) {
  const { game, actor } = context

  const card = game.getCardData(context.data.card)
  const firstToPlay = game.getPlayerFollowing(actor)
  const players = game.getPlayerAllFrom(firstToPlay)

  const effects = game
    .aListCardsForDogmaByColor(actor, card.color)
    .flatMap(card => expandByKinds(game, card))       // { card, kind }
    .flatMap(effect => expandByImpl(game, effect))    // { implIndex }
    .map(effect => Object.assign(effect, { leader: actor.name }))

  game.rk.addKey(context.data, 'effects', effects)
  game.rk.addKey(context.data, 'effectIndex', -1)
  game.rk.addKey(context.data, 'featuredBiscuit', card.dogmaBiscuit)

  return effects
}

function _determineShares(context) {
  const { game, actor } = context
  const { biscuits, effects } = context.data

  const card = game.getCardData(context.data.card)
  const targetBiscuits = biscuits[actor.name].final[card.dogmaBiscuit]
  const firstToPlay = game.getPlayerFollowing(actor)
  const players = game.getPlayerAllFrom(firstToPlay)

  const sharing = game
    .getPlayerAll()
    .filter(p => p.name !== actor.name)
    .filter(p => biscuits[p.name].final[card.dogmaBiscuit] >= targetBiscuits)
    .map(p => p.name)
  game.rk.addKey(context.data, 'sharing', sharing)

  const hasEchoEffects = effects.length > 1
  const hasSharableEffects =
    card.dogmaImpl.some(impl => impl.steps.some(s => !s.demand))
    || hasEchoEffects
  if (sharing.length > 0 && hasSharableEffects) {
    game.mLog({
      template: 'will share with {players}',
      args: {
        players: sharing.join(', ')
      }
    })
  }
}

function _logDogmaActivation(context) {
  const { game, actor } = context
  const card = game.getCardData(context.data.card)

  const logId = game.mLog({
    template: '{player} activates the dogma effect of {card}',
    args: {
      player: actor,
      card: card
    },
  })
  game.rk.put(context.data, 'parentLogId', logId)
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
