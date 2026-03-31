const t = require('../testutil')

// Helper: finish remaining prompts until next round
function finishUntilNextRound(game) {
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
}

describe('Combat Advanced', () => {

  test('winner takes conflict card into supply', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    finishUntilNextRound(game)

    // Dennis won — should have the conflict card tracked
    const wonCards = game.state.conflict.wonCards?.dennis || []
    expect(wonCards.length).toBe(1)
    expect(wonCards[0].name).toBe('Skirmish')
  })

  test('combat intrigue phase works with multiple combatants', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3, intrigue: ['Ambush'] },
      micah: { troopsInGarrison: 2 },
    })
    game.run()

    // Dennis deploys
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Micah deploys
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Deploy 1 troop(s) from garrison')

    // Both reveal + combat intrigue round — finishUntilNextRound handles it
    finishUntilNextRound(game)

    expect(game.state.round).toBe(2)
  })

  test('conflict deck size is 10 (1+5+4)', () => {
    const constants = require('../res/constants.js')
    expect(constants.CONFLICT_DECK_SIZE).toBe(10)
    expect(constants.CONFLICT_I_COUNT).toBe(1)
    expect(constants.CONFLICT_II_COUNT).toBe(5)
    expect(constants.CONFLICT_III_COUNT).toBe(4)
  })
})
