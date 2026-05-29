const t = require('../../../testutil_v2.js')

describe('Mud Wallower', () => {
  // Card text: "Each time you use an accumulation space, place 1 clay on
  // this card. Exchange 4 clay for 1 wild boar held by this card."

  test('accumulates clay when using accumulation spaces', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['mud-wallower-c148'],
      },
    })
    game.run()

    // dennis takes Forest (accumulation space) → 1 clay on card
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['mud-wallower-c148'],
        wood: 3,
      },
    })
  })

  test('boar produced by card counts as a real animal', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: { occupations: ['mud-wallower-c148'] },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const player = game.players.byName('dennis')
      player.addCardAnimal('mud-wallower-c148', 'boar', 1)
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.getTotalAnimals('boar')).toBe(1)
  })

  test('boar on card counts toward breeding requirement', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: { occupations: ['mud-wallower-c148'] },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const player = game.players.byName('dennis')
      player.addCardAnimal('mud-wallower-c148', 'boar', 2)
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // Two boar on the card satisfy the breeding threshold; consequently boar
    // also has capacity somewhere (otherwise this would be the harvest blocker).
    expect(dennis._getBreedingRequirement('boar')).toBe(2)
    expect(dennis.getTotalAnimals('boar')).toBe(2)
  })

  test('boar cannot be moved back onto the card once it leaves', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: { occupations: ['mud-wallower-c148'] },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const player = game.players.byName('dennis')
      player.addCardAnimal('mud-wallower-c148', 'boar', 1)
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const holdings = dennis.getAnimalHoldingCards()
    const mw = holdings.find(h => h.cardId === 'mud-wallower-c148')
    expect(mw.capacity).toBe(1)
    expect(mw.animals.boar).toBe(1)

    // Remove the boar — capacity drops with it, leaving no room to re-add.
    dennis.removeCardAnimal('mud-wallower-c148', 'boar', 1)
    const after = dennis.getAnimalHoldingCards().find(h => h.cardId === 'mud-wallower-c148')
    expect(after.capacity).toBe(0)
    expect(after.animals.boar).toBe(0)
  })
})
