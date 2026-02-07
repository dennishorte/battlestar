module.exports = {
  id: "storage-barn-a006",
  name: "Storage Barn",
  deck: "minorA",
  number: 6,
  type: "minor",
  cost: {},
  category: "Building Resource Provider",
  text: "If you have the Well, Joinery, Pottery, and/or Basketmaker's Workshop, you immediately get 1 stone, 1 wood, 1 clay, and/or 1 reed, respectively.",
  onPlay(game, player) {
    const improvements = player.majorImprovements || []
    if (improvements.includes('well')) {
      player.addResource('stone', 1)
      game.log.add({
        template: '{player} gets 1 stone from Storage Barn (Well)',
        args: { player },
      })
    }
    if (improvements.includes('joinery')) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Storage Barn (Joinery)',
        args: { player },
      })
    }
    if (improvements.includes('pottery')) {
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 clay from Storage Barn (Pottery)',
        args: { player },
      })
    }
    if (improvements.includes('basketmakers-workshop')) {
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 reed from Storage Barn (Basketmaker\'s Workshop)',
        args: { player },
      })
    }
  },
}
