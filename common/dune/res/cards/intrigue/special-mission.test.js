'use strict'

const t = require('../../../testutil.js')
const card = require('./special-mission.js')
const observationPosts = require('../../observationPosts.js')
const boardSpaces = require('../../boardSpaces.js')

const PURPLE_POSTS = observationPosts.filter(p =>
  p.spaces.some(id => boardSpaces.find(s => s.id === id)?.icon === 'purple')
).map(p => p.id)

describe("special-mission", () => {
  test('data', () => {
    expect(card.id).toBe("special-mission")
    expect(card.name).toBe("Special Mission")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.hasSpies).toBe(true)
    expect(card.hasSandworms).toBe(true)
  })

  test('plot Place: spy can only land on a Purple-connected post', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Special Mission'], spiesInSupply: 5 },
    })
    game.run()

    t.choose(game, 'Special Mission')
    t.choose(game, 'Place 1 Spy')

    const choices = t.currentChoices(game)
    // Each post option starts with "Post X" — extract the X
    const offered = choices.map(c => c.match(/^Post ([A-M])/)?.[1]).filter(Boolean)
    expect(offered.sort()).toEqual([...PURPLE_POSTS].sort())

    // Place on a known purple post
    const targetChoice = choices.find(c => c.startsWith('Post A'))
    t.choose(game, targetChoice)

    expect(game.state.spyPosts['A']).toContain('dennis')
    expect(game.players.byName('dennis').spiesInSupply).toBe(4)
  })

  test('plot Recall: blows shield wall and gains 2 spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Special Mission'], spice: 0 },
      spyPosts: { D: ['dennis'] },
      shieldWall: true,
    })
    game.run()

    t.choose(game, 'Special Mission')
    t.choose(game, 'Recall Spy -> Blow Shield Wall + 2 Spice')
    // recallSpy auto-resolves with only one spy

    expect(game.state.shieldWall).toBe(false)
    expect(game.players.byName('dennis').spice).toBe(2)
    expect(game.state.spyPosts['D'] || []).not.toContain('dennis')
  })

  test('plot Recall: option not offered when player has no spy on the board', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Special Mission'] },
      shieldWall: true,
    })
    game.run()

    t.choose(game, 'Special Mission')
    expect(t.currentChoices(game)).not.toContain('Recall Spy -> Blow Shield Wall + 2 Spice')
  })
})
