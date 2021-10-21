module.exports = {
  transitionFactory,
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
