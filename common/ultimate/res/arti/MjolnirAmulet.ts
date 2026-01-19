export default {
  name: `Mjolnir Amulet`,
  color: `red`,
  age: 3,
  expansion: `arti`,
  biscuits: `hkks`,
  dogmaBiscuit: `k`,
  dogma: [
    `I compel you to choose a top card on your board! Transfer all cards of that card's color from your board to my score pile!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const card = game.actions.chooseCard(player, game.cards.tops(player))
      if (card) {
        game.actions.transferMany(
          player,
          game.cards.byPlayer(player, card.color),
          game.zones.byPlayer(leader, 'score'),
          { ordered: true },
        )
      }
      else {
        game.log.add({
          template: '{player} chooses nothing',
          args: { player }
        })
      }
    }
  ],
}
