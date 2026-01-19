import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `East India Company Charter`,
  color: `red`,
  age: 4,
  expansion: `arti`,
  biscuits: `cffh`,
  dogmaBiscuit: `f`,
  dogma: [
    `Choose a value other than {5}. Return all cards of that value from all score piles. For each score pile from which cards were returned, draw and score a {5}. If you score only {5}s, junk all cards in the deck of the chosen value.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const choices = game.getAges().filter(x => x !== game.getEffectAge(self, 5))
      const age = game.actions.chooseAge(player, choices)
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
      for (const [, cards] of Object.entries(playerCards)) {
        if (cards.some(card => returned.includes(card))) {
          count += 1
        }
      }

      const scored = []
      for (let i = 0; i < count; i++) {
        const card = game.actions.drawAndScore(player, game.getEffectAge(self, 5))
        scored.push(card)
      }

      if (scored.every(card => card.getAge() === game.getEffectAge(self, 5))) {
        game.actions.junkDeck(player, age)
      }
    }
  ],
} satisfies AgeCardData
