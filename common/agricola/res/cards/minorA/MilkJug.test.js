const t = require('../../../testutil_v2.js')

describe('Milk Jug', () => {
  test('gives card owner 3 food and other players 1 food on Cattle Market', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        minorImprovements: ['milk-jug-a050'],
      },
      actionSpaces: ['Cattle Market'],
    })
    game.run()

    t.choose(game, 'Cattle Market')   // micah takes Cattle Market (1 cattle auto-placed as pet)

    t.testBoard(game, {
      dennis: {
        food: 3, // from Milk Jug
        minorImprovements: ['milk-jug-a050'],
      },
      micah: {
        food: 1, // from Milk Jug (other player bonus)
        pet: 'cattle',
        animals: { cattle: 1 },
      },
    })
  })
})
