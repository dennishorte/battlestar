const { factory } = require('./game.js')

const TestUtil = {}

TestUtil.deepLog = function(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

TestUtil.fixture = function(options) {
  options = Object.assign({
    expansions: ['base'],
  }, options)

  const lobby = {
    game: 'Innovation',
    name: 'Test Lobby',
    options: {
      expansions: options.expansions,
    },
    users: [
      { _id: 0, name: 'dennis' },
      { _id: 1, name: 'micah' },
      { _id: 2, name: 'tom' },
    ],
  }

  const game = factory(lobby)
  game.testOptions = options

  return game
}

TestUtil.setHand = function(game, player, cards) {
  const hand = game.getHand(player)
  for (let i = hand.cards.length - 1; i >= 0; i--) {
    game.mReturnCard(hand.cards[i])
  }

  for (const card of cards) {
    const zone = game.getZoneByCard(card)
    game.mMoveCard(zone, hand, card)
  }
}

TestUtil.topDeck = function(game, exp, age, cards) {
  cards = [...cards].reverse()
  const deck = game.getDeck(exp, age)
  for (const card of cards) {
    game.mMoveByIndices(
      deck,
      deck.cards.indexOf(card),
      deck,
      0
    )
  }
}

module.exports = TestUtil
