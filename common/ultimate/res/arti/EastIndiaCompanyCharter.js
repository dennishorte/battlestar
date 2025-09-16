module.exports = {
  name: `East India Company Charter`,
  color: `red`,
  age: 4,
  expansion: `arti`,
  biscuits: `cffh`,
  dogmaBiscuit: `f`,
  dogma: [
    `Choose a value other than {5}. Return all cards of that value from all score piles. For each player that returned cards, draw and score a {5}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const age = game.actions.chooseAge(player, [1,2,3,4, /*5,*/ 6,7,8,9,10])
      const toReturn = []
      const playerCards = {}
      for (const player of game.players.all()) {
        const cards = game
          .cards.byPlayer(player, 'score')
          .filter(card => card.getAge() === age)
        if (cards.length > 0) {
          toReturn.push(cards)
          playerCards[player.name] = cards
        }
      }

      const returned = game.actions.returnMany(player, toReturn.flat())

      let count = 0
      for (const [player, cards] of Object.entries(playerCards)) {
        if (cards.some(card => returned.includes(card))) {
          count += 1
        }
      }

      for (let i = 0; i < count; i++) {
        game.actions.drawAndScore(player, game.getEffectAge(self, 5))
      }
    }
  ],
}
