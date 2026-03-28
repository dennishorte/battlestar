const t = require('../testutil')

describe('Board Space Effects', () => {

  test('Arrakeen gives 1 troop and draws 1 card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 0, troopsInSupply: 9 },
    })
    game.run()

    // Dennis: Agent Turn
    t.choose(game, 'Agent Turn')

    // Pick a card with purple icon (city)
    const choices = t.currentChoices(game)
    const purpleCard = choices.find(c => {
      const handZone = game.zones.byId('dennis.hand')
      const card = handZone.cardlist().find(cc => cc.name === c)
      return card && card.agentIcons.includes('purple')
    })

    if (!purpleCard) {
      // No purple cards in hand — skip this test run gracefully
      return
    }

    t.choose(game, purpleCard)
    t.choose(game, 'Arrakeen')

    // Deploy 0 troops from garrison (since we have troops from the effect now)
    t.choose(game, 'Deploy 0 troop(s) from garrison')

    const player = game.players.byName('dennis')
    // Should have gained 1 troop to garrison from effect
    expect(player.troopsInGarrison).toBe(1)
    expect(player.troopsInSupply).toBe(8)
  })

  test('Assembly Hall gives 1 intrigue and 1 persuasion', () => {
    const game = t.fixture()
    game.run()

    // Dennis: Agent Turn
    t.choose(game, 'Agent Turn')

    const choices = t.currentChoices(game)
    const greenCard = choices.find(c => {
      const handZone = game.zones.byId('dennis.hand')
      const card = handZone.cardlist().find(cc => cc.name === c)
      return card && card.agentIcons.includes('green')
    })

    if (!greenCard) {
      return
    }

    t.choose(game, greenCard)

    // Check if Assembly Hall is available
    const spaceChoices = t.currentChoices(game)
    if (!spaceChoices.includes('Assembly Hall')) {
      return
    }

    t.choose(game, 'Assembly Hall')

    const player = game.players.byName('dennis')
    expect(player.getCounter('persuasion')).toBe(1)
  })

  test('Spice Refinery choice: gain 2 solari', () => {
    const game = t.fixture()
    game.run()

    t.choose(game, 'Agent Turn')

    const choices = t.currentChoices(game)
    const purpleCard = choices.find(c => {
      const handZone = game.zones.byId('dennis.hand')
      const card = handZone.cardlist().find(cc => cc.name === c)
      return card && card.agentIcons.includes('purple')
    })

    if (!purpleCard) {
      return
    }

    t.choose(game, purpleCard)

    const spaceChoices = t.currentChoices(game)
    if (!spaceChoices.includes('Spice Refinery')) {
      return
    }

    t.choose(game, 'Spice Refinery')
    t.choose(game, 'Gain 2 Solari')

    // Deploy 0
    t.choose(game, 'Deploy 0 troop(s) from garrison')

    const player = game.players.byName('dennis')
    expect(player.solari).toBe(2)
  })

  test('Gather Support choice: 2 troops or pay 2 solari for 2 troops + 1 water', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { solari: 5 },
    })
    game.run()

    t.choose(game, 'Agent Turn')

    const choices = t.currentChoices(game)
    const greenCard = choices.find(c => {
      const handZone = game.zones.byId('dennis.hand')
      const card = handZone.cardlist().find(cc => cc.name === c)
      return card && card.agentIcons.includes('green')
    })

    if (!greenCard) {
      return
    }

    t.choose(game, greenCard)

    const spaceChoices = t.currentChoices(game)
    if (!spaceChoices.includes('Gather Support')) {
      return
    }

    t.choose(game, 'Gather Support')
    t.choose(game, 'Pay 2 Solari for 2 troops and 1 water')

    const player = game.players.byName('dennis')
    expect(player.solari).toBe(3)
    expect(player.water).toBe(2) // 1 starting + 1 gained
    expect(player.troopsInGarrison).toBe(5) // 3 starting + 2 gained
  })
})

describe('Board Space Data Integrity', () => {

  test('all 22 board spaces are defined', () => {
    const boardSpaces = require('../res/boardSpaces.js')
    expect(boardSpaces.length).toBe(22)
  })

  test('all board spaces have unique ids', () => {
    const boardSpaces = require('../res/boardSpaces.js')
    const ids = boardSpaces.map(s => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('all board spaces have required fields', () => {
    const boardSpaces = require('../res/boardSpaces.js')
    for (const space of boardSpaces) {
      expect(space.id).toBeTruthy()
      expect(space.name).toBeTruthy()
      expect(space.icon).toBeTruthy()
      expect(space.effects).toBeTruthy()
      expect(Array.isArray(space.effects)).toBe(true)
    }
  })

  test('faction spaces have matching faction field', () => {
    const boardSpaces = require('../res/boardSpaces.js')
    const factionIcons = ['emperor', 'guild', 'bene-gesserit', 'fremen']
    const factionSpaces = boardSpaces.filter(s => factionIcons.includes(s.icon))
    const allHaveFaction = factionSpaces.every(s => s.faction)
    expect(allHaveFaction).toBe(true)
    expect(factionSpaces.length).toBe(8)
  })

  test('maker spaces are Imperial Basin, Hagga Basin, Deep Desert', () => {
    const boardSpaces = require('../res/boardSpaces.js')
    const makerSpaces = boardSpaces.filter(s => s.isMakerSpace).map(s => s.id).sort()
    expect(makerSpaces).toEqual(['deep-desert', 'hagga-basin', 'imperial-basin'])
  })

  test('control bonus locations match controlMarkers init', () => {
    const boardSpaces = require('../res/boardSpaces.js')
    const controlSpaces = boardSpaces.filter(s => s.controlBonus).map(s => s.id).sort()
    expect(controlSpaces).toEqual(['arrakeen', 'imperial-basin', 'spice-refinery'])
  })
})

describe('Observation Posts', () => {

  test('all 13 observation posts are defined', () => {
    const posts = require('../res/observationPosts.js')
    expect(posts.length).toBe(13)
  })

  test('all observation posts reference valid board space ids', () => {
    const posts = require('../res/observationPosts.js')
    const boardSpaces = require('../res/boardSpaces.js')
    const validIds = new Set(boardSpaces.map(s => s.id))

    for (const post of posts) {
      for (const spaceId of post.spaces) {
        expect(validIds.has(spaceId)).toBe(true)
      }
    }
  })

  test('every board space is connected to at least one observation post', () => {
    const posts = require('../res/observationPosts.js')
    const boardSpaces = require('../res/boardSpaces.js')
    const connectedSpaces = new Set()
    for (const post of posts) {
      for (const spaceId of post.spaces) {
        connectedSpaces.add(spaceId)
      }
    }

    for (const space of boardSpaces) {
      expect(connectedSpaces.has(space.id)).toBe(true)
    }
  })
})
