const RecordKeeper = require('./recordkeeper.js')
const StateMachine = require('./statemachine.js')


function stateFactory(transitions, state) {
  if (!state) {
    state = {
      ready: false,
      history: [],
      sm: {
        stack: [],
        waiting: [],
      }
    }
  }
  const rk = new RecordKeeper(state)
  return new StateMachine(transitions, state, rk, state.sm.stack, state.sm.waiting)
}


describe('constructor', () => {
  test('checks for valid transitions', () => {
    expect(() => stateFactory(null)).toThrow()
    expect(() => stateFactory({})).toThrow()
    expect(() => stateFactory({ root: {} })).toThrow()
    expect(() => stateFactory({ root: { steps: [] } })).toThrow()
    expect(() => stateFactory({ root: { steps: ['a'] } })).not.toThrow()
    expect(() => stateFactory({ root: { func: 'a' } })).toThrow()
    expect(() => stateFactory({ root: { func: () => 'a' } })).not.toThrow()
  })

  test.skip('checks for valid stack', () => {

  })
})


describe('run', () => {
  test('END only', () => {
    const transitions = {
      root: {
        steps: ['END']
      },
    }
    const sm = stateFactory(transitions)
    sm.run()

    const stackNames = sm.stack.map(event => event.name)
    expect(stackNames).toStrictEqual(['root', 'END'])
  })

  test('single root step', () => {
    const transitions = {
      root: {
        steps: ['null', 'END']
      },

      'null': {
        func: (context) => context.done()
      }
    }
    const sm = stateFactory(transitions)
    sm.run()

    const stackNames = sm.stack.map(event => event.name)
    expect(stackNames).toStrictEqual(['root', 'END'])
  })

  test('nested steps', () => {
    const transitions = {
      root: {
        steps: ['one', 'END']
      },

      'one': {
        steps: ['two']
      },

      'two': {
        func: (context) => context.done()
      }
    }
    const sm = stateFactory(transitions)
    sm.run()

    const stackNames = sm.stack.map(event => event.name)
    expect(stackNames).toStrictEqual(['root', 'END'])
  })

  test('wait', () => {
    const transitions = {
      root: {
        steps: ['wait', 'END']
      },

      'wait': {
        func: (context) => {
          if (context.state.ready) context.done()
          else context.wait('waiting')
        }
      }
    }
    const sm = stateFactory(transitions)
    sm.run()

    const stackNamesBefore = sm.stack.map(event => event.name)
    expect(stackNamesBefore).toStrictEqual(['root', 'wait'])
    expect(sm.waiting).toStrictEqual(['waiting'])

    sm.state.ready = true
    sm.run()

    const stackNamesAfter = sm.stack.map(event => event.name)
    expect(stackNamesAfter).toStrictEqual(['root', 'END'])
    expect(sm.waiting).toStrictEqual([])
  })

  test('disconnected states', () => {
    const transitions = {
      root: {
        steps: ['one', 'END']
      },

      'one': {
        func: (context) => {
          if (context.state.ready) context.done()
          else context.push('wait')
        }
      },

      'wait': {
        func: (context) => {
          if (context.state.ready) context.done()
          else context.wait('waiting')
        }
      }
    }
    const sm = stateFactory(transitions)
    sm.run()

    const stackNamesBefore = sm.stack.map(event => event.name)
    expect(stackNamesBefore).toStrictEqual(['root', 'one', 'wait'])
    expect(sm.waiting).toStrictEqual(['waiting'])

    sm.state.ready = true
    sm.run()

    const stackNamesAfter = sm.stack.map(event => event.name)
    expect(stackNamesAfter).toStrictEqual(['root', 'END'])
    expect(sm.waiting).toStrictEqual([])
  })

  test('multiple steps', () => {
    const transitions = {
      root: {
        steps: ['null0', 'null1', 'END']
      },

      'null0': {
        func: (context) => context.done()
      },

      'null1': {
        func: (context) => context.done()
      },
    }
    const sm = stateFactory(transitions)
    sm.run()

    const stackNames = sm.stack.map(event => event.name)
    expect(stackNames).toStrictEqual(['root', 'END'])
  })
})
