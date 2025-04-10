const db = require('../models/db.js')
const slack = require('../util/slack.js')


function _makeGameLink(game) {
  const gameKind = game.settings.game
  const gameName = game.settings.name

  const domain_host = process.env.DOMAIN_HOST
  const link = `<http://${domain_host}/game/${game._id}|${gameKind}: ${gameName}>`

  return link
}

function _userJustFinishedTurn(user, game) {
  // The user just submitted an action AND it is no longer the user's turn.
  return game.checkLastActorWas(user) && !game.checkPlayerHasActionWaiting(user)
}

function _isUserTurn(user, game) {
  // The game is waiting for input from the user
  return game.checkPlayerHasActionWaiting(user)
}

async function _sendGameOverNotification(user, game) {
  const link = _makeGameLink(game)
  const resultMessage = game.getResultMessage()
  const message = `Game over! ${link}\n${resultMessage}`

  await sendUserNotification(user, message)
}

async function _sendYourTurnNotification(user, game) {
  const link = _makeGameLink(game)
  const message = `You're up! ${link}`

  await sendUserNotification(user, message)
}

async function sendGameNotifications(game) {
  // Never send notifications in development. (It's super irritating.)
  if (process.env.NODE_ENV !== 'production') {
    return
  }


  for (const user of game.settings.players) {
    if (game.checkIsNewGame()) {
      // Assume no notifications have been sent yet. Let all players know that a new game has started.
      const link = _makeGameLink(game)
      const message = `A new game has started! ${link}`
      await sendUserNotification(user, message)
    }
    else if (game.checkGameIsOver()) {
      // Clear the notification throttle.
      // If something gets undone, and the game is restarted, want to make sure the user
      // gets that notification.
      await db.notif.clear(user, game)

      await _sendGameOverNotification(user, game)
    }
    else if (_userJustFinishedTurn(user, game)) {
      // Clear their notification block so they'll be told as soon as the other player takes their turn.
      // The goal of this throttling is really to prevent multiple messages from a single game, like a
      // magic draft, which can often update several times a in a few minutes.
      await db.notif.clear(user, game)
    }
    else if (_isUserTurn(user, game)) {
      // Attempt to set the throttle for this user/game pair.
      // If an existing throttle exists, do not send a new notification.
      const isThrottled = await db.notif.throttleOrSet(user, game)
      if (!isThrottled) {
        await _sendYourTurnNotification(user, game)
      }
    }
    else {
      // Do nothing
    }
  }
}

async function sendUserNotification(user, msg) {
  slack.sendMessage(user, msg)
}

module.exports = {
  sendGameNotifications,
  sendUserNotification,
}
