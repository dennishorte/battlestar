module.exports = {
  name: `Excalibur`,
  color: `red`,
  age: 3,
  expansion: `arti`,
  biscuits: `chkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I compel your to transfer a top card of higher value than my top card of the same color from your board to my board!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game
        .utilColors()
        .map(color => {
          const playerTop = game.getTopCard(player, color)
          const leaderTop = game.getTopCard(leader, color)

          if (!playerTop) {
            return undefined
          }
          else if (!leaderTop) {
            return playerTop
          }
          else if (playerTop.getAge() > leaderTop.getAge()) {
            return playerTop
          }
          else {
            return undefined
          }
        })
        .filter(card => !!card)

      const card = game.actions.chooseCard(player, choices)
      if (card) {
        game.actions.transfer(player, card, game.getZoneByPlayer(leader, card.color))
      }
    }
  ],
}
