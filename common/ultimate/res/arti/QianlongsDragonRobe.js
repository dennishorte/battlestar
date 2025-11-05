module.exports = {
  name: `Qianlong's Dragon Robe`,
  color: `yellow`,
  age: 6,
  expansion: `arti`,
  biscuits: `hcss`,
  dogmaBiscuit: `s`,
  dogma: [
    `I compel you to transfer your top red card to my score pile. Transfer you top green card to my board. Transfer a yellow card from your score pile to mine. Transfer a purple card from your score pile to my hand.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const leaderScore = game.zones.byPlayer(leader, 'score')

      const redCard = game.cards.top(player, 'red')
      if (redCard) {
        game.actions.transfer(player, redCard, leaderScore)
      }
      else {
        game.log.add({
          template: '{player} has no red cards',
          args: { player }
        })
      }

      const greenCard = game.cards.top(player, 'green')
      if (greenCard) {
        game.actions.transfer(player, greenCard, game.zones.byPlayer(leader, 'green'))
      }
      else {
        game.log.add({
          template: '{player} has no green cards',
          args: { player }
        })
      }

      const yellowCards = game.cards.byPlayer(player, 'score').filter(card => card.color === 'yellow')
      game.actions.chooseAndTransfer(player, yellowCards, leaderScore)

      const purpleCards = game.cards.byPlayer(player, 'score').filter(card => card.color === 'purple')
      game.actions.chooseAndTransfer(player, purpleCards, game.zones.byPlayer(leader, 'hand'))
    }
  ],
}
