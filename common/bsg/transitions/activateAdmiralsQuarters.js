const { repeatSteps, transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'choosePlayer',
      func: _choosePlayer,
      resp: _choosePlayerHandler,
    },
    {
      name: 'autoAdjustDifficulty',
      func: _autoAdjustDifficulty,
    },
    ...repeatSteps(bsgutil.MAX_PLAYERS, [
      {
        name: 'adjustDifficulty',
        func: _adjustDifficulty,
        resp: _adjustDifficultyHandler,
      }
    ]),
    {
      name: 'beginSkillCheck',
      func: _beginSkillCheck,
    },
  ],
})

function _choosePlayer(context) {
  const game = context.state

  // Discard the quorum card
  const card = game.getCardByName('Accept Prophecy')
  game.mDiscard(card)

  const options = game
    .getPlayerAll()
    .filter(p => p.name !== context.data.playerName)
    .filter(p => game.getZoneByPlayerLocation(p).name !== 'locations.brig')
    .filter(p => !game.checkPlayerIsRevealedCylon(p))
    .map(p => p.name)

  return context.wait({
    actor: context.data.playerName,
    actions: [{
      name: 'Choose a Player',
      options,
    }]
  })
}

function _choosePlayerHandler(context) {
  const game = context.state
  const chosenPlayerName = bsgutil.optionName(context.response.option[0])
  game.rk.addKey(context.data, 'chosenPlayerName', chosenPlayerName)
  game.rk.addKey(context.data, 'passValue', 7)
}

function _autoAdjustDifficulty(context) {
  const game = context.state
  const { chosenPlayerName } = context.data
  const chosenPlayer = game.getPlayerByName(chosenPlayerName)

  // Accept Prophechy
  if (
    game.checkPlayerIsPresident(chosenPlayer)
    && game.checkEffect('Accept Prophecy')
  ) {
    game.rk.put(context.data, 'passValue', context.data.passValue + 2)
    game.mDiscard(game.getCardByName('Accept Prophecy'))
  }

  // Kara Thrace
  if (game.chosenPlayerName === "Kara 'Starbuck' Thrace") {
    game.rk.put(context.data, 'passValue', context.data.passValue - 3)
  }
}

function _adjustDifficulty(context) {
  const game = context.state

  if (!context.data.adjustingPlayer) {
    game.rk.addKey(context.data, 'adjustingPlayer', game.getPlayerNext().name)
    game.rk.addKey(context.data, 'allPlayersComplete', false)
  }
  else if (context.data.allPlayersComplete) {
    return
  }

  const player = game.getPlayerByName(context.data.adjustingPlayer)
  const options = []

  if (game.getCardCharacterByPlayer(player).name === 'Saul Tigh') {
    options.push({
      name: 'Cylon Hatred',
      description: 'Reduce difficulty by 3'
    })
  }

  if (game.checkPlayerIsArbitrator(player)) {
    options.push({
      name: 'Arbitrate',
      options: [
        {
          name: 'in favor of accused',
          description: 'Increase difficulty by 3',
        },
        {
          name: 'against accused',
          description: 'Reduce difficulty by 3',
        }
      ]
    })
  }

  if (options.length > 0) {
    const max = options.length

    options.push({
      name: 'Do Nothing',
      exclusive: true
    })

    return context.wait({
      actor: player.name,
      actions: [{
        name: 'Adjust Difficulty',
        max,
        options,
      }]
    })
  }
  else {
    _advanceAdjustDifficultyPlayer(context)
  }
}

function _adjustDifficultyHandler(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.adjustingPlayer)

  for (const opt of context.response.option) {
    const optionName = bsgutil.optionName(opt)

    if (optionName === 'Do Nothing') {
      break
    }

    else if (optionName === 'Cylon Hatred') {
      game.mLog({
        template: '{player} uses Cylon Hatred to reduce the difficulty by 3',
        args: {
          player: player.name
        }
      })
      game.rk.put(context.data, 'passValue', context.data.passValue - 3)
    }

    else if (optionName === 'Arbitrate') {
      const favor = bsgutil.optionName(opt.option[0])
      const adjust = (favor === 'in favor of accused') ? 3 : -3
      game.mLog({
        template: `{player} uses Arbitration ${favor} to adjust the difficulty by ${adjust}`,
        args: {
          player: player.name
        }
      })
      game.rk.put(context.data, 'passValue', context.data.passValue + adjust)
      game.mSetPlayerFlag(player, 'isArbitrator', false)
      game.mDiscard(game.getCardByName('Assign Arbitrator'))
    }

    else {
      throw new Error(`Unhandled option name: ${optionName}`)
    }
  }

  _advanceAdjustDifficultyPlayer(context)
}

function _advanceAdjustDifficultyPlayer(context) {
  const game = context.state

  if (context.data.adjustingPlayer === game.getPlayerCurrentTurn().name) {
    game.rk.put(context.data, 'allPlayersComplete', true)
  }
  else {
    const nextPlayer = game.getPlayerFollowing(context.data.adjustingPlayer)
    game.rk.put(context.data, 'adjustingPlayer', nextPlayer.name)
  }
}

function _beginSkillCheck(context) {
  const game = context.state
  const { chosenPlayerName, passValue } = context.data

  game.mSetSkillCheck({
    name: `Send ${chosenPlayerName} to the brig`,
    skills: ['leadership', 'tactics'],
    passValue: passValue,
    partialValue: 0,
    passEffect: `${chosenPlayerName} is sent to the brig`,
    partialEffect: '',
    failEffect: '',
    script: {
      pass: [{
        kind: 'move',
        actor: chosenPlayerName,
        location: 'Brig',
      }],
      fail: [],
    }
  })
  return context.push('skill-check')
}
