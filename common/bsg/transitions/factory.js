module.exports = {
  markDone,
  stepFactory,
  transitionFactory,
  transitionFactory2,
}

function markDone(context) {
  const game = context.state
  game.rk.put(context.data, 'done', true)
}

function stepFactory(steps, options) {
  options = options || {}

  return function(context) {
    _initialize(context, { steps, stepIndex: 0 })

    const game = context.state

    if (context.data.stepIndex < context.data.steps.length) {
      const step = context.data.steps[context.data.stepIndex]
      game.rk.put(context.data, 'stepIndex', context.data.stepIndex + 1)

      let childData = {}
      if (options.childData) {
        childData = options.childData(context)
      }

      return context.push(step, childData)
    }
    else {
      return context.done()
    }
  }
}

function transitionFactory(data, generator, responder) {
  return function (context) {
    _initialize(context, data)

    if (context.data.done) {
      return context.done()
    }

    else if (context.response) {
      return responder(context)
    }

    else {
      return generator(context)
    }
  }
}

function _initialize(context, data) {
  if (context.data.initialized) {
    return
  }

  const game = context.state
  game.rk.addKey(context.data, 'initialized', true)

  // Often used by transition to show they have no more work, and are just waiting for
  // child transitions to complete.
  game.rk.addKey(context.data, 'done', false)

  for (const [key, value] of Object.entries(data)) {
    game.rk.addKey(context.data, key, value)
  }
}

function transitionFactory2(options) {
  return function(context) {
    _initialize2(context, options)

    const game = context.state

    // If a transition sometimes wants to short-circuit itself and finish before going
    // through all of its steps, it can set this flag on the context to exit early.
    if (context.data.done) {
      return context.done()
    }

    if (context.response) {
      let result

      // If there is a step specific response handler, use that
      const lastStep = context.data.completedSteps.slice(-1)[0]
      if (lastStep && options.steps.find(s => s.name === lastStep).resp) {
        result = options.steps.find(s => s.name === lastStep).resp(context)
      }

      // Otherwise, fallback to a global response handler
      else {
        result = options.responseHandler(context)
      }

      // If a result was returned, that means that the response handler set up the next
      // transition in the statemachine, and we should break here. Otherwise, continue on to
      // the next step in this transition.
      if (result) {
        return result
      }
    }

    // Go through all the steps until the first step that hasn't been completed, and
    // execute that step. If that step returns a value, that means it has set up the
    // next transition. Otherwise, continue going through the steps of this transition.
    for (const step of options.steps) {
      if (context.data.completedSteps.includes(step.name)) {
        continue
      }
      else {
        game.rk.push(context.data.completedSteps, step.name)
        const result = step.func(context)
        if (result) {
          return result
        }
        else {
          continue
        }
      }
    }

    // Once all steps have been completed, this transition is finished.
    return context.done()
  }
}

function _initialize2(context, options) {
  if (context.data.initialized) {
    return
  }

  const game = context.state

  game.rk.addKey(context.data, 'initialized', true)
  game.rk.addKey(context.data, 'done', false)
  game.rk.addKey(context.data, 'completedSteps', [])

  if (options.data) {
    for (const [key, value] of options.data) {
      game.rk.addKey(context.data, key, value)
    }
  }
}
