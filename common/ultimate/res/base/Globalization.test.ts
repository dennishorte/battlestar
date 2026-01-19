import t from '../../testutil.js'
import { GameOverEvent, InputRequestEvent } from '../../../lib/game.js'


describe('Globalization', () => {
  test('demand', () => {
    const game = t.fixtureTopCard('Globalization')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Globalization', 'Stem Cells', 'Fermenting'])
      t.setSplay(game, 'dennis', 'yellow', 'up')
      t.setColor(game, 'micah', 'yellow', ['Agriculture', 'Statistics'])
      t.setSplay(game, 'micah', 'yellow', 'left')
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Globalization')

    expect(t.cards(game, 'yellow', 'micah')).toEqual(['Statistics'])
  })

  test('draw and score', () => {
    const game = t.fixtureTopCard('Globalization')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Globalization', 'Stem Cells', 'Fermenting'])
      t.setSplay(game, 'dennis', 'yellow', 'up')
      t.setDeckTop(game, 'base', 11, ['Hypersonics'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Globalization')

    expect(t.cards(game, 'green')).toEqual(['Hypersonics'])
  })

  test('win condition (yes)', () => {
    const game = t.fixtureTopCard('Globalization')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Globalization'])
      t.setScore(game, 'dennis', ['Metalworking'])
      t.setSplay(game, 'dennis', 'yellow', 'up')
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Globalization')

    expect(request).toEqual(expect.any(GameOverEvent))
  })

  test('win condition (no)', () => {
    const game = t.fixtureTopCard('Globalization')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Globalization', 'Stem Cells', 'Fermenting'])
      t.setSplay(game, 'dennis', 'yellow', 'up')
      t.setColor(game, 'micah', 'yellow', ['Agriculture', 'Statistics'])
      t.setSplay(game, 'micah', 'yellow', 'left')
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Globalization')

    expect(request).toEqual(expect.any(InputRequestEvent))
  })
})
