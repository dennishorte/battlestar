const t = require('../../../testutil_v2.js')
const PigBreeder = require('./PigBreeder.js')

describe('Pig Breeder', () => {
  // Card is 4+ players. onPlay: 1 boar. onRoundEnd(12): boar breed if 2+ and room.

  test('onPlay gives 1 wild boar when player can place', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      dennis: {
        occupations: ['pig-breeder-a165'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()
    const dennis = game.players.byName('dennis')
    PigBreeder.onPlay(game, dennis)
    expect(dennis.getTotalAnimals('boar')).toBe(1)
    t.choose(game, 'Forest')
  })

  test('onRoundEnd(12) breeds 1 boar when player has 2+ boar and can place', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      dennis: {
        occupations: ['pig-breeder-a165'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], boar: 2 },
            { spaces: [{ row: 2, col: 1 }] },
          ],
        },
      },
    })
    game.run()
    const dennis = game.players.byName('dennis')
    const before = dennis.getTotalAnimals('boar')
    PigBreeder.onRoundEnd(game, dennis, 12)
    expect(dennis.getTotalAnimals('boar')).toBe(before + 1)
    t.choose(game, 'Forest')
  })

  test('onRoundEnd(12) does nothing when round is not 12', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      dennis: {
        occupations: ['pig-breeder-a165'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }, { spaces: [{ row: 2, col: 1 }] }],
        },
      },
    })
    game.run()
    const dennis = game.players.byName('dennis')
    dennis.addAnimals('boar', 2)
    PigBreeder.onRoundEnd(game, dennis, 11)
    expect(dennis.getTotalAnimals('boar')).toBe(2)
    t.choose(game, 'Forest')
  })
})
