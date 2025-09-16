module.exports = {
  name: `Charter of Liberties`,
  color: `blue`,
  age: 3,
  expansion: `arti`,
  biscuits: `sshk`,
  dogmaBiscuit: `s`,
  dogma: [
    `Tuck a card from your hand. If you do, splay left its color, then choose a (different) splayed color on any player's board. Execute all of that color's top card's non-demand dogma effects, without sharing.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'))

      if (cards && cards.length > 0) {
        const card = cards[0]
        game.aSplay(player, card.color, 'left')

        const choices = game
          .getPlayerAll()
          .flatMap(player => game
            .utilColors()
            .map(color => game.getZoneByPlayer(player, color))
            .filter(zone => zone.splay !== 'none')
          )
          .filter(zone => !zone.cards().includes(card))
          .map(zone => zone.cards()[0])
        const choice = game.aChooseCard(player, choices)
        if (choice) {
          game.aCardEffects(player, choice, 'dogma')
        }
      }
    }
  ],
}
