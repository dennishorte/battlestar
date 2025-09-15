module.exports = {
  name: `Perfume`,
  color: `blue`,
  age: 1,
  expansion: `echo`,
  biscuits: `&k1h`,
  dogmaBiscuit: `k`,
  echo: [`Draw and tuck a {1}. If it has {k}, repeat this effect.`],
  dogma: [
    `I demand you transfer a top card of different value from any top card on my board from your board to mine! If you do, draw and meld a card of equal value!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const leaderAges = game
        .cards.tops(leader)
        .map(card => card.getAge())
      const choices = game
        .cards.tops(player)
        .filter(card => !leaderAges.includes(card.getAge()))
      const card = game.actions.chooseCard(player, choices, { title: 'Choose a card to transfer' })
      if (card) {
        const transferred = game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
        if (transferred) {
          game.actions.drawAndMeld(player, card.getAge())
        }
      }
    }
  ],
  echoImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndTuck(player, game.getEffectAge(self, 1))
        if (!card.checkHasBiscuit('k')) {
          break
        }
      }
    }
  ],
}
