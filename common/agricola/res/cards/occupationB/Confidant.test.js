const t = require('../../../testutil_v2.js')

describe('Confidant', () => {
  test('onPlay places food on next 2 round spaces when choosing 2', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['confidant-b093'],
        food: 4,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Confidant')
    t.choose(game, t.currentChoices(game)[0])  // e.g. '2 spaces'

    // Round 1 when playing; next 2 rounds are 2, 3
    t.testBoard(game, {
      dennis: {
        occupations: ['confidant-b093'],
        food: 2,
        scheduled: { food: { 2: 1, 3: 1 }, confidantSowFences: [2, 3] },
      },
    })
  })

  test('onPlay with insufficient food does not offer choice', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['confidant-b093'],
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Confidant')

    // No Confidant prompt; card played but no scheduling
    t.testBoard(game, {
      dennis: {
        occupations: ['confidant-b093'],
        food: 0,
      },
    })
  })

  test('onRoundStart offers Sow and player sows grain', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['confidant-b093'],
        grain: 2,
        scheduled: { food: { 3: 1 }, confidantSowFences: [3] },
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // Round 3 start: food delivered, then Confidant offers Sow / Build Fences / Skip
    t.choose(game, 'Sow')
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })

    t.testBoard(game, {
      dennis: {
        occupations: ['confidant-b093'],
        food: 1,
        grain: 1,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
      },
    })
  })

  test('onRoundStart offers Build Fences and player builds pasture', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['confidant-b093'],
        wood: 4,
        scheduled: { food: { 3: 1 }, confidantSowFences: [3] },
      },
    })
    game.run()

    // Round 3 start: food delivered, then Confidant offers Build Fences
    t.choose(game, 'Build Fences')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }] })

    t.testBoard(game, {
      dennis: {
        occupations: ['confidant-b093'],
        food: 1,
        wood: 0,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('onRoundStart skips silently when player cannot sow or fence', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['confidant-b093'],
        wood: 0,
        grain: 0,
        vegetables: 0,
        scheduled: { food: { 3: 1 }, confidantSowFences: [3] },
      },
    })
    game.run()

    // Round 3 start: food delivered, no sow/fence ability → no prompt, straight to work phase
    // The first prompt should be action selection (Forest, etc.)
    t.testBoard(game, {
      dennis: {
        occupations: ['confidant-b093'],
        food: 1,
      },
    })
  })
})
