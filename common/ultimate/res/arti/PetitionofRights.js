module.exports = {
  name: `Petition of Rights`,
  color: `blue`,
  age: 4,
  expansion: `arti`,
  biscuits: `shcs`,
  dogmaBiscuit: `s`,
  dogma: [
    `I compel you to transfer a card from your score pile to my score pile for each top card with a {k} on your board.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const count = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('k'))
        .length
      game.actions.chooseAndTransfer(
        player,
        game.cards.byPlayer(player, 'score'),
        game.zones.byPlayer(leader, 'score'),
        { count },
      )
    }
  ],
}
