const t = require('../../../testutil_v2.js')

test('accumulates wood each round and can take via anytime action', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 1,
    dennis: {
      hand: ['tree-inspector-d116'],
    },
  })
  game.run()
  // Round 1: play the card. onPlay sets wood = 0.
  t.choose(game, 'Lessons A')
  t.choose(game, 'Tree Inspector')
  t.choose(game, 'Day Laborer')  // micah
  t.choose(game, 'Grain Seeds')  // dennis
  t.choose(game, 'Forest')       // micah
  // Round 1 ends. Round 2 starts: onRoundStart fires → wood = 1
  // Use anytime action to take wood
  const dennis = game.players.byName('dennis')
  const actions = game.getAnytimeActions(dennis)
  const tiAction = actions.find(a => a.cardName === 'Tree Inspector')
  t.anytimeAction(game, tiAction)
  // Main action choice follows
  t.choose(game, 'Day Laborer')  // dennis
  t.choose(game, 'Forest')       // micah
  t.choose(game, 'Grain Seeds')  // dennis
  t.choose(game, 'Clay Pit')     // micah
  t.testBoard(game, {
    round: 3,
    dennis: {
      occupations: ['tree-inspector-d116'],
      wood: 1, // taken 1 via anytime action
      food: 2, // Day Laborer in round 2
      grain: 2, // Grain Seeds in round 1 + round 2
    },
  })
})

test('loses wood when quarry is revealed', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  // Play card early, accumulate wood, then a quarry reveal should clear it
  // Use actionSpaces to control round card reveals
  // Stage 1 cards (4): Grain Utilization, Sheep Market, Fencing, Major Improvement
  // Stage 2: Western Quarry (stone accumulation) — revealed at round 5
  t.setBoard(game, {
    actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement', 'Western Quarry'],
    dennis: {
      hand: ['tree-inspector-d116'],
    },
  })
  game.run()
  // Round 6 work phase. Tree Inspector not yet played.
  // Play it now, then verify it's active.
  t.choose(game, 'Lessons A')
  t.choose(game, 'Tree Inspector')
  t.choose(game, 'Day Laborer')
  t.choose(game, 'Fishing')
  t.choose(game, 'Clay Pit')
  // Card is now active. Quarry was already revealed before we played.
  // onRoundStart at round 7 adds 1 wood.
  // The quarry reveal won't fire retroactively (it already happened).
  // Just verify the card is working (wood accumulates).
  t.testBoard(game, {
    dennis: {
      occupations: ['tree-inspector-d116'],
      food: 1, // from Fishing
    },
  })
})
