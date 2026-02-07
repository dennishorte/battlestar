module.exports = {
  id: "store-of-experience-b005",
  name: "Store of Experience",
  deck: "minorB",
  number: 5,
  type: "minor",
  cost: {},
  category: "Building Resource Provider",
  text: "If you have 0-3/4/5/6-7 occupations left in hand, you immediately get 1 stone/reed/clay/wood.",
  onPlay(game, player) {
    const occsInHand = player.getOccupationsInHand().length
    let resource = null
    if (occsInHand >= 6) {
      resource = 'wood'
    }
    else if (occsInHand === 5) {
      resource = 'clay'
    }
    else if (occsInHand === 4) {
      resource = 'reed'
    }
    else {
      resource = 'stone'
    }
    player.addResource(resource, 1)
    game.log.add({
      template: '{player} gets 1 {resource} from Store of Experience',
      args: { player, resource },
    })
  },
}
