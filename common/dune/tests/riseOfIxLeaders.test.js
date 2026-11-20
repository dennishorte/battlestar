const t = require('../testutil')

const armand = require('../res/leaders/ArchdukeArmandEcaz')
const ilesa = require('../res/leaders/IlesaEcaz')
const tessia = require('../res/leaders/TessiaVernius')
const hundro = require('../res/leaders/ViscountHundroMoritani')
const rhombur = require('../res/leaders/PrinceRhomburVernius')
const yuna = require('../res/leaders/PrincessYunaMoritani')

function dennis(game) {
  return game.players.byName('dennis')
}

function surfaceTile(game, defId) {
  game.testSetBreakpoint('initialization-complete', (g) => {
    for (const stack of g.state.techStacks) {
      const index = stack.findIndex(tile => tile.definition.defId === defId)
      if (index >= 0) {
        const [tile] = stack.splice(index, 1)
        stack.unshift(tile)
      }
    }
  })
}

function waitingTitle(game) {
  return game.waiting.selectors[0].title
}

function untilDennis(game) {
  for (let guard = 0; guard < 40; guard++) {
    const selector = game.waiting && game.waiting.selectors[0]
    if (selector && selector.actor === 'dennis' && selector.title === 'Choose Turn') {
      return
    }
    const choices = t.currentChoices(game)
    if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else if (choices.includes('Decline')) {
      t.choose(game, 'Decline')
    }
    else if (choices.includes('Do not discard')) {
      t.choose(game, 'Do not discard')
    }
    else {
      t.choose(game, choices[0])
    }
  }
  throw new Error(`never returned to dennis (${waitingTitle(game)})`)
}

describe('Rise of Ix leaders', () => {
  test('Armand trashes a card in play only with two agents on colored spaces', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: armand },
      dennis: {
        handExact: ['Dagger'],
        played: ['Diplomacy'],
      },
      boardSpaces: {
        'high-council': ['dennis'],
        arrakeen: ['dennis'],
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Diplomacy')

    expect(game.zones.byId('common.trash').cardlist().some(card => card.name === 'Diplomacy')).toBe(true)
  })

  test('Armand does not offer the trash with only one colored agent', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: armand },
      dennis: {
        handExact: ['Dagger'],
        played: ['Diplomacy'],
      },
      boardSpaces: { 'high-council': ['dennis'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    expect(waitingTitle(game)).not.toMatch(/Coordination/)
    expect(game.zones.byId('common.trash').cardlist().some(card => card.name === 'Diplomacy')).toBe(false)
  })

  test('Conscript acquires a card that costs 3 or less without paying', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: armand },
      dennis: { handExact: ['Signet Ring'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Tech Negotiation')
    t.choose(game, 'Signet Ring')
    t.choose(game, 'Prepare the Way')

    expect(game.zones.byId('dennis.discard').cardlist().some(card => card.name === 'Prepare the Way')).toBe(true)
    expect(dennis(game).getCounter('persuasion')).toBe(1)
  })

  test('Ilesa reveals a set-aside card with her first turn when that turn is a reveal', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: ilesa },
      dennis: { handExact: ['Dagger', 'Diplomacy'] },
    })
    game.run()

    expect(waitingTitle(game)).toBe('One Step Ahead: set aside a card')
    t.choose(game, 'Dagger')
    t.choose(game, 'Reveal Turn')

    expect(game.zones.byId('dennis.setAside').cardlist()).toHaveLength(0)
    expect(game.zones.byId('dennis.discard').cardlist().some(card => card.name === 'Dagger')).toBe(true)
    expect(dennis(game).spice).toBe(0)
    expect(dennis(game).solari).toBe(0)
  })

  test('Ilesa gains spice when the set-aside card has one agent icon', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: ilesa },
      dennis: { handExact: ['Dagger', 'Diplomacy'] },
    })
    game.run()

    t.choose(game, 'Dagger')
    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Deliver Supplies')
    untilDennis(game)
    t.choose(game, 'Agent Turn.Dagger')

    expect(dennis(game).spice).toBe(1)
  })

  test('Ilesa gains solari when the set-aside card has no agent icon', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: ilesa },
      dennis: { handExact: ['Dagger', 'Diplomacy'] },
    })
    game.run()

    t.choose(game, 'Diplomacy')
    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Place a Negotiator')
    untilDennis(game)
    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Deliver Supplies')

    expect(dennis(game).solari).toBe(1)
    expect(dennis(game).spice).toBe(0)
    expect(dennis(game).water).toBe(2)
  })

  test('Guild Contacts buys a Foldspace', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: ilesa },
      dennis: { handExact: ['Signet Ring', 'Dagger'], solari: 1 },
    })
    game.run()

    t.choose(game, 'Dagger')
    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Tech Negotiation')
    t.choose(game, 'Signet Ring')
    t.choose(game, 'Pay 1 Solari')

    expect(dennis(game).solari).toBe(0)
    expect(game.zones.byId('dennis.discard').cardlist().some(card => card.name === 'Foldspace')).toBe(true)
    expect(game.zones.byId('common.reserve.foldspace').cardlist()).toHaveLength(5)
  })

  test('Tessia takes the spice reward when she crosses 2 influence, and not when she goes from 2 to 3', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: tessia },
      dennis: {
        handExact: ['Treachery', 'Dagger'],
        influence: { emperor: 1 },
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Treachery')
    t.choose(game, 'Dutiful Service')
    t.choose(game, 'Dagger')

    expect(dennis(game).spice).toBe(1)
    expect(dennis(game).getInfluence('emperor')).toBe(2)

    t.choose(game, 'Treachery')

    expect(dennis(game).getInfluence('emperor')).toBe(3)
    expect(dennis(game).spice).toBe(1)
    expect(waitingTitle(game)).toBe('Choose a Contract to take')
  })

  test('Tessia pays the faction bonus without an alliance when the next reward is the track bonus', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: tessia },
      dennis: {
        handExact: ['Treachery', 'Dagger'],
        influence: { fremen: 1 },
      },
    })
    game.testSetBreakpoint('turn-ready', (g) => {
      if (g.state.round === 1 && g.state.currentTurnPlayer === 'dennis' && !g.state.tessiaRewards) {
        g.state.tessiaRewards = { dennis: 1 }
      }
    })
    game.run()

    t.choose(game, 'Agent Turn.Treachery')
    t.choose(game, 'Fremkit')

    expect(dennis(game).water).toBe(2)
    expect(dennis(game).vp).toBe(1)
    expect(dennis(game).getInfluence('fremen')).toBe(2)
    expect(waitingTitle(game)).toBe('Which effect to resolve first?')
  })

  test('Tessia\'s last reward pays the track bonus and one more influence, not an alliance', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: tessia },
      dennis: {
        handExact: ['Treachery', 'Dagger'],
        influence: { fremen: 1 },
      },
    })
    game.testSetBreakpoint('turn-ready', (g) => {
      if (g.state.round === 1 && g.state.currentTurnPlayer === 'dennis' && !g.state.tessiaRewards) {
        g.state.tessiaRewards = { dennis: 3 }
      }
    })
    game.run()

    t.choose(game, 'Agent Turn.Treachery')
    t.choose(game, 'Fremkit')

    expect(dennis(game).water).toBe(2)
    expect(dennis(game).getInfluence('fremen')).toBe(3)
    expect(dennis(game).vp).toBe(1)
    expect(game.state.alliances.fremen).toBeFalsy()
  })

  test('going from 2 to 3 influence does not take a Tessia reward', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: tessia },
      dennis: {
        handExact: ['Diplomacy'],
        influence: { emperor: 2 },
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Dutiful Service')

    expect(dennis(game).spice).toBe(0)
    expect(dennis(game).getInfluence('emperor')).toBe(3)
    expect(waitingTitle(game)).toBe('Choose a Contract to take')
  })

  test('Duplicity moves influence onto a faction where Tessia has a snooper', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: tessia },
      dennis: {
        handExact: ['Signet Ring'],
        influence: { emperor: 1 },
      },
      spyPosts: { M: ['dennis'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Tech Negotiation')
    t.choose(game, 'Signet Ring')

    expect(dennis(game).getInfluence('emperor')).toBe(0)
    expect(dennis(game).getInfluence('fremen')).toBe(1)
  })

  test('Hundro keeps one of the top two intrigue cards at game start', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { leaders: { dennis: hundro } })
    game.run()

    expect(waitingTitle(game)).toBe('Intelligence: keep one Intrigue card')
    const [kept, other] = game.waiting.selectors[0].choices
    t.choose(game, { id: kept.id })

    const intrigueIds = game.zones.byId('dennis.intrigue').cardlist().map(card => card.id)
    const deckIds = game.zones.byId('common.intrigueDeck').cardlist().map(card => card.id)
    expect(intrigueIds).toEqual([kept.id])
    expect(deckIds).toContain(other.id)
    expect(intrigueIds).not.toContain(other.id)
  })

  test('Hundro looks at intrigue after every player has drawn one in Epic mode', () => {
    const game = t.fixture({ useRiseOfIx: true, useEpic: true })
    t.setBoard(game, { leaders: { dennis: hundro } })
    game.run()

    expect(game.zones.byId('micah.intrigue').cardlist()).toHaveLength(1)
    expect(game.zones.byId('scott.intrigue').cardlist()).toHaveLength(1)
    expect(game.zones.byId('dennis.intrigue').cardlist()).toHaveLength(1)
    expect(waitingTitle(game)).toBe('Intelligence: keep one Intrigue card')

    const [kept, other] = game.waiting.selectors[0].choices
    t.choose(game, { id: kept.id })

    const intrigueIds = game.zones.byId('dennis.intrigue').cardlist().map(card => card.id)
    expect(intrigueIds).toHaveLength(2)
    expect(intrigueIds).toContain(kept.id)
    expect(game.zones.byId('common.intrigueDeck').cardlist().map(card => card.id)).toContain(other.id)
  })

  test('Couriers spends a spice to move the freighter', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: hundro },
      dennis: { handExact: ['Signet Ring'], spice: 1 },
    })
    game.run()

    const [kept] = game.waiting.selectors[0].choices
    t.choose(game, { id: kept.id })
    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Tech Negotiation')
    t.choose(game, 'Signet Ring')
    t.choose(game, 'Pay 1 Spice')
    t.choose(game, 'Advance')

    expect(dennis(game).spice).toBe(0)
    expect(dennis(game).freighterPosition).toBe(1)
  })

  test('Rhombur can acquire a tech tile from his signet ring', () => {
    const game = t.fixture({ useRiseOfIx: true })
    surfaceTile(game, 'windtraps')
    t.setBoard(game, {
      leaders: { dennis: rhombur },
      dennis: { handExact: ['Signet Ring'], spice: 2 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Tech Negotiation')
    t.choose(game, 'Signet Ring')
    t.choose(game, 'Acquire Tech')
    t.choose(game, 'Windtraps for 2 Spice')

    expect(dennis(game).spice).toBe(0)
    expect(game.state.ownedTech.dennis.some(tile => tile.definition.defId === 'windtraps')).toBe(true)
  })

  test('Rhombur places a Negotiator from his signet ring without a tech discount', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: rhombur },
      dennis: { handExact: ['Signet Ring'] },
    })
    game.run()

    const supplyBefore = dennis(game).troopsInSupply
    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Smuggling')
    t.choose(game, 'Signet Ring')
    t.choose(game, 'Place a Negotiator')

    expect(dennis(game).negotiators).toBe(1)
    expect(dennis(game).troopsInSupply).toBe(supplyBefore - 1)
    expect(waitingTitle(game)).not.toBe('Tech Negotiation')
    expect(t.currentChoices(game)).not.toContain('Acquire Tech at a 1 spice discount')
  })

  test('Yuna gains an extra Solari on her turn, including a control bonus, and starts without water', () => {
    const game = t.fixture({ useRiseOfIx: true })
    game.testSetBreakpoint('initialization-complete', (g) => {
      const deck = g.zones.byId('common.conflictDeck')
      const card = deck.cardlist().find(candidate => candidate.definition.id === 'conflict-skirmish-desert-mouse')
      if (card) {
        card.moveToTop(deck)
      }
    })
    t.setBoard(game, {
      leaders: { dennis: yuna },
      dennis: { handExact: ['Reconnaissance'] },
      controlMarkers: { arrakeen: 'dennis' },
    })
    game.run()

    expect(dennis(game).water).toBe(0)
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')

    expect(dennis(game).solari).toBe(2)
  })

  test('Yuna gains an extra Solari from Smuggling on her turn', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      leaders: { dennis: yuna },
      dennis: { handExact: ['Dune, The Desert Planet'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Smuggling')
    t.choose(game, 'Advance')

    expect(dennis(game).solari).toBe(2)
    expect(dennis(game).water).toBe(0)
  })
})
