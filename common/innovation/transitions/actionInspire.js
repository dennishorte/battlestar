const { phaseFactory, nextPhase } = require('../../lib/transitionFactory.js')

module.exports = phaseFactory({
  steps: [
    {
      name: 'initialize',
      func: initialize,
    },
    {
      name: 'doEffects',
      func: doEffects,
    },
    {
      name: 'draw',
      func: draw
    }
  ],
})

function initialize(context) {
  const { game, actor } = context
  const { color } = context.data

  const topCard = game.getCardTop(actor, color)
  game.rk.addKey(context.data, 'drawValue', topCard.age)

  const zone = game.getZoneColorByPlayer(actor, color)
  const effectCards = zone
    .cards
    .map(game.getCardData)
    .filter(c => game.getBiscuitsRaw(c, zone.splay).includes('*'))

  game.rk.addKey(context.data, 'effects', game._serializeCardList(effectCards))
  game.rk.addKey(context.data, 'effectIndex', -1)

  nextPhase(context)
}

function doEffects(context) {
  const { game, actor } = context
  const { effects } = context.data
  const effectIndex = game.rk.increment(context.data, 'effectIndex')

  if (effectIndex < effects.length) {
    const effect = context.data.effects[context.data.effectIndex]

    return context.push('action-dogma-one-effect', {
      effect: {
        card: effects[effectIndex],
        kind: 'inspire',
        implIndex: 0,
        leader: actor.name,
      },
      sharing: [],
      demanding: [],
      biscuits: [],
    })
  }

  else {
    nextPhase(context)
  }
}

function draw(context) {
  const { game, actor } = context
  nextPhase(context)
  return game.aDraw(context, actor, context.data.drawValue)
}
