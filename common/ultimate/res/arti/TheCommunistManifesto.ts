export default {
  name: `The Communist Manifesto`,
  color: `purple`,
  age: 7,
  expansion: `arti`,
  biscuits: `cchl`,
  dogmaBiscuit: `c`,
  dogma: [
    `For each player in the game, draw and reveal a {7}. Transfer one of the drawn cards to each other player's board. Meld the last, and self-execute it.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const players = game.players.startingWith(player)
      const cards = players.map(() => game.actions.drawAndReveal(player, game.getEffectAge(self, 7)))

      let remaining = cards
      let mine = null
      for (const target of players) {
        const title = `Choose a card to transfer to ${target.name}`
        const card = game.actions.chooseCard(player, remaining, { title })
        remaining = remaining.filter(other => !other.equals(card))

        const transferred = game.actions.transfer(player, card, game.zones.byPlayer(target, card.color))
        if (transferred && target === player) {
          mine = card
        }
      }

      if (mine) {
        game.aSelfExecute(self, player, mine)
      }
    }
  ],
}
