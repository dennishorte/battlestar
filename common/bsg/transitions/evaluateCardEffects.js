const { transitionFactory } = require('./factory.js')
const bsgutil = require('../util.js')

module.exports = transitionFactory(
  {
    effectIndex: 0,
  },
  generateOptions,
  () => { throw new Error('There should never be a response to evaluate-card-effect') },
)

function generateOptions(context) {
  const game = context.state
  const card = game.getCardById(context.data.cardId)
  const effectKey = context.data.effectKey
  const details = card.script[effectKey]
  const effects = Array.isArray(details) ? details : details.effect
  const effectIndex = context.data.effectIndex

  // Our first time visiting this function
  if (effectIndex === 0) {
    game.rk.sessionStart(session => {
      game.mLog({
        template: 'Evaluating {key} clause of {card}',
        args: {
          card: card,
          key: effectKey,
        }
      })
    })

    if (details.dieRoll && !bsgutil.rollDieResult(details.dieRoll)) {
      game.rk.sessionStart(() => {
        game.mLog({ template: "Die roll didn't match; no effect" })
      })
      return context.done()
    }
  }

  // All effects have been evaluated
  else if (effectIndex >= effects.length) {
    return context.done()
  }

  // Mark that next time we visit this function, we should do the next index
  game.rk.sessionStart(session => {
    session.increment(context.data, 'effectIndex')
  })

  const result = _evaluateEffect(game, effects[effectIndex])

  // Pause and wait for humans to decide something
  if (result && result.push) {
    return context.push(result.push.transition, result.push.payload)
  }

  // Go on to the next iteration
  else {
    return generateOptions(context)
  }
}

function _evaluateEffect(game, effect) {
  const kind = (typeof effect === 'string') ? effect : effect.kind

  if (kind === 'choice') {
    throw new Error('not implemented')
  }

  else if (kind === 'civilianDestroyed') {
    const civilianBag = game.getZoneByName('decks.civilian')
    for (let i = 0; i < effect.count; i++) {
      if (civilianBag.cards.length > 0) {
        const civilian = civilianBag.cards[0]
        game.aDestroyCivilian(civilian)
      }
    }
  }

  else if (kind === 'counter') {
    const { counter, amount } = effect
    game.rk.sessionStart(() => {
      game.mAdjustCounterByName(counter, amount)
    })
  }

  else if (kind === 'deploy') {
    game.aDeployShips(effect.ships)
  }

  else if (kind === 'discardSkills') {
    const { actor, count } = effect
    const player = game.getPlayerByDescriptor(actor)
    return {
      push: {
        transition: 'discard-skill-cards',
        payload: {
          playerName: player.name,
          count: count,
        }
      }
    }
  }

  else if (kind === 'move') {
    const { actor, location } = effect
    const player = game.getPlayerByDescriptor(actor)
    const locationZone = game.getZoneByLocationName(location)
    game.mMovePlayer(player, locationZone)
  }

  else if (kind === 'title') {
    const { title, assignTo } = effect
    const player = game.getPlayerByDescriptor(assignTo)
    if (title === 'Admiral') {
      game.aAssignAdmiral(player)
    }
    else if (title === 'President') {
      game.aAssignPresident(player)
    }
    else {
      throw new Error(`Unknown title: ${name}`)
    }
  }

  else {
    throw new Error(`Unhandled script kind: ${kind}`)
  }
}
