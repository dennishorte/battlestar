'use strict'

const t = require('../../../testutil.js')
const card = require('./go-to-ground.js')

function driveToCombatIntrigue(game) {
  let safety = 80
  while (game.waiting && safety-- > 0) {
    const choices = t.currentChoices(game)
    const title = game.waiting.selectors[0]?.title || ''
    if (title === 'Play Combat Intrigue card or Pass' && choices.includes('Go to Ground')) {
      return
    }
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

describe("go-to-ground", () => {
  test('data', () => {
    expect(card.id).toBe("go-to-ground")
    expect(card.name).toBe("Go to Ground")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.hasSpies).toBe(true)
  })

  test('combat: retreat 1 troop -> +1 Spy', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 5,
        intrigue: ['Go to Ground'],
        spiesInSupply: 1,
      },
      conflict: {
        deployedTroops: { dennis: 3 },
      },
    })
    game.run()

    driveToCombatIntrigue(game)
    t.choose(game, 'Go to Ground')

    expect(t.currentChoices(game)).toEqual(expect.arrayContaining(['Retreat 1', 'Retreat 2', 'Pass']))
    t.choose(game, 'Retreat 1')

    // Assert at the spy-post prompt — combat resolution would zero
    // deployedTroops and return them to supply before our assertion.
    expect(game.waiting.selectors[0]?.title).toBe('Choose an observation post for your Spy')
    expect(game.state.conflict.deployedTroops.dennis).toBe(2)
    expect(game.players.byName('dennis').spiesInSupply).toBe(1)

    t.choose(game, t.currentChoices(game)[0])

    const occupants = Object.values(game.state.spyPosts).flat()
    expect(occupants.filter(n => n === 'dennis').length).toBe(1)
  })

  test('combat: retreat 2 troops -> +1 Spy (capped at 2 even if more deployed)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 5,
        intrigue: ['Go to Ground'],
        spiesInSupply: 1,
      },
      conflict: {
        deployedTroops: { dennis: 5 },
      },
    })
    game.run()

    driveToCombatIntrigue(game)
    t.choose(game, 'Go to Ground')

    const choices = t.currentChoices(game)
    expect(choices).toContain('Retreat 1')
    expect(choices).toContain('Retreat 2')
    expect(choices).not.toContain('Retreat 3')
    t.choose(game, 'Retreat 2')

    expect(game.waiting.selectors[0]?.title).toBe('Choose an observation post for your Spy')
    expect(game.state.conflict.deployedTroops.dennis).toBe(3)
    expect(game.players.byName('dennis').spiesInSupply).toBe(1)
  })

  test('combat: pass declines spy', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        troopsInGarrison: 5,
        intrigue: ['Go to Ground'],
        spiesInSupply: 1,
      },
      conflict: {
        deployedTroops: { dennis: 3 },
      },
    })
    game.run()

    driveToCombatIntrigue(game)
    t.choose(game, 'Go to Ground')
    t.choose(game, 'Pass')

    // Pass resumes combat — at this point the breakdown is intact at the
    // next combat-intrigue prompt or the player's still-deployed state is
    // visible. Just verify the spy was not consumed.
    expect(game.players.byName('dennis').spiesInSupply).toBe(1)
  })
})
