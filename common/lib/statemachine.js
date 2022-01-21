'use strict'

const RecordKeeper = require('./recordkeeper.js')
const util = require('./util.js')

const defaultOptions = {
  enrichContext: (context) => {},
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

StateMachine.prototype.clearSentBack = clearSentBack
StateMachine.prototype.clearWaiting = clearWaiting
StateMachine.prototype.run = run
StateMachine.prototype.dumpStack = dumpStack


function dumpStack() {
  const output = []
  for (const event of this.stack) {
    output.push(JSON.stringify(event))
  }
  console.log(output.join('\n'))
}

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
    sendBack: _sendBack.bind(this),
    waitMany: _waitMany.bind(this),
    data: event.data,
    sentBack: event.sentBack,
    state: this.state,
    response: this.response[0],
  }

  this.options.enrichContext(context)

  const transition = this.transitions[event.name]

  if (!transition) {
    throw new Error(`Transition ${event.name} is not defined`)
  }

  if (typeof transition === 'function') {
    return transition(context)
  }
  else {
    return transition.func(context)
  }
}

function clearSentBack() {
  if (this.stack.length > 0) {
    const event = this.stack[this.stack.length - 1]
    this.rk.replace(event.sentBack, {})
  }
}

function clearWaiting() {
  this.rk.splice(this.waiting, 0, this.waiting.length)
  this.rk.splice(this.response, 0, this.response.length)
}

function _done() {
  const event = this.stack[this.stack.length - 1]
  this.rk.pop(this.stack)
  this.clearWaiting()
  this.run()
  return 'done'
}

function _push(eventName, data) {
  this.options.pushCallback(eventName, data)
  this.clearSentBack()
  this.clearWaiting()

  const event = {
    name: eventName,
    data: data || {},
    sentBack: {},
  }

  // Temporary code for log indent.
  // This should be generalized somehow rather than hard-coded.
  if (this.stack.length > 0) {
    if (!event.data.parentLogId) {
      const prev = this.stack[this.stack.length - 1]
      if (prev.data.parentLogId) {
        event.data.parentLogId = prev.data.parentLogId
      }
    }
  }

  if (eventName === 'END') {
    this.rk.push(this.stack, event)
    return
  }

  const transition = this.transitions[eventName]
  this.rk.push(this.stack, event)

  this.run()
  return 'push'
}

function _sendBack(dict) {
  util.assert(dict !== undefined && dict !== null && typeof dict === 'object', 'Can only sendBack objects')

  const prevEvent = this.stack[this.stack.length - 2]

  for (const [key, value] of Object.entries(dict)) {
    util.assert(value !== undefined && value !== null, `Attempt to sendBack undefined or null for key ${key}`)
    util.assert(prevEvent.sentBack[key] === undefined, `Attempt to overwrite sendBack key ${key}`)
    this.rk.addKey(prevEvent.sentBack, key, value)
  }
}

function _wait(payload) {
  this.rk.splice(this.waiting, 0, this.waiting.length, payload)
  return 'wait'
}

function _waitMany(payload) {
  this.rk.splice(this.waiting, 0, this.waiting.length, ...payload)
  return 'wait'
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
      typeof data === 'function' || typeof data.func === 'function',
      `${name}.func is not a function`
    )
  }
}

module.exports = StateMachine
