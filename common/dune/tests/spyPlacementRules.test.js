const t = require('../testutil')

describe('Spy Placement Rules', () => {

  // Per the Uprising rules: "place a Spy from your supply on an unoccupied
  // observation post on the board." A post holds at most one spy across all
  // players (Double Agent is the explicit exception).
  test('cannot place a spy on a post occupied by another player', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Micah's spy occupies post L (Espionage, Secrets).
      spyPosts: { L: ['micah'] },
      dennis: {
        handExact: ['Seek Allies'],
        spice: 1,
        spiesInSupply: 3,
      },
    })
    game.run()

    // Send dennis to Espionage (Bene Gesserit space). The space's spy effect
    // triggers placeSpy, which must skip post L.
    t.choose(game, 'Agent Turn.Seek Allies')
    t.choose(game, 'Espionage')

    let choices = t.currentChoices(game)
    while (!choices.some(c => c.startsWith('Post '))) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    const postIds = choices
      .filter(c => c.startsWith('Post '))
      .map(c => c.match(/Post (\w+)/)[1])
    expect(postIds).not.toContain('L')
  })

  test('cannot place a spy on a post the same player already occupies', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Dennis already has a spy on post L.
      spyPosts: { L: ['dennis'] },
      dennis: {
        handExact: ['Seek Allies'],
        spice: 1,
        spiesInSupply: 3,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Seek Allies')
    t.choose(game, 'Espionage')

    let choices = t.currentChoices(game)
    while (!choices.some(c => c.startsWith('Post '))) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    const postIds = choices
      .filter(c => c.startsWith('Post '))
      .map(c => c.match(/Post (\w+)/)[1])
    expect(postIds).not.toContain('L')
  })

  test('all empty posts are offered when none are occupied', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Seek Allies'],
        spice: 1,
        spiesInSupply: 3,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Seek Allies')
    t.choose(game, 'Espionage')

    let choices = t.currentChoices(game)
    while (!choices.some(c => c.startsWith('Post '))) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    const postIds = choices
      .filter(c => c.startsWith('Post '))
      .map(c => c.match(/Post (\w+)/)[1])
    // 13 observation posts, A through M
    expect(postIds.sort()).toEqual([
      'A', 'B', 'C', 'D', 'E', 'F', 'G',
      'H', 'I', 'J', 'K', 'L', 'M',
    ])
  })
})
