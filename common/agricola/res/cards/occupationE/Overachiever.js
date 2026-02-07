module.exports = {
  id: "overachiever-e130",
  name: "Overachiever",
  deck: "occupationE",
  number: 130,
  type: "occupation",
  players: "1+",
  text: "Each time you use a \"Wish for Children\" action space, you can play 1 additional improvement by paying its cost less 1 resource of your choice.",
  onAction(game, player, actionId) {
    if (actionId === 'family-growth' || actionId === 'family-growth-urgent') {
      game.actions.offerOverachieverImprovement(player, this)
    }
  },
}
