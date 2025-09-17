module.exports = {
  name: `International Prototype Metre Bar`,
  color: `green`,
  age: 7,
  expansion: `arti`,
  biscuits: `chcf`,
  dogmaBiscuit: `c`,
  dogma: [
    //    `Choose a value. Draw and meld a card of that value. Splay up the color of the melded card. If the number of cards of that color visible on your board is exactly equal to the card's value, you win. Otherwise, return the melded card.`
    `Choose a value. Draw and meld a card of that value. Splay up the color of the melded card. If the number of cards of that color visible on your board is exactly equal to the card's value, draw and score a {0}. Otherwise, return the melded card.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const age = game.actions.chooseAge(player)
      const card = game.actions.drawAndMeld(player, age)
      game.actions.splay(player, card.color, 'up')

      if (game.cards.byPlayer(player, card.color).length === card.getAge()) {
        game.actions.drawAndScore(player, game.getEffectAge(self, 10))
        /* throw new GameOverEvent({
         *   player,
         *   reason: self.name
         * }) */
      }
      else {
        game.actions.return(player, card)
      }
    }
  ],
}
