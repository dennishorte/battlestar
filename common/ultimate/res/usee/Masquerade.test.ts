Error.stackTraceLimit = 100
import t from '../../testutil.js'

describe('Masquerade', () => {

  test('dogma: safeguard, return matching age, claim Anonymity', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Masquerade', 'Mysticism'], // Masquerade on top
        hand: ['Tools', 'Calendar', 'Optics', 'Gunpowder'], // 4 cards, two age 4
      },
      achievements: ['Domestication', 'Construction', 'Experimentation', 'Anonymity'], // Experimentation is age 4
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Masquerade')
    request = t.choose(game, request, 'purple') // Splay purple left

    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Masquerade', 'Mysticism'],
          splay: 'left',
        },
        hand: ['Tools', 'Calendar', 'Optics'], // Returned only age 4 cards (Gunpowder)
        safe: ['Experimentation'], // Safeguarded age 4 achievement
        achievements: ['Anonymity'], // Claimed because an age 4 was returned
      },
    })
  })

  test('dogma: safeguard with no matching hand cards to return', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Masquerade'],
        hand: ['Mysticism', 'Engineering'], // Hand size 2, no age 2 cards
      },
      achievements: ['Construction', 'Machinery'], // Construction is age 2
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Masquerade')

    t.testBoard(game, {
      dennis: {
        purple: ['Masquerade'], // Splay choice auto-handled (stays none)
        hand: ['Mysticism', 'Engineering'], // No returns
        safe: ['Construction'], // Safeguarded age 2 achievement
        achievements: [], // No Anonymity (no age 4 returned)
      },
    })
  })

  test('dogma: no available achievement of hand size, only splay', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Masquerade'],
        hand: ['Tools', 'Mysticism', 'Calendar', 'Optics', 'Sailing'], // Hand size 5
      },
      achievements: ['Domestication', 'Construction', 'Machinery', 'Experimentation'], // No age 5 available
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Masquerade')

    t.testBoard(game, {
      dennis: {
        purple: ['Masquerade'], // Splay choice auto-handled (stays none)
        hand: ['Tools', 'Mysticism', 'Calendar', 'Optics', 'Sailing'], // Unchanged
        safe: [], // No safeguard (no age 5 achievement)
        achievements: [], // No Anonymity
      },
    })
  })
})

