'use strict'

const t = require('../../../testutil.js')
const card = require('./distraction.js')

describe("distraction", () => {
  test('data', () => {
    expect(card.id).toBe("distraction")
    expect(card.name).toBe("Distraction")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.count).toBe(2)
    expect(card.hasSpies).toBe(true)
  })

  test('plot: card is offered and plays without error (smoke)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Distraction'] },
    })
    game.run()

    expect(t.currentChoices(game)).toContain('Distraction')
    t.choose(game, 'Distraction')

    const discard = game.zones.byId('common.intrigueDiscard').cardlist()
    expect(discard.some(c => c.name === 'Distraction')).toBe(true)
  })

  test('plot: 3+ deploy in one turn places a Spy', () => {
    const game = t.fixture()
    t.setBoard(game, {
      shieldWall: false,
      dennis: {
        intrigue: ['Distraction', 'Detonation'],
        troopsInGarrison: 5,
        spiesInSupply: 1,
      },
    })
    game.run()

    t.choose(game, 'Distraction')
    t.choose(game, 'Detonation')
    t.choose(game, 'Deploy up to 4 Troops to Conflict')
    t.choose(game, 'Deploy 3')

    const postChoice = t.currentChoices(game).find(c => c.startsWith('Post '))
    expect(postChoice).toBeDefined()
    t.choose(game, postChoice)

    const dennis = game.players.byName('dennis')
    expect(dennis.spiesInSupply).toBe(0)
    const placedSomewhere = Object.values(game.state.spyPosts).some(occ => occ.includes('dennis'))
    expect(placedSomewhere).toBe(true)
  })

  test('plot: <3 deploy does not trigger Spy placement', () => {
    const game = t.fixture()
    t.setBoard(game, {
      shieldWall: false,
      dennis: {
        intrigue: ['Distraction', 'Detonation'],
        troopsInGarrison: 5,
        spiesInSupply: 1,
      },
    })
    game.run()

    t.choose(game, 'Distraction')
    t.choose(game, 'Detonation')
    t.choose(game, 'Deploy up to 4 Troops to Conflict')
    t.choose(game, 'Deploy 2')

    expect(t.currentChoices(game).some(c => c.startsWith('Post '))).toBe(false)
    expect(game.players.byName('dennis').spiesInSupply).toBe(1)
  })

  test('plot: Spy may co-locate with another player\'s Spy', () => {
    const game = t.fixture()
    t.setBoard(game, {
      shieldWall: false,
      spyPosts: { A: ['micah'] },
      dennis: {
        intrigue: ['Distraction', 'Detonation'],
        troopsInGarrison: 5,
        spiesInSupply: 1,
      },
    })
    game.run()

    t.choose(game, 'Distraction')
    t.choose(game, 'Detonation')
    t.choose(game, 'Deploy up to 4 Troops to Conflict')
    t.choose(game, 'Deploy 3')

    const occupiedPostAChoice = t.currentChoices(game).find(c => c.startsWith('Post A '))
    expect(occupiedPostAChoice).toBeDefined()
    t.choose(game, occupiedPostAChoice)

    expect(game.state.spyPosts.A).toEqual(expect.arrayContaining(['micah', 'dennis']))
  })
})
