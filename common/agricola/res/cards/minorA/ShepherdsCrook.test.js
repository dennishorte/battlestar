const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Shepherd\'s Crook (A083)', () => {
  test('onBuildPasture gives sheep for 4+ space pastures', () => {
    const card = res.getCardById('shepherds-crook-a083')
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }] }],
        },
      },
    })
    game.run()

    const dennis = t.player(game)
    const largePasture = {
      spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
    }

    card.onBuildPasture(game, dennis, largePasture)

    expect(dennis.getTotalAnimals('sheep')).toBe(2)
  })

  test('does not give sheep for pastures smaller than 4 spaces', () => {
    const card = res.getCardById('shepherds-crook-a083')
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }, { row: 1, col: 1 }] }],
        },
      },
    })
    game.run()

    const dennis = t.player(game)
    const smallPasture = {
      spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }],
    }

    card.onBuildPasture(game, dennis, smallPasture)

    expect(dennis.getTotalAnimals('sheep')).toBe(0)
  })
})
