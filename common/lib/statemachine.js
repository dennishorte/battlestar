'use strict'

const RecordKeeper = require('./recordkeeper.js')

const defaultOptions = {
  pushCallback: () => {}
}

function StateMachine(
  transitions,
  state,             // Added to context for functions. Can really be anything.
  recordkeeper,
  stack,             // An array
  waiting,           // An array
  response,          // [{ actor, name, option }] || []
  options,           // object
) {
  _validateTransitions(transitions)

  this.transitions = transitions
  this.state = state
  this.stack = stack
  this.waiting = waiting
  this.response = response
  this.rk = recordkeeper
  this.options = Object.assign({}, defaultOptions, options)
}

StateMachine.prototype.clearWaiting = clearWaiting
StateMachine.prototype.run = run


function run() {
  // Initialize, if needed
  if (this.stack.length === 0) {
    _push.call(this, 'root')
  }

  const event = this.stack[this.stack.length - 1]

  // This is the sentinel value to show that the state machine has reached a
  // terminal state.
  if (event.name === 'END') {
    return
  }

  const context = {
    done: _done.bind(this),
    push: _push.bind(this),
    wait: _wait.bind(this),
    waitMany: _waitMany.bind(this),
    data: event.data,
    state: this.state,
    response: this.response[0],
  }

  const transition = this.transitions[event.name]
  return transition.func(context)
}

function clearWaiting() {
  const inSession = !!this.rk.session
  if (!inSession) {
    this.rk.sessionStart()
  }

  this.rk.session.splice(this.waiting, 0, this.waiting.length)
  this.rk.session.splice(this.response, 0, this.response.length)

  if (!inSession) {
    this.rk.session.commit()
  }
}

function _done() {
  const event = this.stack[this.stack.length - 1]
  // console.log('done', event)
  this.rk.sessionStart(session => {
    session.pop(this.stack)
    this.clearWaiting()
  })
  this.run()
}

function _push(eventName, data) {
  // console.log('push', eventName, data)

  this.rk.sessionStart(session => {
    this.options.pushCallback(eventName, data)
    this.clearWaiting()

    const event = {
      name: eventName,
      data: data || {},
    }

    if (eventName === 'END') {
      session.push(this.stack, event)
      return
    }

    const transition = this.transitions[eventName]
    session.push(this.stack, event)
  })

  this.run()
}

function _wait(payload) {
  this.rk.sessionStart(session => {
    session.splice(this.waiting, 0, this.waiting.length, payload)
  })
}

function _waitMany(payload) {
  this.rk.sessionStart(session => {
    session.splice(this.waiting, 0, this.waiting.length, ...payload)
  })
}

class InvalidTransitionError extends Error {
  constructor(...params) {
    // Pass arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidTransitionError)
    }

    this.name = 'InvalidTransitionError'
  }
}

function _assertTransition(test, message) {
  if (!test) {
    throw new InvalidTransitionError(message)
  }
}

function _validateTransitions(transitions) {
  _assertTransition(
    transitions.hasOwnProperty('root'),
    'No root transition'
  )

  for (const [name, data] of Object.entries(transitions)) {
    _assertTransition(
      typeof data.func === 'function',
      `${name}.func is not a function`
    )
  }
}

module.exports = StateMachine
