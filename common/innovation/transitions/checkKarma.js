const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'initialize',
      func: initialize,
    },
    {
      name: 'choose',
      func: choose,
    },
    {
      name: 'karma',
      func: karma
    },
  ]
})

function initialize(context) {
  const { game, actor } = context
  const { trigger } = context.data

  const cards = game.getCardsByKarmaTrigger(actor, trigger)
  const cardNames = game._serializeCardList(cards)
  game.rk.put(context.data, 'cardNames', cardNames)
}

// If there is more than one karma, the active player chooses which one.
function choose(context) {
  const { game, actor } = context
  const { cardNames, trigger } = context.data

  if (context.data.cardNames.length > 1) {
    game.mLog({
      template: '{player} has multiple karmas for {action}',
      args: {
        player: actor,
        action: trigger,
      }
    })

    return game.aChoose(context, {
      playerName: actor.name,
      kind: 'Karma',
      choices: cardNames,
      count: 1,
    })
  }
}

function karma(context) {
  const { game, actor } = context
  const { cardName, trigger } = context.data

  const card = game.getCardData(cardName)

  return context.push('action-dogma-one-effect', {
    effect: {
      card: card.name,
      kind: `karma`,
      implIndex: 0,
      leader: actor.name,
    },
    sharing: [],
    demanding: [],
    biscuits: {},
  })
}
