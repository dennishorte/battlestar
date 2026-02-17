const t = require('../../../testutil_v2.js')

describe('Cattle Whisperer', () => {
  // Card text: "Add 5 and 8 to the current round and place 1 cattle on each
  // corresponding round space. At the start of these rounds, you get the cattle."

  test('onPlay schedules cattle at round+5 and round+8', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['cattle-whisperer-c166'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 1: play Cattle Whisperer (schedules cattle at round 6 and 9)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Cattle Whisperer')

    t.testBoard(game, {
      dennis: {
        food: 10,
        occupations: ['cattle-whisperer-c166'],
        scheduled: {
          cattle: { 6: 1, 9: 1 },
        },
      },
    })
  })
})
