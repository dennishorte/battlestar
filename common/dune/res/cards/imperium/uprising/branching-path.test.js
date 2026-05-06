'use strict'

const t = require('../../../../testutil')
const card = require('./branching-path.js')

function passPlotIntrigue(game) {
  const choices = t.currentChoices(game)
  if (choices.includes('Pass') && choices.length > 1 && !choices.some(c => c.startsWith('Agent Turn'))) {
    t.choose(game, 'Pass')
  }
}

describe('branching-path', () => {

  test('data', () => {
    expect(card.id).toBe('branching-path')
    expect(card.name).toBe('Branching Path')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAccess).toEqual(['bene-gesserit'])
  })

  test('agent ability with 2 BG influence: trash intrigue gives +1 intrigue and +2 spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Branching Path'],
        influence: { 'bene-gesserit': 2 },
        intrigue: ['Bribery'],
        spice: 0,
      },
    })
    game.run()

    passPlotIntrigue(game)
    t.choose(game, 'Agent Turn.Branching Path')
    t.choose(game, 'Secrets')
    t.choose(game, 'Branching Path')
    t.choose(game, 'Bribery')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('spice')).toBe(2)
    const intrigueAfter = game.zones.byId('dennis.intrigue').cardlist()
    expect(intrigueAfter.length).toBe(2)
    expect(intrigueAfter.some(c => c.name === 'Bribery')).toBe(false)
  })

  test('agent ability with 2 BG influence: pass keeps spice and intrigue unchanged', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Branching Path'],
        influence: { 'bene-gesserit': 2 },
        intrigue: ['Bribery'],
        spice: 0,
      },
    })
    game.run()

    passPlotIntrigue(game)
    t.choose(game, 'Agent Turn.Branching Path')
    t.choose(game, 'Secrets')
    t.choose(game, 'Branching Path')
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('spice')).toBe(0)
    const intrigue = game.zones.byId('dennis.intrigue').cardlist()
    expect(intrigue.length).toBe(2)
    expect(intrigue.some(c => c.name === 'Bribery')).toBe(true)
  })

  test('agent ability with insufficient BG influence does nothing', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Branching Path'],
        influence: { 'bene-gesserit': 1 },
        intrigue: ['Bribery'],
        spice: 0,
      },
    })
    game.run()

    passPlotIntrigue(game)
    t.choose(game, 'Agent Turn.Branching Path')
    t.choose(game, 'Secrets')
    t.choose(game, 'Branching Path')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('spice')).toBe(0)
    const intrigueAfter = game.zones.byId('dennis.intrigue').cardlist()
    expect(intrigueAfter.some(c => c.name === 'Bribery')).toBe(true)
  })

  test('reveal grants 2 persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Branching Path'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
  })
})
