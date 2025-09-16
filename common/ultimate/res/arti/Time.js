module.exports = {
  name: `Time`,
  color: `yellow`,
  age: 8,
  expansion: `arti`,
  biscuits: `hiis`,
  dogmaBiscuit: `i`,
  dogma: [
    `I compel you to transfer a non-yellow card with a {i} from your board to my board! If you do, repeat this effect!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      while (true) {
        const choices = game
          .getTopCards(player)
          .filter(card => card.color !== 'yellow' && card.checkHasBiscuit('i'))
        const card = game.actions.chooseCard(player, choices)
        if (card) {
          game.actions.transfer(player, card, game.getZoneByPlayer(leader, card.color))
          continue
        }
        else {
          game.log.add({ template: 'No card was transferred' })
          break
        }
      }
    }
  ],
}
