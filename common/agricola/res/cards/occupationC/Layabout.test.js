const t = require('../../../testutil_v2.js')

describe('Layabout', () => {
  // Card text: "When you play this card, you must skip the next harvest.
  // (You also do not have to feed your family that harvest.)"

  test('skips next harvest entirely after playing', () => {
    // Play Layabout in round 3, then at round 4 harvest:
    // - field phase skipped (grain in field should remain unharvested)
    // - feeding skipped (no begging cards despite 0 food)
    // - breeding skipped
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['layabout-c108'],
        food: 0,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 4: dennis plays Layabout via Lessons A
    t.choose(game, 'Lessons A')
    t.choose(game, 'Layabout')

    // micah takes an action
    t.choose(game, 'Day Laborer')

    // dennis and micah each take second action
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Fishing')

    // Round 4 harvest: dennis skips entirely
    // - field: grain stays at 3 (not harvested)
    // - feeding: skipped (no begging despite 0 food)
    // - breeding: skipped
    t.testBoard(game, {
      dennis: {
        occupations: ['layabout-c108'],
        grain: 1,  // from Grain Seeds
        beggingCards: 0,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })
})
