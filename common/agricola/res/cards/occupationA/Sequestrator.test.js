const t = require('../../../testutil_v2.js')

describe('Sequestrator', () => {
  // Card is 3+ players. onPlay: place 3 reed, 4 clay on card. checkTrigger: first player with 3 pastures gets 3 reed; first with 5 fields gets 4 clay.
  test('onPlay places 3 reed and 4 clay on card; checkTrigger gives 3 reed to first player with 3 pastures', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['sequestrator-a144'],
        occupations: [],
        food: 2, // need food to play occupation if not first free
      },
      micah: {
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
            { spaces: [{ row: 2, col: 1 }] },
            { spaces: [{ row: 2, col: 2 }] },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Sequestrator')
    // Finish round (5 more actions)
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')    // scott
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Day Laborer') // micah
    t.choose(game, 'Reed Bank')   // scott

    // Round end → checkTrigger → micah has 3 pastures → gets 3 reed

    t.testBoard(game, {
      dennis: {
        occupations: ['sequestrator-a144'],
        food: 2,
        grain: 1,
      },
      micah: {
        reed: 3,
        wood: 3,
        food: 2,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
            { spaces: [{ row: 2, col: 1 }] },
            { spaces: [{ row: 2, col: 2 }] },
          ],
        },
      },
    })
  })

  test('checkTrigger gives 4 clay to first player with 5 fields', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['sequestrator-a144'],
        occupations: [],
        food: 2,
      },
      micah: {
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 1, col: 2 },
            { row: 0, col: 2 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Sequestrator')
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // scott
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Reed Bank')    // scott

    // Round end → checkTrigger → micah has 5 fields → gets 4 clay

    t.testBoard(game, {
      dennis: {
        occupations: ['sequestrator-a144'],
        food: 2,
        grain: 1,
      },
      micah: {
        clay: 4,
        wood: 3,
        food: 2,
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 1, col: 2 },
            { row: 0, col: 2 },
          ],
        },
      },
    })
  })

  test('reed and clay are not awarded retroactively', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sequestrator-a144'],
        reed: 0,
        clay: 0,
      },
      micah: {
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
            { spaces: [{ row: 2, col: 1 }] },
            { spaces: [{ row: 2, col: 2 }] },
          ],
        },
      },
    })
    // Card already played but card state may not have been set (setBoard doesn't call onPlay)
    game.testSetBreakpoint('initialization-complete', (g) => {
      const s = g.cardState('sequestrator-a144')
      s.reedAvailable = 3
      s.clayAvailable = 4
    })
    game.run()

    // One full round to trigger round end
    t.choose(game, 'Forest')       // dennis
    t.choose(game, 'Clay Pit')    // micah
    t.choose(game, 'Grain Seeds') // scott
    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Reed Bank')   // micah → +1 reed
    t.choose(game, 'Fishing')     // scott

    // Round end → micah has 3 pastures → gets 3 reed from Sequestrator. micah took Reed Bank → +1 reed = 4 total.
    t.testBoard(game, {
      dennis: {
        occupations: ['sequestrator-a144'],
        food: 2,
        wood: 3,
        grain: 0,
      },
      micah: {
        reed: 4, // 3 from Sequestrator + 1 from Reed Bank
        clay: 1,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
            { spaces: [{ row: 2, col: 1 }] },
            { spaces: [{ row: 2, col: 2 }] },
          ],
        },
      },
    })
  })
})
