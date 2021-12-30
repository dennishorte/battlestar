Error.stackTraceLimit = 100

const Game = require('../game.js')
const t = require('../testutil.js')

test('can choose either card', () => {
  const game = t.fixture()
  game.run()
  const waiting = game.getWaiting()
  expect(waiting.length).toBe(3)
  expect(waiting[0].options.length).toBe(2)
  expect(waiting[1].options.length).toBe(2)
  expect(waiting[2].options.length).toBe(2)
})


function _firstPicksFixture(options) {
  const game = t.fixture(options)
  game.run()
  game.rk.undo('Initialization Complete')
  t.setHand(game, 'dennis', ['Archery', 'Tools'])
  t.setHand(game, 'micah', ['Domestication', 'Writing'])
  t.setHand(game, 'tom', ['Sailing', 'Code of Laws'])
  game.run()

  game.submit({
    actor: 'dennis',
    name: 'Choose Initial Card',
    option: ['Tools'],
  })
  game.submit({
    actor: 'micah',
    name: 'Choose Initial Card',
    option: ['Domestication'],
  })
  game.submit({
    actor: 'tom',
    name: 'Choose Initial Card',
    option: ['Sailing'],
  })

  return game
}

test('after each player has chosen, cards are played', () => {
  const game = _firstPicksFixture()
  expect(game.getZoneColorByPlayer('dennis', 'blue').cards[0]).toBe('Tools')
  expect(game.getZoneColorByPlayer('micah', 'yellow').cards[0]).toBe('Domestication')
  expect(game.getZoneColorByPlayer('tom', 'green').cards[0]).toBe('Sailing')
})

test('initial cards do not trigger meld reactions (like drawing a city)', () => {
  const game = _firstPicksFixture({
    expansions: ['base', 'city'],
  })
  expect(game.getHand('dennis').cards.length).toBe(1)
  expect(game.getHand('micah').cards.length).toBe(1)
  expect(game.getHand('tom').cards.length).toBe(1)
})

test('first player is based on starting card alphabetical order', () => {
  const game = _firstPicksFixture()
  expect(game.getPlayerCurrentTurn().name).toBe('micah')
})
