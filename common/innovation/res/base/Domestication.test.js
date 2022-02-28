Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Domestication', () => {
  test('choose a card and draw a 1', () => {
    const game = t.fixtureTopCard('Domestication')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Experimentation', 'Statistics'])
      t.clearBoard(game, 'micah')
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Domestication')
    t.choose(game, request2, 'Experimentation')

    const dennis = game.getPlayerByName('dennis')
    const dennisBlue = game.getZoneByPlayer(dennis, 'blue').cards().map(c => c.id)
    const dennisHand = game.getZoneByPlayer(dennis, 'hand').cards().map(c => c.age).sort()
    expect(dennisBlue).toStrictEqual(['Experimentation'])
    expect(dennisHand).toStrictEqual([1,4])
  })

  test('even if no card to meld still draws a card', () => {
    const game = t.fixtureTopCard('Domestication')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', [])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Domestication')

    const dennis = game.getPlayerByName('dennis')
    const dennisHand = game.getZoneByPlayer(dennis, 'hand').cards().map(c => c.age).sort()
    expect(dennisHand).toStrictEqual([1])
  })
})
