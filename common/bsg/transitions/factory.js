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

    if (context.data.done) {
      return context.done()
    }

    if (context.response) {
      const result = options.responseHandler(context)
      if (result) {
        return result
      }
    }

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
