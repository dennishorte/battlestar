const t = require('../testutil')

function cardNames(zone) {
  return zone.cardlist().map(card => card.name)
}

function dennis(game) {
  return game.players.byName('dennis')
}

function title(game) {
  return game.waiting?.selectors[0]?.title || ''
}

function untilTitle(game, fragment) {
  let safety = 50
  while (game.waiting && safety-- > 0) {
    if (title(game).includes(fragment)) {
      return
    }
    const choices = t.currentChoices(game)
    const pick = ['Pass', 'Reveal Turn', 'Decline', 'Do not discard', 'Continue']
      .find(choice => choices.includes(choice))
    if (!pick) {
      throw new Error(`stuck on "${title(game)}": ${choices.join(' | ')}`)
    }
    t.choose(game, pick)
  }
  throw new Error(`never saw "${fragment}"`)
}

function finishRound(game, endgameCard) {
  const startRound = game.state.round
  let safety = 50
  while (game.waiting && !game.gameOver && game.state.round === startRound && safety-- > 0) {
    const choices = t.currentChoices(game)
    if (endgameCard && choices.includes(endgameCard)) {
      t.choose(game, endgameCard)
    }
    else if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else if (choices.includes('Decline')) {
      t.choose(game, 'Decline')
    }
    else {
      t.choose(game, choices[0])
    }
  }
}

function combatSetup(intrigue, extra = {}) {
  return {
    dennis: {
      agents: 0,
      handExact: [],
      intrigue: [intrigue],
      ...(extra.dennis || {}),
    },
    scott: { agents: 0, handExact: [] },
    micah: { agents: 0, handExact: [] },
    conflict: { deployedTroops: { dennis: 1 } },
    conflictCard: { id: 'conflict-skirmish-crysknife' },
  }
}

describe('Rise of Ix cards that still needed a played game', () => {
  test('Bounty Hunter pays 2 Solari for landing on an enemy Agent', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Bounty Hunter'] },
      boardSpaces: { arrakeen: ['scott'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Bounty Hunter')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Bounty Hunter')

    expect(dennis(game).solari).toBe(2)
    expect(game.state.boardSpaces.arrakeen).toEqual(['scott', 'dennis'])
  })

  test('Bounty Hunter pays nothing on an empty space', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Bounty Hunter'] } })
    game.run()

    t.choose(game, 'Agent Turn.Bounty Hunter')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Bounty Hunter')

    expect(dennis(game).solari).toBe(0)
  })

  test('CHOAM Delegate reveals for 3 Solari', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['CHOAM Delegate'] } })
    game.run()

    t.choose(game, 'Reveal Turn')

    expect(dennis(game).solari).toBe(3)
  })

  test('Court Intrigue puts an intrigue card on the bottom and draws another', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Court Intrigue'], intrigue: ['Blackmail'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Court Intrigue')
    t.choose(game, 'Court Intrigue')

    expect(cardNames(game.zones.byId('dennis.intrigue'))).not.toContain('Blackmail')
    expect(cardNames(game.zones.byId('dennis.intrigue'))).toHaveLength(1)
    const deck = cardNames(game.zones.byId('common.intrigueDeck'))
    expect(deck[deck.length - 1]).toBe('Blackmail')
  })

  test('Desert Ambush forces a deployed enemy troop to retreat', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Desert Ambush'] },
      conflict: { deployedTroops: { micah: 2 } },
    })
    game.run()

    t.choose(game, 'Agent Turn.Desert Ambush')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Desert Ambush')
    t.choose(game, 'Deploy 1 troop(s) from garrison')
    t.choose(game, 'micah')

    expect(game.state.conflict.deployedTroops.dennis).toBe(1)
    expect(game.state.conflict.deployedTroops.micah).toBe(1)
  })

  test('Esmar Tuek pays a spice for Bene Gesserit influence and a card', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Esmar Tuek', 'Dagger'], spice: 1 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Esmar Tuek')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Esmar Tuek')
    t.choose(game, 'Pay 1 Spice for +1 BG Influence and Draw 1 card')

    expect(dennis(game).spice).toBe(1)
    expect(dennis(game).getInfluence('bene-gesserit')).toBe(1)
    expect(cardNames(game.zones.byId('dennis.hand'))).toHaveLength(2)
  })

  test('passing Esmar Tuek spends nothing', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Esmar Tuek', 'Dagger'], spice: 1 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Esmar Tuek')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Esmar Tuek')
    t.choose(game, 'Pass')

    expect(dennis(game).spice).toBe(2)
    expect(dennis(game).getInfluence('bene-gesserit')).toBe(0)
    expect(cardNames(game.zones.byId('dennis.hand'))).toEqual(['Dagger'])
  })

  test('revealing Esmar Tuek gains spice and Solari', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Esmar Tuek'] } })
    game.run()

    t.choose(game, 'Reveal Turn')

    expect(dennis(game).spice).toBe(2)
    expect(dennis(game).solari).toBe(2)
  })

  test('Imperial Bashar can recruit or trash, and swords count other sword cards', () => {
    const recruit = t.fixture({ useRiseOfIx: true })
    t.setBoard(recruit, { dennis: { handExact: ['Imperial Bashar'] } })
    recruit.run()
    t.choose(recruit, 'Agent Turn.Imperial Bashar')
    t.choose(recruit, 'Arrakeen')
    t.choose(recruit, 'Imperial Bashar')
    t.choose(recruit, '+1 Troop')
    expect(dennis(recruit).troopsInGarrison).toBe(5)

    const trash = t.fixture({ useRiseOfIx: true })
    t.setBoard(trash, { dennis: { handExact: ['Imperial Bashar', 'Dagger'] } })
    trash.run()
    t.choose(trash, 'Agent Turn.Imperial Bashar')
    t.choose(trash, 'Arrakeen')
    t.choose(trash, 'Imperial Bashar')
    t.choose(trash, 'Trash a card')
    t.choose(trash, 'Dagger (Hand)')
    expect(cardNames(trash.zones.byId('common.trash'))).toContain('Dagger')
    expect(dennis(trash).troopsInGarrison).toBe(4)

    const revealed = t.fixture({ useRiseOfIx: true })
    t.setBoard(revealed, {
      dennis: { handExact: ['Imperial Bashar', 'Dagger'] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    revealed.run()
    t.choose(revealed, 'Reveal Turn')
    expect(dennis(revealed).strength).toBe(6)
  })

  test('Imperial Shock Trooper swords need an Agent on an Emperor space', () => {
    const present = t.fixture({ useRiseOfIx: true })
    t.setBoard(present, {
      dennis: { handExact: ['Imperial Shock Trooper'] },
      boardSpaces: { 'dutiful-service': ['dennis'] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    present.run()
    t.choose(present, 'Reveal Turn')
    expect(dennis(present).strength).toBe(7)

    const absent = t.fixture({ useRiseOfIx: true })
    t.setBoard(absent, {
      dennis: { handExact: ['Imperial Shock Trooper'] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    absent.run()
    t.choose(absent, 'Reveal Turn')
    expect(dennis(absent).strength).toBe(4)
  })

  test('In the Shadows discards for influence only at 2 Bene Gesserit', () => {
    const ready = t.fixture({ useRiseOfIx: true })
    t.setBoard(ready, {
      dennis: {
        handExact: ['In the Shadows', 'Dagger'],
        influence: { 'bene-gesserit': 2 },
      },
    })
    ready.run()
    t.choose(ready, 'Agent Turn.In the Shadows')
    t.choose(ready, 'Arrakeen')
    t.choose(ready, 'In the Shadows')
    t.choose(ready, 'Dagger')
    t.choose(ready, 'emperor')
    expect(dennis(ready).getInfluence('emperor')).toBe(1)
    expect(cardNames(ready.zones.byId('dennis.discard'))).toContain('Dagger')

    const short = t.fixture({ useRiseOfIx: true })
    t.setBoard(short, { dennis: { handExact: ['In the Shadows', 'Dagger'] } })
    short.run()
    t.choose(short, 'Agent Turn.In the Shadows')
    t.choose(short, 'Arrakeen')
    t.choose(short, 'In the Shadows')
    expect(cardNames(short.zones.byId('dennis.hand'))).toContain('Dagger')
    expect(cardNames(short.zones.byId('dennis.discard'))).not.toContain('Dagger')
    expect(dennis(short).getInfluence('emperor')).toBe(0)
  })

  test('revealing In the Shadows gains Bene Gesserit influence', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['In the Shadows'] } })
    game.run()

    t.choose(game, 'Reveal Turn')

    expect(dennis(game).getInfluence('bene-gesserit')).toBe(1)
  })

  test('Jamis trashes a card', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Jamis', 'Dagger'] } })
    game.run()

    t.choose(game, 'Agent Turn.Jamis')
    t.choose(game, 'Fremkit')
    t.choose(game, 'Jamis')
    t.choose(game, 'Dagger (Hand)')

    expect(cardNames(game.zones.byId('common.trash'))).toContain('Dagger')
  })

  test('Local Fence trades spice for Solari, or Solari for spice', () => {
    const forSolari = t.fixture({ useRiseOfIx: true })
    t.setBoard(forSolari, { dennis: { handExact: ['Local Fence'], spice: 2 } })
    forSolari.run()
    t.choose(forSolari, 'Agent Turn.Local Fence')
    t.choose(forSolari, 'Arrakeen')
    t.choose(forSolari, 'Local Fence')
    t.choose(forSolari, 'Pay 2 Spice for 5 Solari')
    expect(dennis(forSolari).spice).toBe(0)
    expect(dennis(forSolari).solari).toBe(5)

    const forSpice = t.fixture({ useRiseOfIx: true })
    t.setBoard(forSpice, { dennis: { handExact: ['Local Fence'], solari: 5 } })
    forSpice.run()
    t.choose(forSpice, 'Agent Turn.Local Fence')
    t.choose(forSpice, 'Arrakeen')
    t.choose(forSpice, 'Local Fence')
    t.choose(forSpice, 'Pay 5 Solari for 4 Spice')
    expect(dennis(forSpice).solari).toBe(0)
    expect(dennis(forSpice).spice).toBe(4)
  })

  test('Satellite Ban discards for spice and water, and can retreat from the conflict', () => {
    const paid = t.fixture({ useRiseOfIx: true })
    t.setBoard(paid, { dennis: { handExact: ['Satellite Ban', 'Dagger'] } })
    paid.run()
    t.choose(paid, 'Agent Turn.Satellite Ban')
    t.choose(paid, 'Deliver Supplies')
    t.choose(paid, 'Satellite Ban')
    t.choose(paid, 'Dagger')
    expect(dennis(paid).spice).toBe(1)
    expect(dennis(paid).water).toBe(3)

    const skipped = t.fixture({ useRiseOfIx: true })
    t.setBoard(skipped, { dennis: { handExact: ['Satellite Ban', 'Dagger'] } })
    skipped.run()
    t.choose(skipped, 'Agent Turn.Satellite Ban')
    t.choose(skipped, 'Deliver Supplies')
    t.choose(skipped, 'Satellite Ban')
    t.choose(skipped, 'Do not discard')
    expect(dennis(skipped).spice).toBe(0)
    expect(dennis(skipped).water).toBe(2)
    expect(cardNames(skipped.zones.byId('dennis.hand'))).toEqual(['Dagger'])

    const retreat = t.fixture({ useRiseOfIx: true })
    t.setBoard(retreat, {
      dennis: { handExact: ['Satellite Ban'] },
      conflict: { deployedTroops: { dennis: 2 } },
    })
    retreat.run()
    t.choose(retreat, 'Reveal Turn')
    t.choose(retreat, 'Retreat 2 troop(s)')
    expect(retreat.state.conflict.deployedTroops.dennis).toBe(0)
    expect(dennis(retreat).troopsInGarrison).toBe(5)
  })

  test('Sayyadina pays 3 water for a victory point', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Sayyadina'], water: 3 } })
    game.run()

    t.choose(game, 'Agent Turn.Sayyadina')
    t.choose(game, 'Fremkit')
    t.choose(game, 'Sayyadina')
    t.choose(game, 'Pay 3 Water --> +1 Victory Point')

    expect(dennis(game).water).toBe(0)
    expect(dennis(game).vp).toBe(1)
  })

  test('Sayyadina persuasion needs another Fremen card in play', () => {
    const bonded = t.fixture({ useRiseOfIx: true })
    t.setBoard(bonded, {
      dennis: { handExact: ['Sayyadina'], played: ['Jamis'] },
    })
    bonded.run()
    t.choose(bonded, 'Reveal Turn')
    expect(title(bonded)).toContain('3 Persuasion')

    const alone = t.fixture({ useRiseOfIx: true })
    t.setBoard(alone, { dennis: { handExact: ['Sayyadina'] } })
    alone.run()
    t.choose(alone, 'Reveal Turn')
    expect(dennis(alone).getCounter('persuasion')).toBe(0)
  })

  test('Spice Trader discards for spice only with 2 Fremen influence', () => {
    const ready = t.fixture({ useRiseOfIx: true })
    t.setBoard(ready, {
      dennis: { handExact: ['Spice Trader', 'Dagger'], influence: { fremen: 2 } },
    })
    ready.run()
    t.choose(ready, 'Agent Turn.Spice Trader')
    t.choose(ready, 'Imperial Basin')
    t.choose(ready, 'Spice Trader')
    t.choose(ready, 'Dagger')
    expect(dennis(ready).spice).toBe(3)
    expect(cardNames(ready.zones.byId('dennis.discard'))).toContain('Dagger')

    const short = t.fixture({ useRiseOfIx: true })
    t.setBoard(short, { dennis: { handExact: ['Spice Trader', 'Dagger'] } })
    short.run()
    t.choose(short, 'Agent Turn.Spice Trader')
    t.choose(short, 'Imperial Basin')
    t.choose(short, 'Spice Trader')
    expect(dennis(short).spice).toBe(1)
    expect(cardNames(short.zones.byId('dennis.hand'))).toEqual(['Dagger'])
  })

  test('Truthsayer discards a card to draw a card', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Truthsayer', 'Dagger'] } })
    game.run()

    t.choose(game, 'Agent Turn.Truthsayer')
    t.choose(game, 'Dutiful Service')
    t.choose(game, 'Truthsayer')
    t.choose(game, 'Dagger')

    expect(cardNames(game.zones.byId('dennis.discard'))).toContain('Dagger')
    expect(cardNames(game.zones.byId('dennis.hand'))).toHaveLength(1)
    expect(cardNames(game.zones.byId('dennis.hand'))).not.toContain('Dagger')
  })

  test('skipping Truthsayer\'s discard draws nothing', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Truthsayer', 'Dagger'] } })
    game.run()

    t.choose(game, 'Agent Turn.Truthsayer')
    t.choose(game, 'Dutiful Service')
    t.choose(game, 'Truthsayer')
    t.choose(game, 'Do not discard')

    expect(cardNames(game.zones.byId('dennis.hand'))).toEqual(['Dagger'])
  })

  test('Water Peddler gains water when revealed and when bought', () => {
    const revealed = t.fixture({ useRiseOfIx: true })
    t.setBoard(revealed, { dennis: { handExact: ['Water Peddler'] } })
    revealed.run()
    t.choose(revealed, 'Reveal Turn')
    expect(dennis(revealed).water).toBe(2)

    const bought = t.fixture({ useRiseOfIx: true })
    bought.testSetBreakpoint('initialization-complete', (g) => {
      const row = g.zones.byId('common.imperiumRow')
      const deck = g.zones.byId('common.imperiumDeck')
      const target = deck.cardlist().find(card => card.name === 'Water Peddler')
      row.cardlist()[0].moveTo(deck)
      target.moveTo(row)
    })
    bought.run()
    t.choose(bought, 'Reveal Turn')
    t.choose(bought, 'Water Peddler')
    expect(dennis(bought).water).toBe(2)
    expect(cardNames(bought.zones.byId('dennis.discard'))).toContain('Water Peddler')
  })

  test('Web of Power pays every influence threshold it has reached', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: {
        handExact: ['Web of Power'],
        influence: { emperor: 2, guild: 2, fremen: 2 },
      },
    })
    game.run()

    const handBefore = cardNames(game.zones.byId('dennis.deck')).length
    t.choose(game, 'Agent Turn.Web of Power')
    t.choose(game, 'Web of Power')

    expect(dennis(game).solari).toBe(2)
    expect(dennis(game).water).toBe(2)
    expect(cardNames(game.zones.byId('dennis.hand'))).toHaveLength(1)
    expect(handBefore).toBeGreaterThan(cardNames(game.zones.byId('dennis.deck')).length)
  })

  test('Web of Power does nothing below 2 influence, and its reveal is one influence', () => {
    const quiet = t.fixture({ useRiseOfIx: true })
    t.setBoard(quiet, { dennis: { handExact: ['Web of Power'] } })
    quiet.run()
    t.choose(quiet, 'Agent Turn.Web of Power')
    t.choose(quiet, 'Web of Power')
    expect(dennis(quiet).solari).toBe(0)
    expect(dennis(quiet).water).toBe(1)
    expect(cardNames(quiet.zones.byId('dennis.hand'))).toHaveLength(0)

    const revealed = t.fixture({ useRiseOfIx: true })
    t.setBoard(revealed, { dennis: { handExact: ['Web of Power'] } })
    revealed.run()
    t.choose(revealed, 'Reveal Turn')
    t.choose(revealed, 'fremen')
    expect(dennis(revealed).getInfluence('fremen')).toBe(1)
  })

  test('Weirding Way can take another turn, or decline it', () => {
    const again = t.fixture({ useRiseOfIx: true })
    t.setBoard(again, { dennis: { handExact: ['Weirding Way', 'Dagger'] } })
    again.run()
    t.choose(again, 'Agent Turn.Weirding Way')
    t.choose(again, 'Smuggling')
    t.choose(again, 'Weirding Way')
    t.choose(again, 'Take another turn')
    t.choose(again, 'Advance')
    expect(again.waiting.selectors[0].actor).toBe('dennis')
    expect(title(again)).toBe('Choose Turn')

    const declined = t.fixture({ useRiseOfIx: true })
    t.setBoard(declined, { dennis: { handExact: ['Weirding Way'] } })
    declined.run()
    t.choose(declined, 'Agent Turn.Weirding Way')
    t.choose(declined, 'Smuggling')
    t.choose(declined, 'Weirding Way')
    t.choose(declined, 'Pass')
    t.choose(declined, 'Advance')
    expect(declined.waiting.selectors[0].actor).not.toBe('dennis')
  })

  test('Control the Spice pays a spice to trash a card and recruit, and reveals a spice', () => {
    const agent = t.fixture({ useRiseOfIx: true, useEpic: true })
    t.setBoard(agent, {
      dennis: { handExact: ['Control the Spice', 'Dagger'], spice: 1 },
    })
    agent.run()
    t.choose(agent, 'Agent Turn.Control the Spice')
    t.choose(agent, 'Imperial Basin')
    t.choose(agent, 'Control the Spice')
    t.choose(agent, '1 Spice --> Trash a card, +1 Troop')
    t.choose(agent, 'Dagger (Hand)')
    expect(cardNames(agent.zones.byId('common.trash'))).toContain('Dagger')
    expect(dennis(agent).troopsInGarrison).toBe(6)
    expect(dennis(agent).spice).toBe(1)

    const revealed = t.fixture({ useRiseOfIx: true, useEpic: true })
    t.setBoard(revealed, { dennis: { handExact: ['Control the Spice'] } })
    revealed.run()
    t.choose(revealed, 'Reveal Turn')
    expect(dennis(revealed).spice).toBe(1)
  })

  test('Blackmail loses influence for 5 swords', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, combatSetup('Blackmail', { dennis: { influence: { emperor: 1 } } }))
    game.run()

    untilTitle(game, 'Combat Intrigue')
    t.choose(game, 'Blackmail')

    expect(dennis(game).getInfluence('emperor')).toBe(0)
    expect(dennis(game).strength).toBe(7)
  })

  test('Cull pays a Solari to trash a card, and can decline', () => {
    const paid = t.fixture({ useRiseOfIx: true })
    t.setBoard(paid, {
      dennis: { handExact: ['Dagger'], intrigue: ['Cull'], solari: 1 },
    })
    paid.run()
    t.playPlot(paid, 'Cull')
    t.choose(paid, 'Pay 1 Solari:, Trash a card')
    t.choose(paid, 'Dagger (Hand)')
    expect(dennis(paid).solari).toBe(0)
    expect(cardNames(paid.zones.byId('common.trash'))).toContain('Dagger')

    const declined = t.fixture({ useRiseOfIx: true })
    t.setBoard(declined, {
      dennis: { handExact: ['Dagger'], intrigue: ['Cull'], solari: 1 },
    })
    declined.run()
    t.playPlot(declined, 'Cull')
    t.choose(declined, 'Decline')
    expect(dennis(declined).solari).toBe(1)
    expect(cardNames(declined.zones.byId('dennis.hand'))).toEqual(['Dagger'])
  })

  test('Finesse moves influence, and adds 2 swords in combat', () => {
    const plot = t.fixture({ useRiseOfIx: true })
    t.setBoard(plot, {
      dennis: { intrigue: ['Finesse'], influence: { emperor: 1 } },
    })
    plot.run()
    t.playPlot(plot, 'Finesse')
    t.choose(plot, 'emperor')
    t.choose(plot, 'fremen')
    expect(dennis(plot).getInfluence('emperor')).toBe(0)
    expect(dennis(plot).getInfluence('fremen')).toBe(1)

    const combat = t.fixture({ useRiseOfIx: true })
    t.setBoard(combat, combatSetup('Finesse'))
    combat.run()
    untilTitle(combat, 'Combat Intrigue')
    t.choose(combat, 'Finesse')
    expect(dennis(combat).strength).toBe(4)
  })

  test('Glimpse the Path pays a Solari for water and a card', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: [], intrigue: ['Glimpse the Path'], solari: 1 } })
    game.run()

    t.playPlot(game, 'Glimpse the Path')
    t.choose(game, 'Pay 1 Solari:, +1 Water and Draw a card')

    expect(dennis(game).solari).toBe(0)
    expect(dennis(game).water).toBe(2)
    expect(cardNames(game.zones.byId('dennis.hand'))).toHaveLength(1)
  })

  test('Ixian Probe discards two cards to draw two, and stops if the discard is refused', () => {
    const paid = t.fixture({ useRiseOfIx: true })
    t.setBoard(paid, {
      dennis: {
        handExact: ['Dagger', 'Diplomacy', 'Dune, The Desert Planet'],
        intrigue: ['Ixian Probe'],
      },
    })
    paid.run()
    t.playPlot(paid, 'Ixian Probe')
    t.choose(paid, 'Dagger')
    t.choose(paid, 'Diplomacy')
    expect(cardNames(paid.zones.byId('dennis.discard')).sort()).toEqual(['Dagger', 'Diplomacy'])
    expect(cardNames(paid.zones.byId('dennis.hand'))).toHaveLength(3)
    expect(cardNames(paid.zones.byId('dennis.hand'))).not.toContain('Dagger')

    const skipped = t.fixture({ useRiseOfIx: true })
    t.setBoard(skipped, {
      dennis: {
        handExact: ['Dagger', 'Diplomacy', 'Dune, The Desert Planet'],
        intrigue: ['Ixian Probe'],
      },
    })
    skipped.run()
    t.playPlot(skipped, 'Ixian Probe')
    t.choose(skipped, 'Do not discard')
    expect(cardNames(skipped.zones.byId('dennis.hand')).sort()).toEqual([
      'Dagger',
      'Diplomacy',
      'Dune, The Desert Planet',
    ])
  })

  test('Quid Pro Quo buys influence for each faction where you have an Agent', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { intrigue: ['Quid Pro Quo'], spice: 2 },
      boardSpaces: {
        'dutiful-service': ['dennis'],
        fremkit: ['dennis'],
      },
    })
    game.run()

    t.playPlot(game, 'Quid Pro Quo')
    t.choose(game, 'Pay 2 Spice for +1 Influence per faction with agents')

    expect(dennis(game).spice).toBe(0)
    expect(dennis(game).getInfluence('emperor')).toBe(1)
    expect(dennis(game).getInfluence('fremen')).toBe(1)
    expect(dennis(game).getInfluence('guild')).toBe(0)
  })

  test('Secret Forces recruits only with a High Council seat', () => {
    const seated = t.fixture({ useRiseOfIx: true })
    t.setBoard(seated, { dennis: { intrigue: ['Secret Forces'], hasHighCouncil: true } })
    seated.run()
    t.playPlot(seated, 'Secret Forces')
    expect(dennis(seated).troopsInGarrison).toBe(5)

    const standing = t.fixture({ useRiseOfIx: true })
    t.setBoard(standing, { dennis: { intrigue: ['Secret Forces'] } })
    standing.run()
    t.playPlot(standing, 'Secret Forces')
    expect(dennis(standing).troopsInGarrison).toBe(3)
  })

  test('Strategic Push adds swords and pays Solari for winning', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, combatSetup('Strategic Push'))
    game.run()

    untilTitle(game, 'Combat Intrigue')
    t.choose(game, 'Strategic Push')
    expect(dennis(game).strength).toBe(4)
    untilTitle(game, 'Choose a faction')
    t.choose(game, 'emperor')

    expect(dennis(game).solari).toBe(2)
  })

  test('Strongarm loses a troop for influence on the faction visited this turn', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Diplomacy'], intrigue: ['Strongarm'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Fremkit')
    t.playPlot(game, 'Strongarm')

    expect(dennis(game).troopsInGarrison).toBe(2)
    expect(dennis(game).getInfluence('fremen')).toBe(2)
    expect(dennis(game).vp).toBe(1)
  })

  test('War Chest pays Solari for swords, and scores at 10 Solari', () => {
    const combat = t.fixture({ useRiseOfIx: true })
    t.setBoard(combat, combatSetup('War Chest', { dennis: { solari: 2 } }))
    combat.run()
    untilTitle(combat, 'Combat Intrigue')
    t.choose(combat, 'War Chest')
    t.choose(combat, 'Pay 2 Solari:, +4 Swords')
    expect(dennis(combat).solari).toBe(0)
    expect(dennis(combat).strength).toBe(6)

    const scored = t.fixture({ useRiseOfIx: true })
    t.setBoard(scored, {
      dennis: { vp: 10, solari: 10, intrigue: ['War Chest'], agents: 0, handExact: [] },
      scott: { agents: 0, handExact: [] },
      micah: { agents: 0, handExact: [] },
    })
    scored.run()
    finishRound(scored, 'War Chest')
    expect(scored.gameOver).toBe(true)
    expect(dennis(scored).vp).toBe(11)

    const short = t.fixture({ useRiseOfIx: true })
    t.setBoard(short, {
      dennis: { vp: 10, solari: 9, intrigue: ['War Chest'], agents: 0, handExact: [] },
      scott: { agents: 0, handExact: [] },
      micah: { agents: 0, handExact: [] },
    })
    short.run()
    finishRound(short, 'War Chest')
    expect(dennis(short).vp).toBe(10)
  })
})
