Error.stackTraceLimit = 100

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

test('after each player has chosen, cards are played', () => {
  const game = t.fixtureFirstPicks()
  expect(game.getZoneColorByPlayer('dennis', 'blue').cards[0]).toBe('Tools')
  expect(game.getZoneColorByPlayer('micah', 'yellow').cards[0]).toBe('Domestication')
  expect(game.getZoneColorByPlayer('tom', 'green').cards[0]).toBe('Sailing')
})

test('initial cards do not trigger meld reactions (like drawing a city)', () => {
  const game = t.fixtureFirstPicks({
    expansions: ['base', 'city'],
  })
  expect(game.getHand('dennis').cards.length).toBe(1)
  expect(game.getHand('micah').cards.length).toBe(1)
  expect(game.getHand('tom').cards.length).toBe(1)
})

test('first player is based on starting card alphabetical order', () => {
  const game = t.fixtureFirstPicks()
  expect(game.getPlayerCurrentTurn().name).toBe('micah')
})
