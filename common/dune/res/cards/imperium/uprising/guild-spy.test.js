'use strict'

const t = require('../../../../testutil')
const card = require('./guild-spy.js')

describe('guild-spy', () => {
  test('data', () => {
    expect(card.id).toBe('guild-spy')
    expect(card.name).toBe('Guild Spy')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.acquisitionBonus).toBe('+1 Spy')
    expect(card.spyAccess).toBe(true)
    expect(card.factionAffiliation).toBeNull()
  })

  test('agent ability: discard a non-Guild card → draw 1 card (no intrigue)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Guild Spy is a spy-access card; place a spy on a post first.
      spyPosts: { D: ['dennis'] },
      dennis: {
        handExact: ['Guild Spy', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'],
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Guild Spy')
    // Only Imperial Basin is reachable; auto-selected. Decline Gather Intelligence.
    let choices = t.currentChoices(game)
    if (choices.some(c => /recall Spy/.test(c))) {
      t.choose(game, 'No')
      choices = t.currentChoices(game)
    }
    while (choices.includes('Guild Spy') && choices.includes('Imperial Basin')) {
      t.choose(game, 'Guild Spy')
      choices = t.currentChoices(game)
    }
    // Discard a non-Guild card.
    expect(choices).toContain('Dagger')
    t.choose(game, 'Dagger')
    choices = t.currentChoices(game)
    const deployZero = choices.find(c => /Deploy 0 troop/.test(c))
    if (deployZero) {
      t.choose(game, deployZero)
    }

    // Hand: 5 - 1 (played) - 1 (discard) + 1 (draw) = 4. No intrigue gained.
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(4)
    const intrigueCount = game.zones.byId('dennis.intrigue').cardlist().length
    expect(intrigueCount).toBe(0)
  })

  test('agent ability: discard a Guild card → draw 1 + gain 1 Intrigue', () => {
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { D: ['dennis'] },
      dennis: {
        handExact: ['Guild Spy', 'Cargo Runner', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'],
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Guild Spy')
    let choices = t.currentChoices(game)
    if (choices.some(c => /recall Spy/.test(c))) {
      t.choose(game, 'No')
      choices = t.currentChoices(game)
    }
    while (choices.includes('Guild Spy') && choices.includes('Imperial Basin')) {
      t.choose(game, 'Guild Spy')
      choices = t.currentChoices(game)
    }
    expect(choices).toContain('Cargo Runner')
    t.choose(game, 'Cargo Runner')
    choices = t.currentChoices(game)
    const deployZero = choices.find(c => /Deploy 0 troop/.test(c))
    if (deployZero) {
      t.choose(game, deployZero)
    }

    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(1)
  })

  test('reveal: contributes 2 persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Guild Spy'] },
    })
    game.run()

    // Guild Spy is spy-access only; with no spy on the board it has no
    // valid placement, so Agent Turn is suppressed and Reveal Turn auto-
    // selects.

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
  })

  test('onAcquire: gains a spy placement choice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Need 9 persuasion to acquire Guild Spy is not in row by default; put
      // it in the imperium row by ID-targeted handExact-style placement is
      // not supported, but we can verify via spies counter increment when
      // acquired. Simplest: simulate acquire by dropping it in the row at
      // top by using a deliberate hand that gives enough persuasion to buy
      // anything Guild Spy-equivalent. For a focused onAcquire test we
      // instead reach into the imperium deck via a custom breakpoint.
      dennis: {
        handExact: ['Convincing Argument', 'Convincing Argument', 'Diplomacy', 'Reconnaissance', 'Dune, The Desert Planet'],
      },
    })
    // Place Guild Spy in the imperium row (after row is refilled).
    game.testSetBreakpoint('after-round-start', (game) => {
      const row = game.zones.byId('common.imperiumRow')
      const deck = game.zones.byId('common.imperiumDeck')
      const spy = deck.cardlist().find(c => c.name === 'Guild Spy')
        || row.cardlist().find(c => c.name === 'Guild Spy')
      if (spy && spy.zone !== row) {
        spy.moveTo(row)
      }
    })
    game.run()

    // Reveal: 2+2+2+1+1 = 8 persuasion (but wait — Guild Spy costs 3).
    t.choose(game, 'Reveal Turn')
    let choices = t.currentChoices(game)
    expect(choices).toContain('Guild Spy')
    t.choose(game, 'Guild Spy')
    // onAcquire fires the spy-placement flow.
    choices = t.currentChoices(game)
    while (!choices.some(c => /^Post /.test(c))) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }
    const postChoice = choices.find(c => /^Post /.test(c))
    t.choose(game, postChoice)

    // The acquired spy should now be on a post.
    const totalSpiesPosted = Object.values(game.state.spyPosts)
      .flat()
      .filter(name => name === 'dennis').length
    expect(totalSpiesPosted).toBeGreaterThanOrEqual(1)
  })

  test('reveal+acquire: TSMF acquisition grants influence per faction spied on', () => {
    // Dennis has spies on posts J (Emperor), L (BG), M (Fremen). Hand reveals
    // 9 persuasion (enough to buy The Spice Must Flow at cost 9). The Guild
    // Spy reveal sets the TSMF flag; on acquiring TSMF, dennis gets +1
    // influence with each unique faction his spies are connected to.
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { J: ['dennis'], L: ['dennis'], M: ['dennis'] },
      dennis: {
        handExact: ['Guild Spy', 'Convincing Argument', 'Convincing Argument', 'Diplomacy', 'Reconnaissance', 'Dune, The Desert Planet', 'Dune, The Desert Planet'],
        spiesInSupply: 0,
        influence: { emperor: 0, 'bene-gesserit': 0, fremen: 0, guild: 0 },
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    const choices = t.currentChoices(game)
    expect(choices).toContain('The Spice Must Flow')
    t.choose(game, 'The Spice Must Flow')

    const dennis = game.players.byName('dennis')
    // +1 each: Emperor (J → sardaukar/dutiful-service), BG (L → espionage/secrets), Fremen (M → desert-tactics/fremkit).
    expect(dennis.getInfluence('emperor')).toBe(1)
    expect(dennis.getInfluence('bene-gesserit')).toBe(1)
    expect(dennis.getInfluence('fremen')).toBe(1)
    // Guild post K not occupied → no Guild influence.
    expect(dennis.getInfluence('guild')).toBe(0)
    // VP from TSMF acquisition.
    expect(dennis.getCounter('vp')).toBeGreaterThanOrEqual(1)
  })

  test('reveal+acquire: no TSMF acquisition → no faction influence granted', () => {
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { J: ['dennis'], L: ['dennis'], M: ['dennis'] },
      dennis: {
        handExact: ['Guild Spy'],
        spiesInSupply: 0,
        influence: { emperor: 0, 'bene-gesserit': 0, fremen: 0 },
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    // Only 2 persuasion — can't buy anything, just pass.
    const choices = t.currentChoices(game)
    if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('emperor')).toBe(0)
    expect(dennis.getInfluence('bene-gesserit')).toBe(0)
    expect(dennis.getInfluence('fremen')).toBe(0)
  })
})
