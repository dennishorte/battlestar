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
      const secrets = game.actions.chooseHighest(player, game.cards.byPlayer(player, 'safe'), 2, {
        title: 'Choose secrets to transfer',
      })
      game.actions.transferMany(player, secrets, game.zones.byPlayer(leader, 'safe'))

      const score = game.actions.chooseHighest(player, game.cards.byPlayer(player, 'score'), 2, {
        title: 'Choose score to transfer',
      })
      game.actions.transferMany(player, score, game.zones.byPlayer(leader, 'score'))

      const toMeld = game.actions.chooseLowest(player, game.cards.byPlayer(player, 'score'), 2, {
        title: 'Choose score to meld',
      })
      game.actions.meldMany(player, toMeld)
    },
  ],
}
