const db = require('../models/db')
const slack = require('../utils/slack')

const NotificationService = {}

NotificationService.sendGameNotifications = async function(game) {
  // Skip notifications in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  const { settings } = game

  // Ensure we have the slack IDs for all players
  const players = await Promise.all((settings.players || []).map(p => db.user.findById(p._id)))

  const gameUrl = `http://${process.env.DOMAIN_HOST || 'localhost'}/game/${game._id}`
  const gameTitle = `${settings.game}: ${settings.name}`
  const gameLink = `<${gameUrl}|${gameTitle}>`

  // If the game is over, notify all players
  if (game.checkGameIsOver()) {
    const resultMessage = game.getResultMessage ? game.getResultMessage() : ''
    const gameOverMessage = `Game over! ${gameLink}\n${resultMessage}`

    for (const player of players) {
      // Clear any pending notifications
      await db.notif.clear(player, game)
      // Send game over notification
      await _sendSlackMessage(player, gameOverMessage)
    }
    return
  }

  // For ongoing games, handle player-specific notifications
  for (const player of players) {
    // If this player just made a move, clear their notification throttle
    if (game.checkLastActorWas(player)) {
      await db.notif.clear(player, game)
      continue
    }

    // If it's this player's turn, check if we should notify them
    if (game.checkPlayerHasActionWaiting(player)) {
      // Check if notification should be throttled (don't spam players)
      const isThrottled = await db.notif.throttleOrSet(player, game)
      if (!isThrottled) {
        // Send "your turn" notification
        const turnMessage = `You're up! ${gameLink}`
        await _sendSlackMessage(player, turnMessage)
      }
    }
  }
}

async function _sendSlackMessage(player, message) {
  await slack.sendMessage(player, message)
}

module.exports = NotificationService
