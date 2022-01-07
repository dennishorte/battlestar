module.exports = function(context) {
  const { game, actor } = context
  const { cards, dest } = context.data

  const destZone = game.getZoneByName(dest)

  if (cards.length === 0) {
    game.mLog({
      template: '{player} transfers nothing',
      args: {
        player: actor
      }
    })
  }

  else {
    for (const card of cards) {
      const zone = game.getZoneByCard(card)
      game.mMoveCard(zone, destZone, card)
      game.mLog({
        template: '{player} transfers {card} from {zone1} to {zone2}',
        args: {
          player: actor,
          card,
          zone1: zone,
          zone2: destZone,
        }
      })
    }
  }

  return context.done()
}
