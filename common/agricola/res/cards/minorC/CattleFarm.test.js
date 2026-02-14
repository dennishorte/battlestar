const t = require('../../../testutil_v2.js')

describe('Cattle Farm', () => {
  test('holds cattle per pasture count', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cattle-farm-c012'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
            { spaces: [{ row: 2, col: 2 }] },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    const player = game.players.byName('dennis')
    const holdings = player.getAnimalHoldingCards()
    const cattleFarm = holdings.find(h => h.cardId === 'cattle-farm-c012')

    expect(cattleFarm).toBeTruthy()
    expect(cattleFarm.capacity).toBe(2) // 2 pastures
    expect(cattleFarm.allowedTypes).toEqual(['cattle'])
    expect(cattleFarm.mixedTypes).toBe(false)
  })

  test('only holds cattle, not other animals', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cattle-farm-c012'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    const player = game.players.byName('dennis')
    const holdings = player.getAnimalHoldingCards()
    const cattleFarm = holdings.find(h => h.cardId === 'cattle-farm-c012')

    expect(cattleFarm.allowedTypes).toEqual(['cattle'])
    // Verify sheep/boar cannot go on this card
    expect(cattleFarm.allowedTypes).not.toContain('sheep')
    expect(cattleFarm.allowedTypes).not.toContain('boar')
  })
})
