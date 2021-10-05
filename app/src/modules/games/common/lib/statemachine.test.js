const StateMachine = require('./statemachine.js').default


describe('constructor', () => {
  test('checks for valid transitions', () => {
    expect(() => new StateMachine({}, null)).toThrow()
    expect(() => new StateMachine({}, {})).toThrow()
    expect(() => new StateMachine({}, { root: {} })).toThrow()
    expect(() => new StateMachine({}, { root: { steps: [] } })).toThrow()
    expect(() => new StateMachine({}, { root: { steps: ['a'] } })).not.toThrow()
    expect(() => new StateMachine({}, { root: { func: 'a' } })).toThrow()
    expect(() => new StateMachine({}, { root: { func: () => 'a' } })).not.toThrow()
  })

  test('checks for valid state', () => {

  })

  test('checks for valid stack', () => {

  })
})


describe('run', () => {
  test('END only', () => {
    const transitions = {
      root: {
        steps: ['END']
      },
    }
    const sm = new StateMachine({}, transitions)
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
    const sm = new StateMachine({}, transitions)
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
    const sm = new StateMachine({}, transitions)
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
        func: (context, state) => {
          if (state.ready) context.done()
          else context.wait('waiting')
        }
      }
    }
    const sm = new StateMachine({ ready: false }, transitions)
    sm.run()

    const stackNamesBefore = sm.stack.map(event => event.name)
    expect(stackNamesBefore).toStrictEqual(['root', 'wait'])
    expect(sm.waiting).toBe('waiting')

    sm.state.ready = true
    sm.run()

    const stackNamesAfter = sm.stack.map(event => event.name)
    expect(stackNamesAfter).toStrictEqual(['root', 'END'])
    expect(sm.waiting).toBe(null)
  })

  test('disconnected states', () => {
    const transitions = {
      root: {
        steps: ['one', 'END']
      },

      'one': {
        func: (context, state) => {
          if (state.ready) context.done()
          else context.push('wait')
        }
      },

      'wait': {
        func: (context, state) => {
          if (state.ready) context.done()
          else context.wait('waiting')
        }
      }
    }
    const sm = new StateMachine({ ready: false }, transitions)
    sm.run()

    const stackNamesBefore = sm.stack.map(event => event.name)
    expect(stackNamesBefore).toStrictEqual(['root', 'one', 'wait'])
    expect(sm.waiting).toBe('waiting')

    sm.state.ready = true
    sm.run()

    const stackNamesAfter = sm.stack.map(event => event.name)
    expect(stackNamesAfter).toStrictEqual(['root', 'END'])
    expect(sm.waiting).toBe(null)
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
    const sm = new StateMachine({}, transitions)
    sm.run()

    const stackNames = sm.stack.map(event => event.name)
    expect(stackNames).toStrictEqual(['root', 'END'])
  })
})
