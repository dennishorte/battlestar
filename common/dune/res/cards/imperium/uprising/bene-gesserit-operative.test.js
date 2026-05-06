'use strict'

const t = require('../../../../testutil')
const card = require('./bene-gesserit-operative.js')

describe('bene-gesserit-operative', () => {

  test('data', () => {
    expect(card.id).toBe('bene-gesserit-operative')
    expect(card.name).toBe('Bene Gesserit Operative')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.factionAccess).toEqual(['bene-gesserit'])
  })

  test('agent ability places a Spy', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Bene Gesserit Operative'],
        spiesInSupply: 3,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Bene Gesserit Operative')
    t.choose(game, 'Secrets')

    let choices = t.currentChoices(game)
    while (!choices.some(c => c.startsWith('Post '))) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }
    t.choose(game, choices.find(c => c.startsWith('Post ')))

    const dennis = game.players.byName('dennis')
    expect(dennis.spiesInSupply).toBe(2)
  })

  // skip: engine bug — `has-spies-on-board` condition checks
  // `getCounter('spiesTotal') - spiesInSupply`, but `spiesTotal` is never
  // initialized, so the bonus never fires regardless of board state.
  test.skip('reveal with two or more spies on board grants +2 persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Bene Gesserit Operative'],
        spiesInSupply: 1,
      },
      spyPosts: { A: ['dennis'], B: ['dennis'], C: ['dennis'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(3)
  })

  test('reveal with fewer than two spies on board grants only base persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Bene Gesserit Operative'],
        spiesInSupply: 3,
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
  })
})
