module.exports = {
  name: `City States`,
  color: `purple`,
  age: 1,
  expansion: `base`,
  biscuits: `hcck`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you transfer a top card with a {k} from your board to my board if you have at least four {k} on your board! If you do, draw a {1}.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const biscuits = game.getBiscuits()
      if (biscuits[player.name].k >= 4) {
        const choices = game
          .getTopCards(player)
          .filter(card => card.biscuits.includes('k'))

        const card = game.actions.chooseCard(player, choices)
        if (card) {
          const transferred = game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
          if (transferred) {
            game.actions.draw(player, { age: game.getEffectAge(self, 1) })
          }
          else {
            game.log.add({ template: 'no card was transferred' })
          }
        }
      }
    }
  ],
}
