const { transitionFactory } = require('./factory.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory(
  {
    checkedPrecommit: false,
  },
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const check = game.getSkillCheck()
  const currentValue = check.value

  const helpLevel = _checkDeclareEmergencyHelps(check)

  if (!helpLevel) {
    return context.done()
  }

  // If someone pre-committed to using declare emergency, just go for it.
  if (!context.data.checkedPrecommit) {
    game.rk.put(context.data, 'checkedPrecommit', true)
    const someonePrecommitted = Object
      .values(check.flags)
      .filter(f => f.useDeclareEmergency)
      .length > 0
    if (someonePrecommitted) {
      _applyDeclareEmergency(context)
      return context.done()
    }
  }

  // No pre-commits. Give people a last chance to try.
  const helpOptions = game
    .getPlayerAll()
    .filter(p => !game.checkPlayerIsRevealedCylon(p))
    .filter(p => game.getCardsKindByPlayer('skill', p).length > 0)
    .filter(p => !check.flags[p.name].submitted.declareEmergency)
    .map(p => {
      const options = []

      if (game.getCardsKindByPlayer('skill', p).find(c => c.name === 'Declare Emergency')) {
        options.push('Use Declare Emergency')
      }

      options.push('Do Nothing')

      return {
        actor: p.name,
        actions: [{
          name: 'Use Declare Emergency',
          description: `Using this will change the result to ${helpLevel}`,
          options
        }]
      }
    })

  if (helpOptions.length > 0) {
    return context.waitMany(helpOptions)
  }
  else {
    _applyDeclareEmergency(context)
    return context.done()
  }
}

function handleResponse(context) {
  const game = context.state
  const check = game.getSkillCheck()
  const player = game.getPlayerByName(context.response.actor)
  const flags = check.flags[player.name]
  const option = context.response.option[0]

  util.assert(!flags.submitted.declareEmergency, `${player.name} already submitted`)

  game.rk.put(flags.submitted, 'declareEmergency', true)

  if (option === 'Use Declare Emergency') {
    game.rk.put(flags, 'useDeclareEmergency', true)
  }

  return generateOptions(context)
}

function _applyDeclareEmergency(context) {
  const game = context.state
  const check = game.getSkillCheck()
  const playersInAddCardsOrder = game.getPlayerAllFrom(game.getPlayerNext())

  for (const player of playersInAddCardsOrder) {
    const flags = check.flags[player.name]
    if (flags.useDeclareEmergency) {
      const declareEmergencies = game
        .getCardsKindByPlayer('skill', player)
        .filter(c => c.name === 'Declare Emergency')
        .sort((l, r) => l.value - r.value)

      game.aUseSkillCardByName(player, 'Declare Emergency')
      game.rk.put(check, 'declareEmergency', true)
      game.rk.put(check, 'total', check.total + 2)
      break
    }
  }
}

function _checkDeclareEmergencyHelps(check) {
  const { total, passValue, partialValue } = check

  if (
    total < check.passValue
    && total + 2 >= check.passValue
  ) {
    return 'pass'
  }

  // Would help for partial pass
  else if (
    check.partialValue
    && total < check.partialValue
    && total + 2 >= check.partialValue
  ) {
    return 'partial'
  }

  return false
}
