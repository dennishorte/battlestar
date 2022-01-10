const { transitionFactory2 } = require('../../lib/transitionFactory.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'initialize',
      func: initialize,
    },
    {
      name: 'returnAchievement',
      func: returnAchievement,
    },
    {
      name: 'claimAchievement',
      func: claimAchievement,
    },
    {
      name: 'gainEffect',
      func: gainEffect,
    }
  ],
})

function initialize(context) {
  const { game, actor } = context
  const { decree } = context.data

  const zone = game.getZoneByCard(decree)

  let returnAchievement = false
  let claimAchievement = false
  let gainEffect = false

  if (zone.owner && zone.owner === actor.name) {
    gainEffect = true
  }

  // Return the achievement to the achievement zone.
  else if (zone.owner && zone.owner !== actor.name) {
    returnAchievement = true
  }

  // Claim the achievement and gain the effects.
  else {
    util.assert(zone.name === 'achievements')
    claimAchievement = true
    gainEffect = true
  }

  game.rk.addKey(context.data, 'returnAchievement', returnAchievement)
  game.rk.addKey(context.data, 'claimAchievement', claimAchievement)
  game.rk.addKey(context.data, 'gainEffect', gainEffect)
}

function returnAchievement(context) {
  const { game, actor } = context
  const { decree } = context.data

  return game.aReturnAchievement(context, actor, decree)
}

function claimAchievement(context) {
  const { game, actor } = context
  const { decree } = context.data

  return game.aClaimAchievement(context, actor, decree)
}

function gainEffect(context) {
  const { game, actor } = context
  const { decree } = context.data


}
