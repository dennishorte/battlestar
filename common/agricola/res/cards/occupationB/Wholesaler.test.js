const t = require('../../../testutil_v2.js')

describe('Wholesaler', () => {
  // Card text: "Place 1 vegetable, 1 wild boar, 1 stone, and 1 cattle on
  // this card. Each time you use an action space card on round spaces 8 to
  // 11, you get the corresponding good from this card."
  // Uses onPlay + onAction hooks. Card is 3+ players.

  test('using round 8 action gives 1 vegetable', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wholesaler-b137'],
      },
    })
    game.run()

    // Play Wholesaler via Lessons A
    t.choose(game, 'Lessons A')
    t.choose(game, 'Wholesaler')

    // Other players take actions
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // scott

    // Use Vegetable Seeds (round 8) → get 1 veg from action + 1 from Wholesaler
    t.choose(game, 'Vegetable Seeds')

    t.testBoard(game, {
      dennis: {
        vegetables: 2,  // 1 from action + 1 from Wholesaler
        occupations: ['wholesaler-b137'],
      },
    })
  })

  test('using round 9 action gives 1 boar', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wholesaler-b137'],
      },
    })
    game.run()

    // Play Wholesaler
    t.choose(game, 'Lessons A')
    t.choose(game, 'Wholesaler')

    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // scott

    // Pig Market (round 9) → get 1 boar from action (pet)
    // Wholesaler tries to add 1 boar but canPlaceAnimals fails (pet already taken)
    t.choose(game, 'Pig Market')

    t.testBoard(game, {
      dennis: {
        animals: { boar: 1 },
        pet: 'boar',
        occupations: ['wholesaler-b137'],
      },
    })
  })

  test('using round 10 action gives 1 stone', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
        'Cattle Market'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wholesaler-b137'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Wholesaler')

    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // scott

    // Cattle Market is round 10 → gives 1 stone from Wholesaler + cattle from action
    t.choose(game, 'Cattle Market')

    t.testBoard(game, {
      dennis: {
        stone: 1,  // from Wholesaler (round 10)
        animals: { cattle: 1 },
        pet: 'cattle',
        occupations: ['wholesaler-b137'],
      },
    })
  })

  test('goods are consumed once used', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wholesaler-b137'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Wholesaler')

    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // scott

    // Use Vegetable Seeds (round 8) to consume the vegetable
    t.choose(game, 'Vegetable Seeds')

    t.testBoard(game, {
      dennis: {
        vegetables: 2,
        occupations: ['wholesaler-b137'],
      },
    })
  })

  test('does not trigger on actions outside rounds 8-11', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wholesaler-b137'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Wholesaler')

    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // scott

    // Sheep Market (round 2) — outside 8-11, no bonus
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 1 },
        pet: 'sheep',
        occupations: ['wholesaler-b137'],
      },
    })
  })
})
