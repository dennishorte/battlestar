module.exports = {
  name: `Petition of Right`,
  color: `blue`,
  age: 4,
  expansion: `arti`,
  biscuits: `shcs`,
  dogmaBiscuit: `s`,
  dogma: [
    `I compel you to transfer a card from your score pile to my score pile for every color with {k} on your board.`,
    `Junk an available achievement of value equal to the number of {k} on your board.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const count = game
        .zones
        .colorStacks(player)
        .filter(zone => zone.biscuits().k > 0)
        .length
      game.actions.chooseAndTransfer(
        player,
        game.cards.byPlayer(player, 'score'),
        game.zones.byPlayer(leader, 'score'),
        { count },
      )
    },

    (game, player) => {
      const biscuits = player.biscuits().k
      game.actions.junkAvailableAchievement(player, biscuits)
    },
  ],
}
