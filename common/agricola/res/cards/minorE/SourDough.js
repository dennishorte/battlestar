module.exports = {
  id: "sour-dough-e062",
  name: "Sour Dough",
  deck: "minorE",
  number: 62,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { occupations: 3, bakingImprovement: true },
  text: "Once per round, if all players have at least 1 person left to place, you can skip placing a person and take a \"Bake Bread\" action instead.",
  modifiesWorkerPlacement: 'sourDough',
}
