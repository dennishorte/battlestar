module.exports = {
  name: `Bicycle`,
  color: `green`,
  age: 7,
  expansion: `base`,
  biscuits: `ccih`,
  dogmaBiscuit: `c`,
  dogma: [
    `You may exchange all the cards in your hand with all the cards in your score pile. If you exchange one, you must exchange them all.`
  ],
  dogmaImpl: [
    (game, player) => {
      const decision = game.actions.chooseYesNo(player, 'Exchange your hand and score pile?')
      if (decision) {
        game.aExchangeZones(
          player,
          game.getZoneByPlayer(player, 'hand'),
          game.getZoneByPlayer(player, 'score'),
        )
      }
      else {
        game.log.addDoNothing(player)
      }
    }
  ],
}
