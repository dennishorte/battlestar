module.exports = {
  id: "sheep-rug-e021",
  name: "Sheep Rug",
  deck: "minorE",
  number: 21,
  type: "minor",
  cost: { sheep: 1 },
  vps: 1,
  prereqs: { sheep: 4 },
  text: "You can use any \"Wish for Children\" action space, even if it is occupied by another player's person.",
  ignoresOccupancyFor: ["family-growth", "family-growth-urgent"],
}
