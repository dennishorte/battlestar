const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Ceilings (B076)', () => {
  test('schedules wood for next 5 rounds', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        clay: 1,
        hand: ['ceilings-b076'],
        occupations: ['wood-cutter'],
      },
      round: 3,
    })
    game.run()

    game.state.round = 3
    t.playCard(game, 'dennis', 'ceilings-b076')

    const dennis = t.player(game)
    expect(game.state.scheduledWood[dennis.name][4]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][5]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][8]).toBe(1)
  })

  test('removes scheduled wood on renovate', () => {
    const card = res.getCardById('ceilings-b076')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.ceilingsRounds = [4, 5, 6]
    game.state.scheduledWood = {
      [dennis.name]: { 4: 1, 5: 1, 6: 1 },
    }

    card.onRenovate(game, dennis)

    expect(game.state.scheduledWood[dennis.name][4]).toBeUndefined()
    expect(game.state.scheduledWood[dennis.name][5]).toBeUndefined()
    expect(game.state.scheduledWood[dennis.name][6]).toBeUndefined()
    expect(dennis.ceilingsRounds).toEqual([])
  })
})
