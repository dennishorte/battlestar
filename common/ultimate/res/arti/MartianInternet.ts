import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Martian Internet`,
  color: `blue`,
  age: 11,
  expansion: `arti`,
  biscuits: `ppph`,
  dogmaBiscuit: `p`,
  dogma: [
    //    `Start a new game, ignoring all players' current cards and without shuffling, each player drawing and melding a {9} to begin, the winner then transfering their cards to this game and junking each other player's other cards from that game.`
    `Draw and meld an Artifacts card of any value. If the melded card has {l}, and you are the single player with the most {l}, you win.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const age = game.actions.chooseAge(player, game.getAges())
      const card = game.actions.draw(player, { age, exp: 'arti' })
      game.actions.meld(player, card)

      const otherLeaves = game
        .players
        .other(player)
        .map(player => player.biscuits().l)

      const playerLeaves = player.biscuits().l
      const playerHasMostLeaves = otherLeaves.every(l => l < playerLeaves)

      if (card.checkHasBiscuit('l') && playerHasMostLeaves) {
        game.youWin(player, self.name)
      }

    },
  ],
} satisfies AgeCardData
