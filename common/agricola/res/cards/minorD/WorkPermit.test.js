const t = require('../../../testutil_v2.js')

describe('Work Permit', () => {
  test('play with building resources — worker scheduled for future round', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['work-permit-d022'],
        food: 2,
        wood: 2,   // 2 building resources
        clay: 1,   // +1 = 3 total
        // targetRound = 2 + 3 = 5
      },
    })
    game.run()

    // Dennis turn 1: play Work Permit via Meeting Place
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Work Permit')
    // onPlay schedules worker for round 5

    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2
    t.choose(game, 'Forest')
    // Micah turn 2
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['work-permit-d022'],
        food: 2, // 2 - 1 (card cost) + 1 (Meeting Place)
        wood: 5, // 2 + 3 (Forest)
        clay: 1,
      },
    })

    // Verify the worker is scheduled for round 5
    expect(game.state.workPermitWorkers).toEqual([
      { round: 5, playerName: 'dennis', cardId: 'work-permit-d022' },
    ])
  })

  test('targetRound > 14 — no worker scheduled', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 13,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['work-permit-d022'],
        food: 2,
        wood: 1,
        clay: 1,
        // targetRound = 13 + 2 = 15 > 14
      },
    })
    game.run()

    // Dennis turn 1: play Work Permit
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Work Permit')
    // onPlay: targetRound 15 > 14, no worker scheduled

    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2
    t.choose(game, 'Forest')
    // Micah turn 2
    t.choose(game, 'Clay Pit')

    // No worker scheduled
    expect(game.state.workPermitWorkers || []).toEqual([])
  })

  test('scheduled worker fires in target round', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['work-permit-d022'],
        wood: 1, // prereq: buildingResourcesInSupply
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.state.workPermitWorkers = [
        { round: 3, playerName: 'dennis', cardId: 'work-permit-d022' },
      ]
    })
    game.run()

    // Dennis turn 1
    t.choose(game, 'Forest')
    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2
    t.choose(game, 'Clay Pit')
    // Micah turn 2
    t.choose(game, 'Grain Seeds')

    // Dennis 0 workers — WorkPermit worker fires
    t.choose(game, 'Meeting Place')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['work-permit-d022'],
        food: 1, // Meeting Place gives 1 food
        wood: 4, // 1 initial + 3 Forest
        clay: 1,
      },
    })

    // Worker entry consumed
    expect(game.state.workPermitWorkers).toEqual([])
  })
})
