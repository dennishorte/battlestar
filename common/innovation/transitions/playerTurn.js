const { transitionFactory2 } = require('../../lib/transitionFactory.js')

const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'checkpoint',
      func: checkpoint,
    },
    {
      name: 'artifact',
      func: artifact,
      resp: artifactResp,
    },
    {
      name: 'choose1',
      func: choose1,
      resp: chooseResp,
    },
    {
      name: 'choose2',
      func: choose2,
      resp: chooseResp,
    },
    {
      name: 'turn-complete',
      func: turnComplete,
    },
  ],
})

function checkpoint(context) {
  const { game, actor } = context
  const logId = game.mLog({
    template: '{player} turn {count}',
    args: {
      player: actor.name,
      count: game.getTurnRound(),
    }
  })
  game.rk.addKey(context.data, 'parentLogId', logId)
  game.rk.checkpoint('Player Turn')
}

function artifact(context) {
  const { game, actor } = context
  const artifact = game.getArtifact(actor)

  if (artifact) {
    game.mLog({
      template: 'Free artifact action',
    })
    return context.wait({
      actor: actor.name,
      name: 'Artifact on Display',
      options: [
        {
          name: 'Artifact Dogma',
          kind: 'dogma-artifact',
          card: artifact.id,
        },
        {
          name: 'Return Artifact',
          kind: 'return-artifact',
          card: artifact.id,
        },
        {
          name: 'Appreciate its Beauty',
          kind: 'do nothing',
        },
      ]
    })
  }
}

function artifactResp(context) {

}

function choose1(context) {
  return _choose(context, 1)
}

function choose2(context) {
  const totalActions = _numberOfActions(context)
  if (totalActions < 2) {
    return
  }

  return _choose(context, 2)
}

function chooseResp(context) {
  const { game, actor, options } = context
  const action = options[0]
  const item = game.utilOptionName(context.response.option[0].option[0])

  if (action === 'Standard Achievements') {
    return game.aClaimAchievementStandard(context, actor, item, true)
  }

  else if (action === 'Karma Achievements') {
    return game.aClaimAchievement(context, actor, item)
  }

  else if (action === 'Decree') {
    return game.aDecree(context, actor, item)
  }

  else if (action === 'Dogma') {
    return game.aDogma(context, actor, item)
  }

  else if (action === 'Inspire') {
    return game.aInspire(context, actor, item)
  }

  else if (action === 'Meld') {
    return game.aMeld(context, actor, item)
  }

  else {
    throw new Error(`Unhandled action type: ${action}`)
  }
}

function turnComplete(context) {
  const { game } = context
  game.mNextTurn()
}

function _choose(context, count) {
  const { game } = context
  game.mLog({
    template: `action ${count}`,
    classes: ['action-header', `action-${count}`],
  })

  const options = []

  _addAchieve(context, options)
  _addDecree(context, options)
  _addDogma(context, options)
  // _addDraw(context, options)
  // _addEndorse(context, options)
  _addInspire(context, options)
  _addMeld(context, options)

  const totalActions = _numberOfActions(context)

  return context.wait({
    actor: context.data.playerName,
    name: `Action (${count} of ${totalActions})`,
    options
  })
}

function _numberOfActions(context) {
  const { game } = context
  const numPlayersWithOneAction = Math.floor(game.getPlayerAll().length / 2)
  return game.getTurnCount() <= numPlayersWithOneAction ? 1 : 2
}

function _addAchieve(context, options) {
  const { game, actor } = context

  const available = game.getAvailableAchievements(actor)
  const standard = available
    .standard
    .filter(c => game.checkCanClaimAchievement(actor, c))

  if (standard.length > 0) {
    options.push({
      name: 'Standard Achievements',
      options: util.array.distinct(standard.map(c => c.age).sort())
    })
  }

  const karmas = available
    .karmas
    .filter(c => game.checkCanClaimAchievement(actor, c))

  if (karmas.length > 0) {
    options.push({
      name: 'Karma Achievements',
      options: util.array.distinct(game._serializeCardList(karmas).sort())
    })
  }
}

function _addDecree(context, options) {
  const { game, actor } = context
  const figs = game
    .getHand(actor)
    .cards
    .filter(card => game.getCardData(card).expansion === 'figs')

  const decreeOptions = []

  const figAges = game.utilSeparateByAge(figs)
  if (Object.keys(figAges).length >= 3) {
    figs
      .map(game.getCardData)
      .map(card => card.color)
      .map(game.utilColorToDecree)
      .forEach(decree => util.array.pushUnique(decreeOptions, decree))
  }

  if (figs.length >= 2) {
    game
      .getCardsByKarmaTrigger(actor, 'decree-for-two')
      .map(card => card.karmaImpl.find(impl => impl.trigger === 'decree-for-two').decree)
      .forEach(decree => util.array.pushUnique(decreeOptions, decree))
  }

  if (decreeOptions.length > 0) {
    decreeOptions.sort()
    options.push({
      name: 'Decree',
      options: decreeOptions
    })
  }
}

function _addDogma(context, options) {
  const { game, actor } = context

  const dogmaOptions = []

  for (const color of game.utilColors()) {
    const data = game.getCardTop(actor, color)
    if (data) {
      dogmaOptions.push(game.oDogma(data))
    }
  }

  if (dogmaOptions.length > 0) {
    options.push({
      name: 'Dogma',
      options: dogmaOptions
    })
  }
}

function _addInspire(context, options) {
  const { game, actor } = context

  const inspireOptions = []

  for (const color of game.utilColors()) {
    const zone = game.getZoneColorByPlayer(actor, color)
    for (const cardName of zone.cards) {
      const card = game.getCardData(cardName)
      if (card.karma.length > 0 && game.getBiscuitsRaw(card, zone.splay).includes('*')) {
        inspireOptions.push(color)
        break
      }
    }
  }

  if (inspireOptions.length > 0) {
    options.push({
      name: 'Inspire',
      options: inspireOptions
    })
  }
}

function _addMeld(context, options) {
  const { game, actor } = context

  const meldOptions = []

  for (const card of game.getHand(actor).cards) {
    meldOptions.push(game.oMeld(card))
  }

  options.push({
    name: 'Meld',
    options: meldOptions
  })
}
