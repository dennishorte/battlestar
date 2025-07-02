module.exports = {
  name: `Hacking`,
  color: `blue`,
  age: 10,
  expansion: `usee`,
  biscuits: `hiis`,
  dogmaBiscuit: `i`,
  dogma: [
    `I demand you transfer your two highest secrets to my safe! Transfer the two highest cards in your score pile to my score pile! Meld the two lowest cards from your score pile!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const secrets = game.aChooseHighest(player, game.getCardsByZone(player, 'safe'), 2, {
        title: 'Choose secrets to transfer',
      })
      game.aTransferMany(player, secrets, game.getZoneByPlayer(leader, 'safe'))

      const score = game.aChooseHighest(player, game.getCardsByZone(player, 'score'), 2, {
        title: 'Choose score to transfer',
      })
      game.aTransferMany(player, score, game.getZoneByPlayer(leader, 'score'))

      const toMeld = game.aChooseLowest(player, game.getCardsByZone(player, 'score'), 2, {
        title: 'Choose score to meld',
      })
      game.aMeldMany(player, toMeld)
    },
  ],
}
