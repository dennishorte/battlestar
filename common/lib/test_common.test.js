const TestCommon = require('./test_common.js')

// Build a minimal fake game whose `waiting` exposes a single selector and
// whose `respondToInputRequest` records the response so the test can assert
// what TestCommon.choose actually submitted.
function fakeGame(choices, { title = 'pick one', actor = 'p1' } = {}) {
  const submitted = []
  const game = {
    waiting: {
      selectors: [{ title, actor, choices }]
    },
    respondToInputRequest(response) {
      submitted.push(response)
      return response
    },
  }
  return { game, submitted }
}

describe('TestCommon.choose', () => {
  describe('plain string selection', () => {
    test('passes through bare titles when only one match exists', () => {
      const { game, submitted } = fakeGame(['Alpha', 'Beta'])
      TestCommon.choose(game, 'Alpha')
      expect(submitted[0].selection).toEqual(['Alpha'])
    })

    test('emits structured selection when the matched choice carries an id', () => {
      const { game, submitted } = fakeGame([
        { title: 'Alpha', id: 'alpha-1' },
        { title: 'Beta', id: 'beta-1' },
      ])
      TestCommon.choose(game, 'Alpha')
      expect(submitted[0].selection).toEqual([{ title: 'Alpha', id: 'alpha-1' }])
    })

    test('star prefix returns literal (digit-only escape hatch)', () => {
      const { game, submitted } = fakeGame(['37', '42'])
      TestCommon.choose(game, '*37')
      expect(submitted[0].selection).toEqual(['37'])
    })

    test('falls back to prefix match when no exact title match', () => {
      const { game, submitted } = fakeGame(['Strategic Action: leadership', 'Pass'])
      TestCommon.choose(game, 'Strategic Action')
      expect(submitted[0].selection).toEqual(['Strategic Action: leadership'])
    })

    test('dot syntax produces nested selection', () => {
      const { game, submitted } = fakeGame([
        { title: 'Dogma', choices: ['Archery', 'The Wheel'] },
      ])
      TestCommon.choose(game, 'Dogma.Archery')
      expect(submitted[0].selection).toEqual([{ title: 'Dogma', selection: ['Archery'] }])
    })
  })

  describe('ambiguity detection', () => {
    test('throws when multiple choices share a title and have distinct defIds', () => {
      const { game } = fakeGame([
        { title: 'Desert Power', id: 'imperium-desert-power-0', defId: 'desert-power' },
        { title: 'Desert Power', id: 'conflict-desert-power', defId: 'conflict-desert-power' },
      ])
      expect(() => TestCommon.choose(game, 'Desert Power')).toThrow(/ambiguous/)
      expect(() => TestCommon.choose(game, 'Desert Power')).toThrow(/desert-power/)
    })

    test('does NOT throw when matches are interchangeable copies (same defId)', () => {
      const { game, submitted } = fakeGame([
        { title: 'Desert Power', id: 'imperium-desert-power-0', defId: 'desert-power' },
        { title: 'Desert Power', id: 'imperium-desert-power-1', defId: 'desert-power' },
      ])
      TestCommon.choose(game, 'Desert Power')
      expect(submitted[0].selection).toEqual(['Desert Power'])
    })

    test('does NOT throw when matches lack defId entirely (legacy / interchangeable)', () => {
      const { game, submitted } = fakeGame([
        { title: 'House Guard', id: 'house-guard-0' },
        { title: 'House Guard', id: 'house-guard-1' },
      ])
      TestCommon.choose(game, 'House Guard')
      expect(submitted[0].selection).toEqual(['House Guard'])
    })
  })

  describe('structured disambiguation', () => {
    test('{id} resolves to the matching choice', () => {
      const { game, submitted } = fakeGame([
        { title: 'Desert Power', id: 'imperium-x', defId: 'desert-power' },
        { title: 'Desert Power', id: 'conflict-x', defId: 'conflict-desert-power' },
      ])
      TestCommon.choose(game, { id: 'conflict-x' })
      expect(submitted[0].selection).toEqual([{ title: 'Desert Power', id: 'conflict-x' }])
    })

    test('{id} throws when no matching choice exists', () => {
      const { game } = fakeGame([{ title: 'Alpha', id: 'alpha' }])
      expect(() => TestCommon.choose(game, { id: 'no-such-id' })).toThrow(/No choice with id/)
    })

    test('{kind, name} resolves to the matching choice and emits structured selection', () => {
      const { game, submitted } = fakeGame([
        { title: 'Desert Power', id: 'imp-1', defId: 'desert-power', kind: 'imperium-card' },
        { title: 'Desert Power', id: 'cnf-1', defId: 'conflict-desert-power', kind: 'conflict-card' },
      ])
      TestCommon.choose(game, { kind: 'conflict-card', name: 'Desert Power' })
      expect(submitted[0].selection).toEqual([{ title: 'Desert Power', id: 'cnf-1' }])
    })

    test('{kind, name} throws when ambiguous within a single kind', () => {
      const { game } = fakeGame([
        { title: 'Twin', id: 'a', kind: 'card' },
        { title: 'Twin', id: 'b', kind: 'card' },
      ])
      expect(() => TestCommon.choose(game, { kind: 'card', name: 'Twin' })).toThrow(/still ambiguous/)
    })
  })

  describe('back-compat', () => {
    test('full nested {title, selection} form passes through unchanged', () => {
      const { game, submitted } = fakeGame([
        { title: 'Dogma', choices: ['Archery'] },
      ])
      TestCommon.choose(game, { title: 'Dogma', selection: ['Archery'] })
      expect(submitted[0].selection).toEqual([{ title: 'Dogma', selection: ['Archery'] }])
    })

    test('numbers pass through unchanged (action selectors)', () => {
      const { game, submitted } = fakeGame([])
      TestCommon.choose(game, 42)
      expect(submitted[0].selection).toEqual([42])
    })

    test('digit-only strings coerce to numbers', () => {
      const { game, submitted } = fakeGame([])
      TestCommon.choose(game, '7')
      expect(submitted[0].selection).toEqual([7])
    })
  })
})
