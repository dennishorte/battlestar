const t = require('../../../testutil_v2.js')

describe('Tax Collector', () => {
  test('gives 2 wood when in stone house at round start', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['tax-collector-e126'],
        roomType: 'stone',
      },
    })
    game.run()

    // Round 2 starts, onRoundStart fires: dennis in stone house, choose 2 wood
    t.choose(game, '2 wood')

    t.testBoard(game, {
      dennis: {
        wood: 2,
        roomType: 'stone',
        occupations: ['tax-collector-e126'],
      },
    })
  })

  test('gives 2 clay when chosen', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['tax-collector-e126'],
        roomType: 'stone',
      },
    })
    game.run()

    t.choose(game, '2 clay')

    t.testBoard(game, {
      dennis: {
        clay: 2,
        roomType: 'stone',
        occupations: ['tax-collector-e126'],
      },
    })
  })

  test('gives 1 reed when chosen', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['tax-collector-e126'],
        roomType: 'stone',
      },
    })
    game.run()

    t.choose(game, '1 reed')

    t.testBoard(game, {
      dennis: {
        reed: 1,
        roomType: 'stone',
        occupations: ['tax-collector-e126'],
      },
    })
  })

  test('gives 1 stone when chosen', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['tax-collector-e126'],
        roomType: 'stone',
      },
    })
    game.run()

    t.choose(game, '1 stone')

    t.testBoard(game, {
      dennis: {
        stone: 1,
        roomType: 'stone',
        occupations: ['tax-collector-e126'],
      },
    })
  })

  test('does not trigger when not in stone house', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['tax-collector-e126'],
        roomType: 'wood', // not stone
      },
    })
    game.run()

    // Round 2 starts — no Tax Collector prompt (not in stone house)
    // First choice is a normal action
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,
        roomType: 'wood',
        occupations: ['tax-collector-e126'],
      },
    })
  })

  test('does not trigger in clay house', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['tax-collector-e126'],
        roomType: 'clay',
      },
    })
    game.run()

    // No Tax Collector prompt
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,
        roomType: 'clay',
        occupations: ['tax-collector-e126'],
      },
    })
  })
})
