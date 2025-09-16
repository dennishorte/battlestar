
module.exports = {
  name: `Velcro Shoes`,
  color: `red`,
  age: 9,
  expansion: `arti`,
  biscuits: `ffih`,
  dogmaBiscuit: `f`,
  dogma: [
    `I compel you to transfer a {9} from your hand to my hand! If you do not, transfer a {9} from your score pile to my score pile! If you do neither, I win!`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const hand = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.getAge() === 9)
      const transferred = game.actions.chooseAndTransfer(player, hand, game.zones.byPlayer(leader, 'hand'))

      if (transferred && transferred.length > 0) {
        game.log.add({ template: 'A card was transferred' })
        return
      }

      const score = game
        .cards.byPlayer(player, 'score')
        .filter(card => card.getAge() === 9)
      const st = game.actions.chooseAndTransfer(player, score, game.zones.byPlayer(leader, 'score'))
      if (st && st.length > 0) {
        game.log.add({ template: 'A card was transferred' })
        return
      }

      game.youWin(leader, self.name)
    }
  ],
}
