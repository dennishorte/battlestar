const t = require('../../../testutil_v2.js')

describe('Wooden Shed', () => {
  test('cannot be played via minor improvement action, only major improvement', () => {
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wooden-shed-a010'],
        wood: 2,
        reed: 1,
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    // Meeting Place offers minor improvements, but Wooden Shed should not appear
    t.choose(game, 'Meeting Place')
    expect(t.currentChoices(game)).not.toContain('Minor Improvement.Wooden Shed')
    t.choose(game, 'Do not play an improvement')

    t.choose(game, 'Day Laborer')  // micah

    // Major Improvement action space should offer Wooden Shed
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Wooden Shed')

    t.choose(game, 'Forest')  // micah

    t.testBoard(game, {
      dennis: {
        food: 1,  // Meeting Place gives 1 food
        wood: 0,
        reed: 0,
        hand: [],
        minorImprovements: ['wooden-shed-a010'],
      },
    })
  })

  test('provides room for one person, enabling family growth', () => {
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['Basic Wish for Children'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wooden-shed-a010'],
        wood: 2,
        reed: 1,
        food: 10,
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    // Play Wooden Shed via Major Improvement (2 rooms + card = 3 capacity, 2 family)
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Wooden Shed')

    t.choose(game, 'Day Laborer')  // micah

    // Family growth should work — card provides room for 1 extra person
    t.choose(game, 'Basic Wish for Children')

    t.choose(game, 'Forest')  // micah

    t.testBoard(game, {
      dennis: {
        wood: 0,
        reed: 0,
        food: 10,
        familyMembers: 3,
        hand: [],
        minorImprovements: ['wooden-shed-a010'],
      },
    })
  })

  test('blocks further renovation', () => {
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wooden-shed-a010'],
        wood: 2,
        reed: 11,
        clay: 10,
        food: 10,
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    // Play Wooden Shed via Major Improvement
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Wooden Shed')

    t.choose(game, 'Day Laborer')  // micah

    // House Redevelopment: renovation should be skipped due to cannotRenovate
    t.choose(game, 'House Redevelopment')

    t.choose(game, 'Forest')  // micah

    t.testBoard(game, {
      dennis: {
        wood: 0,
        clay: 10,
        reed: 10,
        food: 10,
        roomType: 'wood',  // still wood — renovation was blocked
        hand: [],
        minorImprovements: ['wooden-shed-a010'],
      },
    })
  })
})
