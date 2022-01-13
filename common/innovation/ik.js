Error.stackTraceLimit = 100

const t = require('./testutil.js')

const game = t.fixtureDogma('Hatshepsut', { expansions: ['base', 'figs'] })
t.setColor(game, 'micah', 'blue', ['Writing'])
t.setHand(game, 'micah', ['Imhotep'])
game.run()
t.dogma(game, 'Writing')

const handAges = game
  .getHand('micah')
  .cards
  .map(game.getCardData)
  .map(c => c.age)
expect(handAges).toStrictEqual([2, 2, 2])
