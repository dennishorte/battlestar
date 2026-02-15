const t = require('../../../testutil_v2.js')

describe('Second Spouse', () => {
  // Card text: "You can use 'Urgent Wish for Children' even if it is occupied
  // by the first person another player placed."

  test('card exists and has passive flag', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['second-spouse-c129'],
      },
    })
    game.run()

    const card = game.cards.byId('second-spouse-c129')
    expect(card).toBeTruthy()
    expect(card.definition.allowsUrgentFamilyGrowthIfFirstPerson).toBe(true)
  })
})
