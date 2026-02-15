module.exports = {
  id: "garden-designer-c099",
  name: "Garden Designer",
  deck: "occupationC",
  number: 99,
  type: "occupation",
  players: "1+",
  text: "At the start of scoring, you can place food in empty fields. You get 1/2/3 bonus points for each field in which you place 1/4/7 food.",
  // Note: onScoring hook is not fired by the engine.
  onScoring(game, player) {
    void(game, player)
  },
}
