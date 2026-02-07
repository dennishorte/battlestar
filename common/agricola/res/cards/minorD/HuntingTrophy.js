module.exports = {
  id: "hunting-trophy-d082",
  name: "Hunting Trophy",
  deck: "minorD",
  number: 82,
  type: "minor",
  cost: { boar: 1 },
  costAlternative: { cookBoar: true },
  vps: 1,
  category: "Building Resource Provider",
  text: "Improvements built on \"House Redevelopment\" cost you 1 building resource of your choice less. Fences built on \"Farm Redevelopment\" cost you a total of 3 wood less.",
  modifyHouseRedevelopmentCost(cost) {
    // Player chooses which resource to reduce by 1
    return { ...cost, buildingResourceDiscount: 1 }
  },
  modifyFarmRedevelopmentFenceCost(cost) {
    const newCost = { ...cost }
    if (newCost.wood) {
      newCost.wood = Math.max(0, newCost.wood - 3)
    }
    return newCost
  },
}
