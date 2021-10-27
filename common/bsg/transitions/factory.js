module.exports = {
  markDone,
  stepFactory,
  transitionFactory,
}

function markDone(context) {
  const game = context.state
  game.rk.sessionStart(session => {
    session.put(context.data, 'done', true)
  })
}

function stepFactory(steps, options) {
  options = options || {}

  return function(context) {
    _initialize(context, { steps, stepIndex: 0 })

    const game = context.state

    if (context.data.stepIndex < context.data.steps.length) {
      const step = context.data.steps[context.data.stepIndex]
      game.rk.sessionStart(session => {
        session.put(context.data, 'stepIndex', context.data.stepIndex + 1)
      })

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
  const game = context.state

  if (context.data.initialized) {
    return
  }

  game.rk.sessionStart(session => {
    session.addKey(context.data, 'initialized', true)

    // Often used by transition to show they have no more work, and are just waiting for
    // child transitions to complete.
    session.addKey(context.data, 'done', false)

    for (const [key, value] of Object.entries(data)) {
      session.addKey(context.data, key, value)
    }
  })
}
