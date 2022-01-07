const { phaseFactory, nextPhase } = require('../../lib/transitionFactory.js')
const util = require('../../lib/util.js')

module.exports = phaseFactory({
  steps: [
    {
      name: 'initialize',
      func: initialize,
    },
    {
      name: 'dogma',
      func: dogma,
    },
    {
      name: 'shareBonus',
      func: shareBonus,
    },
    {
      name: 'cleanup',
      func: cleanup,
    },
  ]
})

function dogma(context) {
  const { game, actor } = context
  const { sharing, demanding } = context.data
  game.rk.increment(context.data, 'effectIndex')

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
    nextPhase(context)
  }
}

function shareBonus(context) {
  // Do this phase exactly once.
  nextPhase(context)

  const { game, actor } = context
  const { sharing } = context.data

  const dogmaInfo = game.getDogmaInfo()
  for (const playerName of sharing) {
    if (dogmaInfo[playerName].acted && !game.checkPlayersAreTeammates(actor, playerName)) {
      return game.aDrawShareBonus(context, actor)
    }
  }
}

function cleanup(context) {
  const { game } = context
  game.mResetDogmaInfo()
  nextPhase(context)
}

function initialize(context) {
  console.log('dogma initialize', context.data.card)

  // Do this phase exactly once.
  nextPhase(context)

  const { game } = context

  game.rk.addKey(context.data, 'demanding', [])
  game.rk.addKey(context.data, 'sharing', [])

  game.mResetDogmaInfo()
  _logDogmaActivation(context)
  _determineEffects(context)
  _determineBiscuits(context)
  _determineDemands(context)
  _determineShares(context)
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
  const { biscuits, noDemand } = context.data

  if (noDemand) {
    return
  }

  const card = game.getCardData(context.data.card)
  const targetBiscuits = biscuits[actor.name].final[card.dogmaBiscuit]
  const firstToPlay = game.getPlayerFollowing(actor)
  const players = game.getPlayerAllFrom(firstToPlay)

  const demanding = game
    .getPlayerAll()
    .filter(p => p.name !== actor.name)
    .filter(p => biscuits[p.name].final[card.dogmaBiscuit] < targetBiscuits)
    .map(p => p.name)
  game.rk.put(context.data, 'demanding', demanding)

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
  const { biscuits, effects, noShare } = context.data

  if (noShare) {
    return
  }

  const card = game.getCardData(context.data.card)
  const targetBiscuits = biscuits[actor.name].final[card.dogmaBiscuit]
  const firstToPlay = game.getPlayerFollowing(actor)
  const players = game.getPlayerAllFrom(firstToPlay)

  const sharing = game
    .getPlayerAll()
    .filter(p => p.name !== actor.name)
    .filter(p => biscuits[p.name].final[card.dogmaBiscuit] >= targetBiscuits)
    .map(p => p.name)
  game.rk.put(context.data, 'sharing', sharing)

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

  if (game.checkEchoIsVisible(card)) {
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
