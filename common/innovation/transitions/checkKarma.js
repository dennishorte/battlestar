const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  name: 'checkKarma',
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
      name: 'chosen',
      func: chosen,
    },
    {
      name: 'karma',
      func: karma
    },
    {
      name: 'returnz',
      func: returnz
    },
  ]
})

function initialize(context) {
  const { game, actor } = context
  const { trigger } = context.data

  // This gets the standard arguments for the trigger type.
  const args = _getArgs(game, context.data, trigger)

  // Sometimes, there can be special arguments, which are provided in the opts argument.
  const opts = context.data.opts || {}

  const cards = game.getCardsByKarmaTrigger(actor, trigger, ...args, opts)
  const cardNames = game._serializeCardList(cards)
  game.rk.addKey(context.data, 'cardNames', cardNames)
}

// If there is more than one karma, the active player chooses which one.
function choose(context) {
  const { game, actor } = context
  const { cardNames, trigger } = context.data

  if (cardNames.length === 0) {
    return context.done()
  }

  else if (context.data.cardNames.length > 1) {
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

  else {
    game.rk.addKey(context.data, 'cardName', cardNames[0])
  }
}

// If the player had to choose a karma to execute, store the chosen karma.
function chosen(context) {
  if (context.data.returned) {
    const { game } = context
    game.rk.addKey(context.data, 'cardName', context.data.returned[0])
  }
}

function karma(context) {
  const { game, actor } = context
  const { cardName, trigger } = context.data

  const card = game.getCardData(cardName)

  return context.push('action-dogma-one-effect', {
    effect: {
      card: card.name,
      kind: `karma-${trigger}`,
      implIndex: 0,
      leader: actor.name,
      args: _getArgs(game, context.data, trigger),
    },
    sharing: [],
    demanding: [],
    biscuits: {},
  })
}

function returnz(context) {
  const { game } = context
  const { cardName, trigger } = context.data
  const card = game.getCardData(cardName)
  const impl = card.getImpl(`karma-${trigger}`)[0]
  return context.return(impl.kind)
}

function _getArgs(game, data, trigger) {
  if (trigger === 'draw') {
    return [data.age]
  }
  else if (trigger === 'splay') {
    return [data.color, data.direction]
  }
  else {
    return game._serializeCardList([data.card])
  }
}
