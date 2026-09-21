module.exports = {
  name: `Navigation`,
  color: `green`,
  age: 4,
  expansion: `base`,
  biscuits: `hccc`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you transfer a {2} or {3} from your score pile, if it has any, to my score pile.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      game.actions.chooseAndTransfer(
        player,
        game.cards.byPlayer(player, 'score'),
        game.zones.byPlayer(leader, 'score'),
        { filter: card => card.getAge() === 2 || card.getAge() === 3 }
      )
    }
  ],
}
