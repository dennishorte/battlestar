const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Mineral Feeder (C067)', () => {
  test('has onRoundStart hook', () => {
    const card = res.getCardById('mineral-feeder-c067')
    expect(card.onRoundStart).toBeDefined()
  })

  test('gives grain in non-harvest round with sheep in pastures', () => {
    const card = res.getCardById('mineral-feeder-c067')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getSheepInPastures = () => 2

    game.isHarvestRound = () => false

    card.onRoundStart(game, dennis, 5)

    expect(dennis.grain).toBe(1)
  })

  test('does not give grain in harvest round', () => {
    const card = res.getCardById('mineral-feeder-c067')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getSheepInPastures = () => 2

    game.isHarvestRound = () => true

    card.onRoundStart(game, dennis, 4)

    expect(dennis.grain).toBe(0)
  })

  test('does not give grain with no sheep in pastures', () => {
    const card = res.getCardById('mineral-feeder-c067')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getSheepInPastures = () => 0

    game.isHarvestRound = () => false

    card.onRoundStart(game, dennis, 5)

    expect(dennis.grain).toBe(0)
  })
})
