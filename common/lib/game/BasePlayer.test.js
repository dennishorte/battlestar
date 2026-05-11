const { BasePlayer } = require('./BasePlayer.js')

function createPlayer({ round = null, turn = null } = {}) {
  const state = { round, turn }
  const game = {
    log: { add: jest.fn() },
    state,
  }
  const player = new BasePlayer(game, { _id: 'p1', name: 'dennis' })
  return { player, game, state }
}

describe('BasePlayer counter history', () => {

  test('addCounter does not write history', () => {
    const { player, state } = createPlayer()
    player.addCounter('vp', 0)
    player.addCounter('spice', 5)
    expect(state.counterHistory).toBeUndefined()
  })

  test('incrementCounter records a history entry per non-zero mutation', () => {
    const { player, state } = createPlayer({ round: 2 })
    player.addCounter('vp', 0)

    player.incrementCounter('vp', 1, { silent: true, source: 'For Humanity' })
    player.incrementCounter('vp', 2, { silent: true, source: 'Plans Within Plans' })

    expect(state.counterHistory.dennis).toEqual([
      { counter: 'vp', delta: 1, total: 1, source: { label: 'For Humanity' }, round: 2, turn: null },
      { counter: 'vp', delta: 2, total: 3, source: { label: 'Plans Within Plans' }, round: 2, turn: null },
    ])
  })

  test('setCounter records the delta from the previous value', () => {
    const { player, state } = createPlayer({ round: 0 })
    player.addCounter('vp', 0)

    player.setCounter('vp', 4, { silent: true, source: 'Starting VP' })
    player.setCounter('vp', 1, { silent: true, source: 'penalty' })

    expect(state.counterHistory.dennis).toEqual([
      { counter: 'vp', delta: 4, total: 4, source: { label: 'Starting VP' }, round: 0, turn: null },
      { counter: 'vp', delta: -3, total: 1, source: { label: 'penalty' }, round: 0, turn: null },
    ])
  })

  test('zero-delta mutations are skipped', () => {
    const { player, state } = createPlayer()
    player.addCounter('vp', 3)

    player.incrementCounter('vp', 0, { silent: true, source: 'noop' })
    player.setCounter('vp', 3, { silent: true, source: 'noop' })

    expect(state.counterHistory).toBeUndefined()
  })

  test('source can be omitted (recorded as null)', () => {
    const { player, state } = createPlayer()
    player.addCounter('spice', 0)
    player.incrementCounter('spice', 2, { silent: true })

    expect(state.counterHistory.dennis[0].source).toBeNull()
  })

  test('source as { label, ref } is preserved verbatim', () => {
    const { player, state } = createPlayer()
    player.addCounter('vp', 0)
    const ref = { kind: 'card', defId: 'for-humanity' }

    player.incrementCounter('vp', 1, { silent: true, source: { label: 'For Humanity', ref } })

    expect(state.counterHistory.dennis[0].source).toEqual({ label: 'For Humanity', ref })
  })

  test('decrementCounter records a negative delta with source', () => {
    const { player, state } = createPlayer()
    player.addCounter('vp', 5)
    player.decrementCounter('vp', 2, { silent: true, source: 'penalty' })

    expect(state.counterHistory.dennis[0]).toEqual(expect.objectContaining({
      counter: 'vp',
      delta: -2,
      total: 3,
      source: { label: 'penalty' },
    }))
  })

  test('history is keyed by player name and includes round + turn from game.state', () => {
    const { player, state } = createPlayer({ round: 5, turn: 'dennis' })
    player.addCounter('vp', 0)
    player.incrementCounter('vp', 1, { silent: true, source: 'X' })

    expect(Object.keys(state.counterHistory)).toEqual(['dennis'])
    expect(state.counterHistory.dennis[0]).toEqual(expect.objectContaining({ round: 5, turn: 'dennis' }))
  })
})
