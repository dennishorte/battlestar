const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'karma',
      func: karma,
    },
    {
      name: 'karmaInstead',
      func: karmaInstead,
    },
    {
      name: 'draw',
      func: draw
    },
    {
      name: 'maybeReveal',
      func: maybeReveal,
    },
    {
      name: 'achievementCheck',
      func: achievementCheck,
    },
    {
      name: 'returnz',
      func: returnz
    }
  ]
})

function karma(context) {
  const { game } = context
  return game.aCheckKarma(context, 'draw')
}

function karmaInstead(context) {
  if (context.sentBack.karmaKind === 'would-instead') {
    return context.done()
  }
}

function draw(context) {
  const { game, actor } = context
  const { isShareBonus } = context.data

  // Determine which expansion to draw from.
  let exp = 'base'
  if (game.getExpansionList().includes('echo')) {
    const hand = game
      .getHand(actor)
      .cards
      .map(game.getCardData)

    const echoesCards = hand
      .filter(c => c.expansion === 'echo')

    if (hand.length > 0 && echoesCards.length === 0) {
      exp = 'echo'
    }
  }
  if (
    game.getExpansionList().includes('figs')
    && isShareBonus
    && exp === 'base'
  ) {
    exp = 'figs'
  }

  // If age is not specified, draw based on player's current highest top card.
  const baseAge = context.data.age || game.getHighestTopCard(actor).age || 1

  // Adjust age based on empty decks.
  const { adjustedAge, adjustedExp } = game.getAdjustedDeck(baseAge, exp)

  const drawnCardId = game.mDraw(actor, adjustedExp, adjustedAge).id
  game.rk.addKey(context.data, 'drawnCardId', drawnCardId)
}

function maybeReveal(context) {
  const { game, actor } = context
  const { drawnCardId, reveal } = context.data

  if (reveal) {
    const card = game.getCardData(drawnCardId)
    game.mLog({
      template: '{player} reveals {card}',
      args: {
        player: actor,
        card
      }
    })
  }
}

function achievementCheck(context) {
  return context.game.aAchievementCheck(context)
}

function returnz(context) {
  if (context.data.drawnCardId) {
    return context.sendBack({ card: context.data.drawnCardId })
  }
  return context.done()
}
