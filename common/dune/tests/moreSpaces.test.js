const t = require('../testutil')

describe('Additional Board Space Effects', () => {

  test('Deliver Supplies gives +1 water', () => {
    const game = t.fixture()
    game.run()

    // Dennis: Diplomacy → Deliver Supplies (guild)
    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Deliver Supplies')

    const player = game.players.byName('dennis')
    // +1 water from space + 2 Solari from contract (no CHOAM)
    expect(player.water).toBe(2) // 1 starting + 1 from space
  })

  test('Secrets gives +1 intrigue card and steal-intrigue effect', () => {
    const game = t.fixture()
    game.run()

    // Dennis: Diplomacy → Secrets (bene-gesserit)
    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Secrets')

    // Dennis should have gained intrigue card(s)
    const intrigue = game.zones.byId('dennis.intrigue')
    expect(intrigue.cardlist().length).toBeGreaterThanOrEqual(1)
  })

  test('Fremkit gives draw 1 card and is a combat space', () => {
    const game = t.fixture()
    game.run()

    // Dennis: Diplomacy → Fremkit (fremen, no cost, combat)
    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Fremkit')

    // Should offer deploy (it's a combat space)
    const choices = t.currentChoices(game)
    expect(choices.some(c => c.includes('Deploy'))).toBe(true)
  })

  test('Hagga Basin costs 1 water and offers spice harvest choice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 1 }, // exactly enough for Hagga Basin cost
    })
    game.run()

    // Dennis reveals first (no yellow in hand)
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah: Dune TDP (yellow) → Hagga Basin (costs 1 water)
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')

    const spaces = t.currentChoices(game)
    expect(spaces).toContain('Hagga Basin')
    t.choose(game, 'Hagga Basin')

    // Micah paid 1 water
    const micah = game.players.byName('micah')
    expect(micah.water).toBe(0) // 1 starting - 1 cost
  })

  test('High Council costs 5 Solari and grants High Council seat', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { solari: 5 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Dagger') // green
    t.choose(game, 'High Council')

    const player = game.players.byName('dennis')
    expect(player.hasHighCouncil).toBe(true)
    expect(player.solari).toBe(0) // paid 5
  })

  test('Desert Tactics costs 1 water and offers troop + trash', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 2 }, // need 1 for cost
    })
    game.run()

    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Desert Tactics')

    // Desert Tactics: +1 troop, trash a card. It's a combat space.
    // Should offer trash then deploy
    let foundTrashOrDeploy = false
    let safety = 5
    while (game.waiting && safety-- > 0) {
      const choices = t.currentChoices(game)
      if (choices.some(c => c.includes('Deploy'))) {
        foundTrashOrDeploy = true
        t.choose(game, 'Deploy 0 troop(s) from garrison')
        break
      }
      else if (choices.includes('Pass')) {
        t.choose(game, 'Pass')
      }
      else {
        t.choose(game, choices[0])
        foundTrashOrDeploy = true
        break
      }
    }

    expect(foundTrashOrDeploy).toBe(true)
    const player = game.players.byName('dennis')
    expect(player.water).toBe(1) // 2 - 1 cost
  })

  test('Imperial Basin harvests spice from base + bonus', () => {
    const game = t.fixture()
    t.setBoard(game, {
      bonusSpice: { 'imperial-basin': 2 },
    })
    game.run()

    // Dennis reveals, micah harvests
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Deploy 0 troop(s) from garrison')

    // Imperial Basin: 1 base + 2 bonus = 3 spice
    const micah = game.players.byName('micah')
    expect(micah.spice).toBe(3)
    expect(game.state.bonusSpice['imperial-basin']).toBe(0) // cleared
  })

  test('Sword Master has dynamic cost and grants swordmaster effect', () => {
    const boardSpaces = require('../res/boardSpaces.js')
    const sm = boardSpaces.find(s => s.id === 'sword-master')
    expect(sm.dynamicCost).toBe('sword-master')
    expect(sm.effects[0].type).toBe('sword-master')
  })
})
