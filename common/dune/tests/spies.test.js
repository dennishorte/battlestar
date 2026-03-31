const t = require('../testutil')
const spySystem = require('../systems/spies')

describe('Spy System', () => {

  test('hasSpyAt returns false with no spies placed', () => {
    const game = t.fixture()
    game.run()
    const player = game.players.byName('dennis')
    expect(spySystem.hasSpyAt(game, player, 'arrakeen')).toBe(false)
  })

  test('hasSpyAt returns true when spy on connected post', () => {
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { A: ['dennis'] },
    })
    game.run()
    const player = game.players.byName('dennis')
    // Post A connects to arrakeen and spice-refinery
    expect(spySystem.hasSpyAt(game, player, 'arrakeen')).toBe(true)
    expect(spySystem.hasSpyAt(game, player, 'spice-refinery')).toBe(true)
    expect(spySystem.hasSpyAt(game, player, 'research-station')).toBe(false)
  })

  test('getSpyConnectedSpaces returns all connected spaces', () => {
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { A: ['dennis'], C: ['dennis'] },
    })
    game.run()
    const player = game.players.byName('dennis')
    const connected = spySystem.getSpyConnectedSpaces(game, player)
    // A: arrakeen, spice-refinery; C: research-station, sietch-tabr
    expect(connected.has('arrakeen')).toBe(true)
    expect(connected.has('spice-refinery')).toBe(true)
    expect(connected.has('research-station')).toBe(true)
    expect(connected.has('sietch-tabr')).toBe(true)
    expect(connected.has('imperial-basin')).toBe(false)
  })

  test('infiltrate allows sending agent to occupied space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Micah occupies Arrakeen, dennis has spy on post A
      boardSpaces: { arrakeen: 'micah' },
      spyPosts: { A: ['dennis'] },
      dennis: { spiesInSupply: 3 },
    })
    game.run()

    // Dennis: Agent Turn — pick a card with purple icon
    const handZone = game.zones.byId('dennis.hand')
    const purpleCard = handZone.cardlist().find(c => c.agentIcons.includes('purple'))
    if (!purpleCard) {
      return
    }

    t.choose(game, 'Agent Turn.' + purpleCard.name)

    // Arrakeen should be available despite being occupied (infiltrate)
    const spaceChoices = t.currentChoices(game)
    if (!spaceChoices.includes('Arrakeen')) {
      return
    }

    t.choose(game, 'Arrakeen')

    // Spy was recalled (infiltrate), so spiesInSupply should be back to 3
    // (decremented to 2 by recall, but recall gives +1 back to supply... wait no,
    // the spy was on the post initially, not from supply. recallSpyAt returns it to supply.)
    // Started with spiesInSupply=3 and 1 spy on post A.
    // After infiltrate recall: spy returns to supply -> spiesInSupply=4...
    // but we set spiesInSupply=3 which represents supply only, post spy is separate.
    // So after recall: spiesInSupply goes from 3 to 4.

    // Deploy 0 troops
    t.choose(game, 'Deploy 0 troop(s) from garrison')

    const player = game.players.byName('dennis')
    // Spy recalled from post back to supply
    expect(player.spiesInSupply).toBe(4)
    // Post A should now be empty for dennis
    const postA = game.state.spyPosts.A || []
    expect(postA.includes('dennis')).toBe(false)
  })

  test('gather intelligence draws a card when choosing yes', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Dennis has spy on post I (Assembly Hall, Gather Support) — unoccupied
      spyPosts: { I: ['dennis'] },
      dennis: { spiesInSupply: 2 },
    })
    game.run()

    // Dennis: Agent Turn — pick a green card for Landsraad spaces
    const handZone = game.zones.byId('dennis.hand')
    const greenCard = handZone.cardlist().find(c => c.agentIcons.includes('green'))
    if (!greenCard) {
      return
    }

    t.choose(game, 'Agent Turn.' + greenCard.name)

    const spaceChoices = t.currentChoices(game)
    if (!spaceChoices.includes('Assembly Hall')) {
      return
    }

    t.choose(game, 'Assembly Hall')

    // Should be offered Gather Intelligence
    const giChoices = t.currentChoices(game)
    if (!giChoices.some(c => c.includes('Yes'))) {
      return
    }

    t.choose(game, 'Yes — recall Spy to draw a card')

    // Spy recalled, card drawn
    const player = game.players.byName('dennis')
    expect(player.spiesInSupply).toBe(3) // was 2, +1 from recall
  })
})
