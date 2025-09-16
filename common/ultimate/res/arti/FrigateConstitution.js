module.exports = {
  name: `Frigate Constitution`,
  color: `red`,
  age: 6,
  expansion: `arti`,
  biscuits: `hfff`,
  dogmaBiscuit: `f`,
  dogma: [
    `I compel you to reveal a card in your hand! If you do, and its value is equal to the value of any of my top cards, return it and all cards of its color from your board.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const card = game.actions.chooseCard(player, game.getCardsByZone(player, 'hand'))

      if (card) {
        game.mReveal(player, card)

        const matchingAges = game
          .getTopCards(leader)
          .filter(other => other.getAge() === card.age)

        if (matchingAges.length === 0) {
          game.log.add({
            template: "Card age does not match any of {player}'s top cards",
            args: { player: leader }
          })
        }
        else {
          const toReturn = game.getCardsByZone(player, card.color)
          toReturn.push(card)
          game.actions.returnMany(player, toReturn)
        }
      }
    }
  ],
}
