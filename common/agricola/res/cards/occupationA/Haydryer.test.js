const t = require('../../../testutil_v2.js')
const Haydryer = require('./Haydryer.js')

describe('Haydryer', () => {
  // Card is 4+ players. onBeforeHarvest: may buy 1 cattle for 4 − pastures food, min 0.

  test('onBeforeHarvest with 0 pastures: cost is 4; buy grants 1 cattle', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      dennis: {
        occupations: ['haydryer-a166'],
        food: 5,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()
    const dennis = game.players.byName('dennis')
    game.actions.choose = (player, choices, _opts) => {
      const buy = choices.find(c => c.startsWith('Buy 1 cattle'))
      return buy ? [buy] : ['Skip']
    }
    Haydryer.onBeforeHarvest(game, dennis)
    expect(dennis.getTotalAnimals('cattle')).toBe(1)
    // 1 pasture → cost = 4 − 1 = 3, so 5 − 3 = 2 food left
    expect(dennis.food).toBe(2)
  })

  test('onBeforeHarvest with 2 pastures: cost is 2', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      dennis: {
        occupations: ['haydryer-a166'],
        food: 3,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
            { spaces: [{ row: 2, col: 1 }] },
          ],
        },
      },
    })
    game.run()
    const dennis = game.players.byName('dennis')
    let chosenLabel = null
    game.actions.choose = (player, choices, _opts) => {
      chosenLabel = choices[0]
      return [choices[0]]
    }
    Haydryer.onBeforeHarvest(game, dennis)
    expect(chosenLabel).toBe('Buy 1 cattle for 2 food')
    expect(dennis.getTotalAnimals('cattle')).toBe(1)
    expect(dennis.food).toBe(1)
  })
})
