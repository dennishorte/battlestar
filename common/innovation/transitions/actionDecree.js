const { transitionFactory2 } = require('../../lib/transitionFactory.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'initialize',
      func: initialize,
    },
    {
      name: 'removeCards',
      func: removeCards,
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

  const logId = game.mLog({
    template: '{player} issues a {decree} decree',
    args: {
      player: actor,
      decree: decree,
    }
  })
  game.rk.put(context.data, 'parentLogId', logId)
}

function removeCards(context) {
  const { game, actor } = context
  return game.aRemoveMany(context, actor, game.getHand(actor).cards)
}

function returnAchievement(context) {
  const { game, actor } = context
  const { decree, returnAchievement } = context.data

  if (returnAchievement) {
    return game.aReturnAchievement(context, actor, decree)
  }
}

function claimAchievement(context) {
  const { game, actor } = context
  const { decree, claimAchievement } = context.data

  if (claimAchievement) {
    return game.aClaimAchievement(context, actor, decree)
  }
}

function gainEffect(context) {
  const { game, actor } = context
  const { decree, gainEffect } = context.data

  if (gainEffect) {
    return context.push('action-dogma-one-effect', {
      effect: {
        card: decree,
        kind: 'decree',
        implIndex: 0,
        leader: actor.name,
      },
      sharing: [],
      demanding: [],
      biscuits: {},
    })
  }
}
