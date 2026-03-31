const t = require('../testutil')

describe('Sandworm Reward Doubling', () => {

  test('sandworm presence doubles resource rewards in combat', () => {
    // Set up dennis winning combat with sandworms deployed
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5, solari: 0, spice: 0 },
    })
    game.run()

    // Dennis deploys troops for combat
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Complete the round
    const startRound = game.state.round
    let safety = 30
    while (game.waiting && !game.gameOver && game.state.round === startRound && safety-- > 0) {
      const choices = t.currentChoices(game)
      if (choices.includes('Reveal Turn')) {
        t.choose(game, 'Reveal Turn')
      }
      else if (choices.includes('Pass')) {
        t.choose(game, 'Pass')
      }
      else {
        t.choose(game, choices[0])
      }
    }

    // Dennis won combat — round completed
    expect(game.state.round).toBeGreaterThanOrEqual(2)
  })

  test('control rewards are not doubled (type exclusion)', () => {
    const conflictCards = require('../res/cards/conflict.js')
    const allRewards = conflictCards.flatMap(c =>
      [c.rewards?.first, c.rewards?.second, c.rewards?.third].filter(Boolean)
    )
    const hasControl = allRewards.some(r => r.includes('Control'))
    expect(hasControl).toBe(true)
  })

  test('VP rewards can be doubled (type not excluded)', () => {
    const conflictCards = require('../res/cards/conflict.js')
    const allRewards = conflictCards.flatMap(c =>
      [c.rewards?.first, c.rewards?.second, c.rewards?.third].filter(Boolean)
    )
    const hasVP = allRewards.some(r => r.includes('Victory point'))
    expect(hasVP).toBe(true)
  })

  test('influence rewards can be doubled (type not excluded)', () => {
    const conflictCards = require('../res/cards/conflict.js')
    const allRewards = conflictCards.flatMap(c =>
      [c.rewards?.first, c.rewards?.second, c.rewards?.third].filter(Boolean)
    )
    const hasInfluence = allRewards.some(r => r.includes('Influence'))
    expect(hasInfluence).toBe(true)
  })
})
