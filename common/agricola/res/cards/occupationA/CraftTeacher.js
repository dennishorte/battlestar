module.exports = {
  id: "craft-teacher-a131",
  name: "Craft Teacher",
  deck: "occupationA",
  number: 131,
  type: "occupation",
  players: "1+",
  text: "Each time after you build the major improvement \"Joinery\", \"Pottery\", and \"Basketmaker's Workshop\", you can play up to 2 occupations without paying an occupation cost.",
  onBuildMajor(game, player, majorId) {
    if (majorId === 'joinery' || majorId === 'pottery' || majorId === 'basketmakers-workshop') {
      game.actions.offerFreeOccupations(player, this, 2)
    }
  },
}
