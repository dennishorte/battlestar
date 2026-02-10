const t = require('../../../testutil_v2.js')

describe('Reclamation Plow', () => {
  test('plows a field after taking sheep when played via Major Improvement', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['reclamation-plow-a017'],
        wood: 1, // cost to play Reclamation Plow
      },
      actionSpaces: ['Sheep Market', 'Major Improvement'],
    })
    game.run()

    // dennis: play Reclamation Plow via Major Improvement action
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Reclamation Plow')
    // onPlay fires → reclamationPlowActive = true

    // micah: simple action
    t.choose(game, 'Day Laborer')

    // dennis: take sheep from Sheep Market (1 accumulated)
    // canPlaceAnimals returns true (1 sheep as house pet)
    // onTakeAnimals fires → ReclamationPlow calls plowField
    t.choose(game, 'Sheep Market')
    t.action(game, 'plow-space', { row: 0, col: 2 })

    // micah: simple action
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        pet: 'sheep',
        minorImprovements: ['reclamation-plow-a017'],
        animals: { sheep: 1 },
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })

    // Verify reclamationPlowActive is now false (one-time use)
    const dennis = t.dennis(game)
    expect(dennis.reclamationPlowActive).toBe(false)
  })
})
