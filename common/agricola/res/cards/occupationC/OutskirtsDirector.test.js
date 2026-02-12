const t = require('../../../testutil_v2.js')

describe('Outskirts Director', () => {
  test('places 2 reed on Hollow when using Grove and grants extra action', () => {
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['outskirts-director-c130'],
      },
    })
    game.run()

    // Dennis uses Grove (wood accumulation)
    t.choose(game, 'Grove')
    // Outskirts Director offers to place 2 reed on Hollow
    t.choose(game, 'Place 2 reed on Hollow')

    // micah + scott take their turns
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')

    // Dennis gets extra action from Outskirts Director
    t.choose(game, 'Grain Seeds')

    // micah + scott take their second turns
    t.choose(game, 'Forest')
    t.choose(game, 'Reed Bank')

    // Dennis takes normal second action
    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        wood: 2, // from Grove (accumulates 2 wood/round, round 2 = 2)
        food: 1, // from Fishing
        grain: 1, // from Grain Seeds
        occupations: ['outskirts-director-c130'],
      },
    })
  })

  test('reed placed on Hollow is collected by whoever takes Hollow', () => {
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['outskirts-director-c130'],
      },
    })
    game.run()

    // Dennis uses Grove → places 2 reed on Hollow
    t.choose(game, 'Grove')
    t.choose(game, 'Place 2 reed on Hollow')

    // Micah takes Hollow (gets clay + 2 bonus reed)
    t.choose(game, 'Hollow')

    // scott
    t.choose(game, 'Day Laborer')

    // Dennis extra action
    t.choose(game, 'Grain Seeds')

    // micah + scott
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')

    // Dennis normal second action
    t.choose(game, 'Reed Bank')

    t.testBoard(game, {
      micah: {
        clay: 1, // from Hollow (1 clay/round at 3 players)
        reed: 2, // bonus reed from Outskirts Director
        wood: 3, // from Forest
      },
    })
  })

  test('places 2 reed on Grove when using Hollow', () => {
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['outskirts-director-c130'],
      },
    })
    game.run()

    // Dennis uses Hollow (clay accumulation)
    t.choose(game, 'Hollow')
    // Outskirts Director offers to place 2 reed on Grove
    t.choose(game, 'Place 2 reed on Grove')

    // micah takes Grove (gets wood + 2 bonus reed)
    t.choose(game, 'Grove')

    // scott
    t.choose(game, 'Day Laborer')

    // Dennis extra action
    t.choose(game, 'Forest')

    // micah + scott
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Dennis normal second action
    t.choose(game, 'Reed Bank')

    t.testBoard(game, {
      dennis: {
        clay: 1, // from Hollow
        wood: 3, // from Forest
        reed: 1, // from Reed Bank
        occupations: ['outskirts-director-c130'],
      },
      micah: {
        wood: 2, // from Grove (2 wood/round at 3 players)
        reed: 2, // bonus reed from Outskirts Director
        grain: 1, // from Grain Seeds
      },
    })
  })

  test('can decline to place reed', () => {
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['outskirts-director-c130'],
      },
    })
    game.run()

    t.choose(game, 'Grove')
    t.choose(game, 'Do not place reed')

    // No extra action — micah goes next
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 2, // from Grove only
        occupations: ['outskirts-director-c130'],
      },
    })
  })

  test('does not trigger on non-Grove/Hollow spaces', () => {
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['outskirts-director-c130'],
      },
    })
    game.run()

    // Forest is not Grove or Hollow
    t.choose(game, 'Forest')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3, // from Forest (3 wood/round)
        occupations: ['outskirts-director-c130'],
      },
    })
  })
})
