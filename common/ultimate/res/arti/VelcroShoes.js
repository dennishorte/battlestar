const { GameOverEvent } = require('../../../lib/game.js')

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
        .getCardsByZone(player, 'hand')
        .filter(card => card.getAge() === 9)
      const transferred = game.aChooseAndTransfer(player, hand, game.getZoneByPlayer(leader, 'hand'))

      if (transferred && transferred.length > 0) {
        game.mLog({ template: 'A card was transferred' })
        return
      }

      const score = game
        .getCardsByZone(player, 'score')
        .filter(card => card.getAge() === 9)
      const st = game.aChooseAndTransfer(player, score, game.getZoneByPlayer(leader, 'score'))
      if (st && st.length > 0) {
        game.mLog({ template: 'A card was transferred' })
        return
      }

      throw new GameOverEvent({
        player: leader,
        reason: self.name
      })
    }
  ],
}
