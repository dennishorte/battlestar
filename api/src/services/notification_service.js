import db from '../models/db.js'
import notifications from '../notifications/index.js'

const NotificationService = {}

NotificationService.sendGameNotifications = async function(game) {
  if (process.env.NODE_ENV !== 'production' && !process.env.NOTIFICATIONS_DEV) {
    return
  }

  const { settings } = game

  // Ensure we have the notification IDs for all players
  const players = await Promise.all((settings.players || []).map(p => db.user.findById(p._id)))

  const gameUrl = `http://${process.env.DOMAIN_HOST || 'localhost'}/game/${game._id}`
  const gameTitle = `${settings.game}: ${settings.name}`

  // If the game is over, notify all players
  if (game.checkGameIsOver()) {
    const resultMessage = game.getResultMessage ? game.getResultMessage() : ''

    for (const player of players) {
      // Clear any pending notifications
      await db.notif.clear(player, game)
      // Send game over notification
      await notifications.send(player, {
        text: 'Game over!',
        url: gameUrl,
        urlTitle: gameTitle,
        suffix: resultMessage,
      })
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
        await notifications.send(player, {
          text: "You're up!",
          url: gameUrl,
          urlTitle: gameTitle,
        })
      }
    }
  }
}

export default NotificationService
