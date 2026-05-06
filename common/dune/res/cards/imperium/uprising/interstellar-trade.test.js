'use strict'

const t = require('../../../../testutil')
const card = require('./interstellar-trade.js')

describe('interstellar-trade', () => {

  test('data', () => {
    expect(card.id).toBe('interstellar-trade')
    expect(card.name).toBe('Interstellar Trade')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.factionAffiliation).toBe('guild')
    expect(card.acquisitionBonus).toBe('+1 Contract')
    expect(card.agentIcons).toEqual(['green', 'purple', 'yellow'])
  })

  test('agent ability: +1 Influence with a Faction (player choice)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Interstellar Trade'], influence: { emperor: 0 } },
    })
    game.run()

    t.choose(game, 'Agent Turn.Interstellar Trade')
    t.choose(game, 'Assembly Hall')

    let choices = t.currentChoices(game)
    if (choices.includes('Interstellar Trade')) {
      t.choose(game, 'Interstellar Trade')
    }
    // Agent ability prompts for faction choice — pick Emperor
    choices = t.currentChoices(game)
    expect(choices).toEqual(expect.arrayContaining(['emperor', 'guild', 'bene-gesserit', 'fremen']))
    t.choose(game, 'emperor')

    // Drain remainder
    choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.includes('Reveal Turn') && !choices.includes('Pass')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('emperor')).toBe(1)
  })

  test('reveal: +0 persuasion when no completed contracts', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Interstellar Trade'] },
    })
    game.run()
    t.choose(game, 'Reveal Turn')
    const dennis = game.players.byName('dennis')
    // Card has revealPersuasion 0; no contracts ⇒ +0
    expect(dennis.getCounter('persuasion')).toBe(0)
  })

  test('reveal: +1 persuasion per completed contract', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Interstellar Trade'],
        contractsCompleted: 3,
      },
    })
    game.run()
    t.choose(game, 'Reveal Turn')
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(3)
  })

  test('onAcquire: gains a contract', () => {
    const game = t.fixture()
    // Inject Interstellar Trade into the imperium row and boost persuasion
    // so dennis can buy it (cost 7).
    game.testSetBreakpoint('initialization-complete', (g) => {
      const row = g.zones.byId('common.imperiumRow')
      const deck = g.zones.byId('common.imperiumDeck')
      const target = deck.cardlist().find(c => c.name === 'Interstellar Trade')
        || row.cardlist().find(c => c.name === 'Interstellar Trade')
      if (target && target.zone !== row) {
        const displaced = row.cardlist()[0]
        if (displaced) {
          displaced.moveTo(deck)
        }
        target.moveTo(row)
      }
    })
    // Stuff hand with extra persuasion-rich cards so total ≥ 7.
    game.testSetBreakpoint('after-round-start', (g) => {
      const deck = g.zones.byId('common.imperiumDeck')
      const hand = g.zones.byId('dennis.hand')
      const booster = deck.cardlist().find(c => c.name === 'Lady Jessica')
      if (booster) {
        booster.moveTo(hand)
      }
    })
    game.run()

    const contractsBefore = game.zones.byId('dennis.contracts').cardlist().length
    t.choose(game, 'Reveal Turn')
    let choices = t.currentChoices(game)
    expect(choices).toContain('Interstellar Trade')
    t.choose(game, 'Interstellar Trade')

    // onAcquire prompts to choose a contract from the market.
    choices = t.currentChoices(game)
    const contractChoice = choices.find(c => c !== 'Pass')
    expect(contractChoice).toBeDefined()
    t.choose(game, contractChoice)

    const contractsAfter = game.zones.byId('dennis.contracts').cardlist().length
    expect(contractsAfter).toBe(contractsBefore + 1)
  })
})
