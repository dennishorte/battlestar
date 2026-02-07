/**
 * Minor Improvements D Cards for Agricola (Revised Edition)
 * Cards D001-D084 - A standalone minor improvements deck
 */

const minorImprovements = [
  {
    id: 'zigzag-harrow-d001',
    name: 'Zigzag Harrow',
    deck: 'minorD',
    number: 1,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { fieldsInLShape: true },
    category: 'Farm Planner',
    text: 'You can immediately plow 1 field such that it completes a "zigzag" pattern.',
    onPlay(game, player) {
      game.actions.plowField(player, { zigzagPattern: true })
    },
  },
  {
    id: 'dwelling-plan-d002',
    name: 'Dwelling Plan',
    deck: 'minorD',
    number: 2,
    type: 'minor',
    cost: { food: 1 },
    category: 'Farm Planner',
    text: 'You can immediately take a "Renovation" action.',
    onPlay(game, player) {
      game.actions.offerRenovation(player, this)
    },
  },
  {
    id: 'furrows-d003',
    name: 'Furrows',
    deck: 'minorD',
    number: 3,
    type: 'minor',
    cost: {},
    category: 'Crop Provider',
    text: 'You can immediately sow in exactly 1 field.',
    onPlay(game, player) {
      game.actions.sowSingleField(player, this)
    },
  },
  {
    id: 'cross-cut-wood-d004',
    name: 'Cross-Cut Wood',
    deck: 'minorD',
    number: 4,
    type: 'minor',
    cost: { food: 1 },
    prereqs: { occupations: 3 },
    category: 'Building Resource Provider',
    text: 'You immediately get a number of wood equal to the number of stone in your supply.',
    onPlay(game, player) {
      const stone = player.stone || 0
      if (stone > 0) {
        player.addResource('wood', stone)
        game.log.add({
          template: '{player} gets {amount} wood from Cross-Cut Wood',
          args: { player, amount: stone },
        })
      }
    },
  },
  {
    id: 'field-clay-d005',
    name: 'Field Clay',
    deck: 'minorD',
    number: 5,
    type: 'minor',
    cost: { food: 1 },
    prereqs: { plantedFields: 1 },
    category: 'Building Resource Provider',
    text: 'You immediately get 1 clay for each planted field you have.',
    onPlay(game, player) {
      const plantedFields = player.getPlantedFields().length
      if (plantedFields > 0) {
        player.addResource('clay', plantedFields)
        game.log.add({
          template: '{player} gets {amount} clay from Field Clay',
          args: { player, amount: plantedFields },
        })
      }
    },
  },
  {
    id: 'petrified-wood-d006',
    name: 'Petrified Wood',
    deck: 'minorD',
    number: 6,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 2 },
    category: 'Building Resource Provider',
    text: 'Immediately exchange up to 3 wood for 1 stone each.',
    onPlay(game, player) {
      game.actions.petrifiedWoodExchange(player, this)
    },
  },
  {
    id: 'trident-d007',
    name: 'Trident',
    deck: 'minorD',
    number: 7,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { roundIn: [3, 6, 9, 12] },
    category: 'Food Provider',
    text: 'If you play this card in round 3/6/9/12, you immediately get 3/4/5/6 food.',
    onPlay(game, player) {
      const round = game.state.round
      const foodByRound = { 3: 3, 6: 4, 9: 5, 12: 6 }
      const food = foodByRound[round] || 0
      if (food > 0) {
        player.addResource('food', food)
        game.log.add({
          template: '{player} gets {amount} food from Trident',
          args: { player, amount: food },
        })
      }
    },
  },
  {
    id: 'fern-seeds-d008',
    name: 'Fern Seeds',
    deck: 'minorD',
    number: 8,
    type: 'minor',
    cost: {},
    prereqs: { emptyFields: 1, plantedFields: 2 },
    category: 'Crop Provider',
    text: 'You get 2 food and 1 grain, which you must sow immediately.',
    onPlay(game, player) {
      player.addResource('food', 2)
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 2 food and 1 grain from Fern Seeds',
        args: { player },
      })
      game.actions.sowGrainImmediately(player, this)
    },
  },
  {
    id: 'game-trade-d009',
    name: 'Game Trade',
    deck: 'minorD',
    number: 9,
    type: 'minor',
    cost: { sheep: 2 },
    category: 'Livestock Provider',
    text: 'You immediately get 1 wild boar and 1 cattle. (Effectively, you are exchanging 2 sheep for 1 wild boar and 1 cattle.)',
    onPlay(game, player) {
      player.addAnimal('boar', 1)
      player.addAnimal('cattle', 1)
      game.log.add({
        template: '{player} gets 1 wild boar and 1 cattle from Game Trade',
        args: { player },
      })
    },
  },
  {
    id: 'storks-nest-d010',
    name: "Stork's Nest",
    deck: 'minorD',
    number: 10,
    type: 'minor',
    cost: { reed: 1 },
    prereqs: { occupations: 5 },
    category: 'Actions Booster',
    text: 'In the returning home phase of each round, if you have more rooms than people, you can pay 1 food to take a "Family Growth" action.',
    onReturnHome(game, player) {
      if (player.getRoomCount() > player.familyMembers && player.food >= 1 && player.canAddFamilyMember()) {
        game.actions.offerStorksNest(player, this)
      }
    },
  },
  {
    id: 'lawn-fertilizer-d011',
    name: 'Lawn Fertilizer',
    deck: 'minorD',
    number: 11,
    type: 'minor',
    cost: {},
    category: 'Livestock Provider',
    text: 'Your pastures of size 1 can hold up to 3 animals of the same type. (With a stable, they can hold up to 6 animals of the same type.)',
    modifyPastureCapacity(game, player, capacity, pastureSize, hasStable) {
      if (pastureSize === 1) {
        const base = 3
        return hasStable ? base * 2 : base
      }
      return capacity
    },
  },
  {
    id: 'milking-place-d012',
    name: 'Milking Place',
    deck: 'minorD',
    number: 12,
    type: 'minor',
    cost: { grain: 1 },
    vps: 1,
    category: 'Food Provider',
    text: 'In the feeding phase of each harvest, you get 1 food. You can no longer hold animals in your house (not even via another card).',
    onFeedingPhase(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Milking Place',
        args: { player },
      })
    },
    preventsHouseAnimals: true,
  },
  {
    id: 'trowel-d013',
    name: 'Trowel',
    deck: 'minorD',
    number: 13,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Farm Planner',
    text: 'At any time, you can renovate your house to stone. From a wooden house, this costs 1 stone, 1 reed, and 1 food per room. From a clay house, this costs 1 stone per room.',
    allowsAnytimeRenovation: true,
    trowelRenovation: true,
  },
  {
    id: 'hammer-crusher-d014',
    name: 'Hammer Crusher',
    deck: 'minorD',
    number: 14,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Farm Planner',
    text: 'Immediately before you renovate to stone, you get 2 clay and 1 reed and you can take a "Build Rooms" action.',
    onBeforeRenovateToStone(game, player) {
      player.addResource('clay', 2)
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 2 clay and 1 reed from Hammer Crusher',
        args: { player },
      })
      game.actions.offerBuildRooms(player, this)
    },
  },
  {
    id: 'clay-supports-d015',
    name: 'Clay Supports',
    deck: 'minorD',
    number: 15,
    type: 'minor',
    cost: { wood: 2 },
    category: 'Farm Planner',
    text: 'Each time you build a clay room, you can pay 2 clay, 1 wood, and 1 reed instead of 5 clay and 2 reed.',
    modifyBuildCost(player, cost, action) {
      if (action === 'build-room' && player.roomType === 'clay') {
        return { clay: 2, wood: 1, reed: 1 }
      }
      return cost
    },
  },
  {
    id: 'wooden-whey-bucket-d016',
    name: 'Wooden Whey Bucket',
    deck: 'minorD',
    number: 16,
    type: 'minor',
    cost: { wood: 1, food: 1 },
    category: 'Farm Planner',
    text: 'Each time before you use the "Sheep Market"/"Cattle Market" accumulation space, you can build exactly 1 stable for 1 wood/at no cost.',
    onBeforeAction(game, player, actionId) {
      if (actionId === 'take-sheep') {
        game.actions.offerBuildStableForWood(player, this, 1)
      }
      else if (actionId === 'take-cattle') {
        game.actions.buildFreeStable(player, this)
      }
    },
  },
  {
    id: 'drill-harrow-d017',
    name: 'Drill Harrow',
    deck: 'minorD',
    number: 17,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Farm Planner',
    text: 'Each time before you take an unconditional "Sow" action, you can pay 3 food to plow 1 field.',
    onBeforeSow(game, player) {
      if (player.food >= 3) {
        game.actions.offerDrillHarrow(player, this)
      }
    },
  },
  {
    id: 'steam-plow-d018',
    name: 'Steam Plow',
    deck: 'minorD',
    number: 18,
    type: 'minor',
    cost: { wood: 1, food: 1 },
    vps: 1,
    category: 'Farm Planner',
    text: 'Immediately after each returning home phase, you can pay 2 wood and 1 food to use the "Farmland" action space without placing a person.',
    onReturnHome(game, player) {
      if (player.wood >= 2 && player.food >= 1) {
        game.actions.offerSteamPlow(player, this)
      }
    },
  },
  {
    id: 'pulverizer-plow-d019',
    name: 'Pulverizer Plow',
    deck: 'minorD',
    number: 19,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { occupations: 1 },
    category: 'Farm Planner',
    text: 'Immediately after each time you use a clay accumulation space, you can pay 1 clay to plow 1 field. If you do, place that 1 clay on the accumulation space.',
    onAction(game, player, actionId) {
      if ((actionId === 'take-clay' || actionId === 'take-clay-2') && player.clay >= 1) {
        game.actions.offerPulverizerPlow(player, this, actionId)
      }
    },
  },
  {
    id: 'turnwrest-plow-d020',
    name: 'Turnwrest Plow',
    deck: 'minorD',
    number: 20,
    type: 'minor',
    cost: { wood: 3 },
    prereqs: { occupations: 2 },
    category: 'Farm Planner',
    text: 'Place 2 field tiles on this card. Each time you use the "Farmland" or "Cultivation" action space, you can also plow up to 2 fields from this card.',
    onPlay(game, player) {
      player.turnwrestPlowCharges = 2
      game.log.add({
        template: '{player} places 2 field tiles on Turnwrest Plow',
        args: { player },
      })
    },
    onAction(game, player, actionId) {
      if ((actionId === 'plow-field' || actionId === 'plow-sow') && player.turnwrestPlowCharges > 0) {
        const fieldsToAdd = Math.min(2, player.turnwrestPlowCharges)
        player.turnwrestPlowCharges -= fieldsToAdd
        for (let i = 0; i < fieldsToAdd; i++) {
          game.actions.plowField(player, { immediate: true })
        }
      }
    },
  },
  {
    id: 'recruitment-d021',
    name: 'Recruitment',
    deck: 'minorD',
    number: 21,
    type: 'minor',
    cost: { food: 1 },
    prereqs: { noPeopleInHouse: true },
    category: 'Actions Booster',
    text: 'Provided you have room in your house, each time you get a "Minor Improvement" action, you can take a "Family Growth" action instead.',
    modifyMinorImprovementAction: true,
  },
  {
    id: 'work-permit-d022',
    name: 'Work Permit',
    deck: 'minorD',
    number: 22,
    type: 'minor',
    cost: { food: 1 },
    prereqs: { buildingResourcesInSupply: 1 },
    category: 'Actions Booster',
    text: 'Add 1 to the current round for each building resource you have and place 1 person from your supply on the corresponding round space. In that round, you can use the person.',
    onPlay(game, player) {
      const buildingResources = player.wood + player.clay + player.reed + player.stone
      const targetRound = game.state.round + buildingResources
      if (targetRound <= 14 && player.hasPersonInSupply()) {
        game.actions.scheduleWorkPermitPerson(player, this, targetRound)
      }
    },
  },
  {
    id: 'pioneering-spirit-d023',
    name: 'Pioneering Spirit',
    deck: 'minorD',
    number: 23,
    type: 'minor',
    cost: {},
    category: 'Actions Booster',
    text: 'This card is an action space for you only. In rounds 3-5, it provides a "Renovation" action. In rounds 6-8, it provides your choice of 1 vegetable, wild boar, or cattle.',
    providesActionSpace: true,
    actionSpaceId: 'pioneering-spirit',
    ownerOnly: true,
    onActionSpaceUsed(game, player, round) {
      if (round >= 3 && round <= 5) {
        game.actions.offerRenovation(player, this)
      }
      else if (round >= 6 && round <= 8) {
        game.actions.offerPioneeringSpiritChoice(player, this)
      }
    },
  },
  {
    id: 'brotherly-love-d024',
    name: 'Brotherly Love',
    deck: 'minorD',
    number: 24,
    type: 'minor',
    cost: { food: 1 },
    category: 'Actions Booster',
    text: 'As long as you have exactly 4 people, in the work phase of each round, you can place your third and fourth person immediately after one another, even on the same action space.',
    allowDoubleWorkerWith4People: true,
  },
  {
    id: 'witches-dance-floor-d025',
    name: "Witches' Dance Floor",
    deck: 'minorD',
    number: 25,
    type: 'minor',
    cost: {},
    category: 'Farm Planner',
    text: 'This card is a field that you can sow in, an occupation, and the "Fireplace" major improvement with all of its effects. You can play it only via a "Minor Improvement" action.',
    providesField: true,
    countsAsOccupation: true,
    countsAsMajorOrMinor: true,
    isFireplace: true,
    anytimeConversions: [
      { from: 'sheep', to: 'food', rate: 2 },
      { from: 'boar', to: 'food', rate: 2 },
      { from: 'vegetables', to: 'food', rate: 2 },
    ],
    bakingConversion: { from: 'grain', to: 'food', rate: 2 },
    onPlay(game, player) {
      player.addVirtualField({
        cardId: 'witches-dance-floor-d025',
        label: "Witches' Floor",
        cropRestriction: null,  // Can grow any crop
      })
      game.log.add({
        template: "{player} plays Witches' Dance Floor, gaining a field and Fireplace abilities",
        args: { player },
      })
    },
  },
  {
    id: 'carpenters-yard-d026',
    name: "Carpenter's Yard",
    deck: 'minorD',
    number: 26,
    type: 'minor',
    cost: { wood: 1, reed: 1 },
    vps: 1,
    category: 'Actions Booster',
    text: 'You can build the "Joinery" and "Well" major improvement even when taking a "Minor Improvement" action, or you can build both with a single "Major Improvement" action.',
    allowsMajorsOnMinorAction: ['joinery', 'well'],
    allowsBothMajorsOnMajorAction: ['joinery', 'well'],
  },
  {
    id: 'retraining-d027',
    name: 'Retraining',
    deck: 'minorD',
    number: 27,
    type: 'minor',
    cost: { food: 1 },
    vps: 1,
    prereqs: { occupations: 1 },
    category: 'Actions Booster',
    text: 'At the end of each turn in which you renovate, you can exchange your Joinery for the Pottery or your Pottery for the Basketmaker\'s Workshop.',
    onRenovate(game, player) {
      game.actions.offerRetraining(player, this)
    },
  },
  {
    id: 'writing-desk-d028',
    name: 'Writing Desk',
    deck: 'minorD',
    number: 28,
    type: 'minor',
    cost: { wood: 1 },
    vps: 1,
    prereqs: { occupations: 2 },
    category: 'Actions Booster',
    text: 'Each time you use a "Lessons" action space, you can play 1 additional occupation for an occupation cost of 2 food.',
    onAction(game, player, actionId) {
      if (actionId === 'lessons-1' || actionId === 'lessons-2') {
        game.actions.offerOccupationForFood(player, this, 2)
      }
    },
  },
  {
    id: 'muck-rake-d029',
    name: 'Muck Rake',
    deck: 'minorD',
    number: 29,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Points Provider',
    text: 'During scoring, you get 1 bonus point for exactly 1 unfenced stable holding exactly 1 sheep. The same applies to wild boar and cattle, if held in different unfenced stables.',
    getEndGamePoints(player) {
      let points = 0
      const unfencedStables = player.getUnfencedStablesWithAnimals()
      const countByType = { sheep: 0, boar: 0, cattle: 0 }
      for (const stable of unfencedStables) {
        if (stable.animalCount === 1) {
          countByType[stable.animalType]++
        }
      }
      if (countByType.sheep === 1) {
        points++
      }
      if (countByType.boar === 1) {
        points++
      }
      if (countByType.cattle === 1) {
        points++
      }
      return points
    },
  },
  {
    id: 'artisan-district-d030',
    name: 'Artisan District',
    deck: 'minorD',
    number: 30,
    type: 'minor',
    cost: { stone: 1 },
    vps: 1,
    prereqs: { occupations: 3 },
    category: 'Points Provider',
    text: 'During scoring, you get 2/5/8 bonus points for having 3/4/5 major improvements from the bottom row of the supply board.',
    getEndGamePoints(player) {
      const bottomRowMajors = ['clay-oven', 'stone-oven', 'joinery', 'pottery', 'basketmakers-workshop']
      const count = (player.majorImprovements || []).filter(m => bottomRowMajors.includes(m)).length
      if (count >= 5) {
        return 8
      }
      if (count >= 4) {
        return 5
      }
      if (count >= 3) {
        return 2
      }
      return 0
    },
  },
  {
    id: 'storeroom-d031',
    name: 'Storeroom',
    deck: 'minorD',
    number: 31,
    type: 'minor',
    cost: { wood: 1, stone: 2 },
    vps: 1,
    category: 'Points Provider',
    text: 'During scoring, you get ½ bonus point for each pair of grain plus vegetable you have (considering all crops in your supply and fields), rounded up.',
    getEndGamePoints(player) {
      const totalGrain = player.grain + player.getGrainInFields()
      const totalVegetables = player.vegetables + player.getVegetablesInFields()
      const pairs = Math.min(totalGrain, totalVegetables)
      return Math.ceil(pairs / 2)
    },
  },
  {
    id: 'wood-rake-d032',
    name: 'Wood Rake',
    deck: 'minorD',
    number: 32,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Points Provider',
    text: 'During scoring, if you had at least 7 goods in your fields before the final harvest, you get 2 bonus points.',
    getEndGamePoints(player) {
      if (player.goodsInFieldsBeforeFinalHarvest >= 7) {
        return 2
      }
      return 0
    },
  },
  {
    id: 'summer-house-d033',
    name: 'Summer House',
    deck: 'minorD',
    number: 33,
    type: 'minor',
    cost: { wood: 3, stone: 1 },
    prereqs: { houseType: 'wood' },
    category: 'Points Provider',
    text: 'During scoring, if you live in a stone house, you get 2 bonus points for each unused farmyard space orthogonally adjacent to your house. (You still lose the points for these unused spaces.)',
    getEndGamePoints(player) {
      if (player.roomType === 'stone') {
        const unusedAdjacentToHouse = player.getUnusedSpacesAdjacentToHouse()
        return unusedAdjacentToHouse * 2
      }
      return 0
    },
  },
  {
    id: 'luxurious-hostel-d034',
    name: 'Luxurious Hostel',
    deck: 'minorD',
    number: 34,
    type: 'minor',
    cost: { wood: 1, clay: 2 },
    category: 'Points Provider',
    text: 'During scoring, if you then have more stone rooms than people, you get 4 bonus points. You can only use one card to get bonus points for your stone house.',
    getEndGamePoints(player) {
      if (player.roomType === 'stone' && player.getRoomCount() > player.familyMembers) {
        return 4
      }
      return 0
    },
  },
  {
    id: 'fodder-chamber-d035',
    name: 'Fodder Chamber',
    deck: 'minorD',
    number: 35,
    type: 'minor',
    cost: { stone: 3, grain: 3 },
    vps: 2,
    category: 'Points Provider',
    text: 'During scoring in a game with 1/2/3/4+ players, you get 1 bonus point for every 7th/5th/4th/3rd animal on your farm.',
    getEndGamePoints(player, game) {
      const playerCount = game.players.all().length
      const thresholds = { 1: 7, 2: 5, 3: 4 }
      const threshold = thresholds[playerCount] || 3
      const totalAnimals = player.getTotalAnimals('sheep') + player.getTotalAnimals('boar') + player.getTotalAnimals('cattle')
      return Math.floor(totalAnimals / threshold)
    },
  },
  {
    id: 'breed-registry-d036',
    name: 'Breed Registry',
    deck: 'minorD',
    number: 36,
    type: 'minor',
    cost: {},
    prereqs: { noSheep: true },
    category: 'Points Provider',
    text: 'During scoring, if you gained at most 2 sheep from sources other than breeding during the game and have not turned any sheep into food, you get 3 bonus points.',
    onPlay(game, player) {
      player.breedRegistryActive = true
      player.sheepGainedNonBreeding = 0
      player.sheepTurnedToFood = 0
    },
    getEndGamePoints(player) {
      if (player.breedRegistryActive && player.sheepGainedNonBreeding <= 2 && player.sheepTurnedToFood === 0) {
        return 3
      }
      return 0
    },
  },
  {
    id: 'sculpture-d037',
    name: 'Sculpture',
    deck: 'minorD',
    number: 37,
    type: 'minor',
    cost: { stone: 1 },
    vps: 2,
    prereqs: { roundsLeftGreaterThanUnusedSpaces: true },
    category: 'Points Provider',
    text: 'You can only play this card if there are more complete rounds left to play than you have unused farmyard spaces.',
  },
  {
    id: 'milking-stool-d038',
    name: 'Milking Stool',
    deck: 'minorD',
    number: 38,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { occupations: 2 },
    category: 'Points Provider',
    text: 'In the field phase of each harvest, if you have at least 1/3/5 cattle, you get 1/2/3 food. During scoring, you get 1 bonus point for every 2 cattle you have.',
    onHarvest(game, player) {
      const cattle = player.getTotalAnimals('cattle')
      let food = 0
      if (cattle >= 5) {
        food = 3
      }
      else if (cattle >= 3) {
        food = 2
      }
      else if (cattle >= 1) {
        food = 1
      }
      if (food > 0) {
        player.addResource('food', food)
        game.log.add({
          template: '{player} gets {amount} food from Milking Stool',
          args: { player, amount: food },
        })
      }
    },
    getEndGamePoints(player) {
      const cattle = player.getTotalAnimals('cattle')
      return Math.floor(cattle / 2)
    },
  },
  {
    id: 'truffle-slicer-d039',
    name: 'Truffle Slicer',
    deck: 'minorD',
    number: 39,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { minRound: 8 },
    category: 'Points Provider',
    text: 'Each time you use a wood accumulation space, if you have at least 1 wild boar, you can pay 1 food for 1 bonus point.',
    onAction(game, player, actionId) {
      if ((actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') &&
          player.getTotalAnimals('boar') >= 1 && player.food >= 1) {
        game.actions.offerTruffleSlicer(player, this)
      }
    },
  },
  {
    id: 'cesspit-d040',
    name: 'Cesspit',
    deck: 'minorD',
    number: 40,
    type: 'minor',
    cost: {},
    vps: -1,
    prereqs: { fields: 2, occupations: 1 },
    category: 'Building Resource Provider',
    text: 'Alternate placing 1 clay and 1 wild boar on each remaining round space, starting with clay. At the start of these rounds, you get the respective good.',
    onPlay(game, player) {
      const currentRound = game.state.round
      let isClay = true
      for (let round = currentRound + 1; round <= 14; round++) {
        if (isClay) {
          if (!game.state.scheduledClay) {
            game.state.scheduledClay = {}
          }
          if (!game.state.scheduledClay[player.name]) {
            game.state.scheduledClay[player.name] = {}
          }
          game.state.scheduledClay[player.name][round] =
            (game.state.scheduledClay[player.name][round] || 0) + 1
        }
        else {
          if (!game.state.scheduledBoar) {
            game.state.scheduledBoar = {}
          }
          if (!game.state.scheduledBoar[player.name]) {
            game.state.scheduledBoar[player.name] = {}
          }
          game.state.scheduledBoar[player.name][round] =
            (game.state.scheduledBoar[player.name][round] || 0) + 1
        }
        isClay = !isClay
      }
      game.log.add({
        template: '{player} schedules clay and wild boar from Cesspit',
        args: { player },
      })
    },
  },
  {
    id: 'horse-drawn-boat-d041',
    name: 'Horse-Drawn Boat',
    deck: 'minorD',
    number: 41,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { occupations: 3 },
    category: 'Food Provider',
    text: 'Alternate placing 1 food and 1 sheep on each remaining round space, starting with food. At the start of these rounds, you get the respective good.',
    onPlay(game, player) {
      const currentRound = game.state.round
      let isFood = true
      for (let round = currentRound + 1; round <= 14; round++) {
        if (isFood) {
          if (!game.state.scheduledFood) {
            game.state.scheduledFood = {}
          }
          if (!game.state.scheduledFood[player.name]) {
            game.state.scheduledFood[player.name] = {}
          }
          game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 1
        }
        else {
          if (!game.state.scheduledSheep) {
            game.state.scheduledSheep = {}
          }
          if (!game.state.scheduledSheep[player.name]) {
            game.state.scheduledSheep[player.name] = {}
          }
          game.state.scheduledSheep[player.name][round] =
            (game.state.scheduledSheep[player.name][round] || 0) + 1
        }
        isFood = !isFood
      }
      game.log.add({
        template: '{player} schedules food and sheep from Horse-Drawn Boat',
        args: { player },
      })
    },
  },
  {
    id: 'education-bonus-d042',
    name: 'Education Bonus',
    deck: 'minorD',
    number: 42,
    type: 'minor',
    cost: { food: 1 },
    prereqs: { improvements: 2 },
    category: 'Building Resource Provider',
    text: 'After you play your 1st/2nd/3rd/4th/5th/6th occupation this game, you immediately get 1 grain/clay/reed/stone/vegetable/field (not retroactively).',
    onPlayOccupation(game, player) {
      const occCount = player.occupationsPlayed || 0
      const rewards = {
        1: { type: 'grain', amount: 1 },
        2: { type: 'clay', amount: 1 },
        3: { type: 'reed', amount: 1 },
        4: { type: 'stone', amount: 1 },
        5: { type: 'vegetables', amount: 1 },
        6: { type: 'field', amount: 1 },
      }
      const reward = rewards[occCount]
      if (reward) {
        if (reward.type === 'field') {
          game.actions.plowField(player, { immediate: true })
        }
        else {
          player.addResource(reward.type, reward.amount)
          game.log.add({
            template: '{player} gets 1 {resource} from Education Bonus',
            args: { player, resource: reward.type },
          })
        }
      }
    },
  },
  {
    id: 'hutch-d043',
    name: 'Hutch',
    deck: 'minorD',
    number: 43,
    type: 'minor',
    cost: { wood: 1, reed: 1 },
    vps: 1,
    category: 'Food Provider',
    text: 'Place 0, 1, 2, and 3 food in this order on the next 4 round spaces. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const currentRound = game.state.round
      const foodAmounts = [0, 1, 2, 3]
      for (let i = 0; i < 4; i++) {
        const round = currentRound + 1 + i
        if (round <= 14 && foodAmounts[i] > 0) {
          if (!game.state.scheduledFood) {
            game.state.scheduledFood = {}
          }
          if (!game.state.scheduledFood[player.name]) {
            game.state.scheduledFood[player.name] = {}
          }
          game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + foodAmounts[i]
        }
      }
      game.log.add({
        template: '{player} schedules food from Hutch',
        args: { player },
      })
    },
  },
  {
    id: 'forest-well-d044',
    name: 'Forest Well',
    deck: 'minorD',
    number: 44,
    type: 'minor',
    cost: { stone: 1, food: 1 },
    vps: 1,
    prereqs: { occupations: 2 },
    category: 'Food Provider',
    text: 'Place 1 food on each remaining round space, up to the amount of wood in your supply. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const wood = player.wood || 0
      const currentRound = game.state.round
      let placed = 0
      for (let round = currentRound + 1; round <= 14 && placed < wood; round++) {
        if (!game.state.scheduledFood) {
          game.state.scheduledFood = {}
        }
        if (!game.state.scheduledFood[player.name]) {
          game.state.scheduledFood[player.name] = {}
        }
        game.state.scheduledFood[player.name][round] =
          (game.state.scheduledFood[player.name][round] || 0) + 1
        placed++
      }
      game.log.add({
        template: '{player} schedules {amount} food from Forest Well',
        args: { player, amount: placed },
      })
    },
  },
  {
    id: 'sheep-well-d045',
    name: 'Sheep Well',
    deck: 'minorD',
    number: 45,
    type: 'minor',
    cost: { stone: 2 },
    vps: 2,
    category: 'Food Provider',
    text: 'Place 1 food on each of the next round spaces, up to the number of sheep you have. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const sheep = player.getTotalAnimals('sheep')
      const currentRound = game.state.round
      let placed = 0
      for (let round = currentRound + 1; round <= 14 && placed < sheep; round++) {
        if (!game.state.scheduledFood) {
          game.state.scheduledFood = {}
        }
        if (!game.state.scheduledFood[player.name]) {
          game.state.scheduledFood[player.name] = {}
        }
        game.state.scheduledFood[player.name][round] =
          (game.state.scheduledFood[player.name][round] || 0) + 1
        placed++
      }
      game.log.add({
        template: '{player} schedules {amount} food from Sheep Well',
        args: { player, amount: placed },
      })
    },
  },
  {
    id: 'pellet-press-d046',
    name: 'Pellet Press',
    deck: 'minorD',
    number: 46,
    type: 'minor',
    cost: { clay: 2 },
    prereqs: { occupations: 2 },
    category: 'Food Provider',
    text: 'Once per round, you can pay 1 reed. If you do, place 1 food on each of the next 4 round spaces. At the start of these rounds, you get the food.',
    allowsAnytimePurchase: true,
    pelletPressEffect: true,
  },
  {
    id: 'churchyard-d047',
    name: 'Churchyard',
    deck: 'minorD',
    number: 47,
    type: 'minor',
    cost: { stone: 1, reed: 1 },
    vps: 1,
    prereqs: { cardsInPlay: 10 },
    category: 'Food Provider',
    text: 'Place 2 food on each remaining round space. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let round = currentRound + 1; round <= 14; round++) {
        if (!game.state.scheduledFood) {
          game.state.scheduledFood = {}
        }
        if (!game.state.scheduledFood[player.name]) {
          game.state.scheduledFood[player.name] = {}
        }
        game.state.scheduledFood[player.name][round] =
          (game.state.scheduledFood[player.name][round] || 0) + 2
      }
      game.log.add({
        template: '{player} schedules 2 food per round from Churchyard',
        args: { player },
      })
    },
  },
  {
    id: 'civic-facade-d048',
    name: 'Civic Facade',
    deck: 'minorD',
    number: 48,
    type: 'minor',
    cost: { clay: 1 },
    prereqs: { rooms: 3 },
    category: 'Food Provider',
    text: 'Before the start of each round, if you have more occupations than improvements in your hand, you get 1 food.',
    onRoundStart(game, player) {
      const occsInHand = player.getOccupationsInHand().length
      const impsInHand = player.getImprovementsInHand().length
      if (occsInHand > impsInHand) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Civic Facade',
          args: { player },
        })
      }
    },
  },
  {
    id: 'bookshelf-d049',
    name: 'Bookshelf',
    deck: 'minorD',
    number: 49,
    type: 'minor',
    cost: { wood: 1 },
    vps: 1,
    prereqs: { occupations: 3 },
    category: 'Food Provider',
    text: 'Immediately before each time you play an occupation (even before paying the occupation cost), you get 3 food.',
    onBeforePlayOccupation(game, player) {
      player.addResource('food', 3)
      game.log.add({
        template: '{player} gets 3 food from Bookshelf',
        args: { player },
      })
    },
  },
  {
    id: 'foreign-aid-d050',
    name: 'Foreign Aid',
    deck: 'minorD',
    number: 50,
    type: 'minor',
    cost: {},
    prereqs: { maxRound: 11 },
    category: 'Food Provider',
    text: 'When you play this card, you immediately get 6 food. You may no longer use the action spaces of rounds 12 to 14.',
    onPlay(game, player) {
      player.addResource('food', 6)
      player.foreignAidRestriction = true
      game.log.add({
        template: '{player} gets 6 food from Foreign Aid',
        args: { player },
      })
    },
  },
  {
    id: 'archway-d051',
    name: 'Archway',
    deck: 'minorD',
    number: 51,
    type: 'minor',
    cost: { clay: 2 },
    vps: 4,
    prereqs: { noOccupations: true },
    category: 'Actions Booster',
    text: 'This card is an action space for all. A player who uses it immediately gets 1 food. Immediately before the returning home phase, they can use an unoccupied action space with the person from this card.',
    providesActionSpace: true,
    actionSpaceId: 'archway',
    onActionSpaceUsed(game, actingPlayer) {
      actingPlayer.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Archway',
        args: { player: actingPlayer },
      })
      // Schedule extra action before returning home
      actingPlayer.archwayExtraAction = true
    },
  },
  {
    id: 'rolling-pin-d052',
    name: 'Rolling Pin',
    deck: 'minorD',
    number: 52,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { occupations: 1 },
    category: 'Food Provider',
    text: 'In the returning home phase of each round, if you have more clay than wood in your supply, you get 1 food.',
    onReturnHome(game, player) {
      if (player.clay > player.wood) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Rolling Pin',
          args: { player },
        })
      }
    },
  },
  {
    id: 'tea-house-d053',
    name: 'Tea House',
    deck: 'minorD',
    number: 53,
    type: 'minor',
    cost: { wood: 1, stone: 1 },
    vps: 2,
    prereqs: { minRound: 6 },
    category: 'Actions Booster',
    text: 'Once per round, you can skip placing your second person and get 1 food instead. (You can place the person later that round.)',
    allowsSkipSecondPerson: true,
  },
  {
    id: 'trout-pool-d054',
    name: 'Trout Pool',
    deck: 'minorD',
    number: 54,
    type: 'minor',
    cost: { clay: 2 },
    vps: 1,
    category: 'Food Provider',
    text: 'At the start of each work phase, if there are at least 3 food on the "Fishing" accumulation space, you get 1 food from the general supply.',
    onWorkPhaseStart(game, player) {
      const fishingFood = game.state.actionSpaces['fishing']?.accumulated || 0
      if (fishingFood >= 3) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Trout Pool',
          args: { player },
        })
      }
    },
  },
  {
    id: 'new-market-d055',
    name: 'New Market',
    deck: 'minorD',
    number: 55,
    type: 'minor',
    cost: { wood: 1, clay: 1 },
    vps: 1,
    category: 'Food Provider',
    text: 'Each time you use an action space card on round spaces 8 to 11, you get 1 additional food.',
    onAction(game, player, actionId) {
      const round = game.state.round
      if (round >= 8 && round <= 11 && game.isRoundActionSpace(actionId)) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from New Market',
          args: { player },
        })
      }
    },
  },
  {
    id: 'fatstock-stretcher-d056',
    name: 'Fatstock Stretcher',
    deck: 'minorD',
    number: 56,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'Each time you turn a sheep or wild boar into food using a cooking improvement, you get 1 additional food.',
    onCookAnimal(game, player, animalType) {
      if (animalType === 'sheep' || animalType === 'boar') {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Fatstock Stretcher',
          args: { player },
        })
      }
    },
  },
  {
    id: 'wholesale-market-d057',
    name: 'Wholesale Market',
    deck: 'minorD',
    number: 57,
    type: 'minor',
    cost: { wood: 2, vegetables: 2 },
    vps: 3,
    category: 'Food Provider',
    text: 'Place 1 food on each remaining round space. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let round = currentRound + 1; round <= 14; round++) {
        if (!game.state.scheduledFood) {
          game.state.scheduledFood = {}
        }
        if (!game.state.scheduledFood[player.name]) {
          game.state.scheduledFood[player.name] = {}
        }
        game.state.scheduledFood[player.name][round] =
          (game.state.scheduledFood[player.name][round] || 0) + 1
      }
      game.log.add({
        template: '{player} schedules food from Wholesale Market',
        args: { player },
      })
    },
  },
  {
    id: 'gritter-d058',
    name: 'Gritter',
    deck: 'minorD',
    number: 58,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { minRound: 5 },
    category: 'Food Provider',
    text: 'At the end of each action in which you sow vegetables in a field, you get 1 food for each vegetable field you have (including the new ones).',
    onSowVegetables(game, player) {
      const vegFields = player.getVegetableFieldCount()
      if (vegFields > 0) {
        player.addResource('food', vegFields)
        game.log.add({
          template: '{player} gets {amount} food from Gritter',
          args: { player, amount: vegFields },
        })
      }
    },
  },
  {
    id: 'earth-oven-d059',
    name: 'Earth Oven',
    deck: 'minorD',
    number: 59,
    type: 'minor',
    cost: {},
    vps: 3,
    prereqs: { returnMajor: ['fireplace-2', 'fireplace-3'] },
    category: 'Food Provider',
    text: 'At any time, you may convert goods to food as follows: Vegetable → 3 Food; Sheep → 2 Food; Wild boar → 3 Food; Cattle → 3 Food. Whenever you bake bread, you may convert: Grain → 2 Food.',
    countsAsMajorOrMinor: true,
    anytimeConversions: [
      { from: 'vegetables', to: 'food', rate: 3 },
      { from: 'sheep', to: 'food', rate: 2 },
      { from: 'boar', to: 'food', rate: 3 },
      { from: 'cattle', to: 'food', rate: 3 },
    ],
    bakingConversion: { from: 'grain', to: 'food', rate: 2 },
  },
  {
    id: 'large-pottery-d060',
    name: 'Large Pottery',
    deck: 'minorD',
    number: 60,
    type: 'minor',
    cost: { clay: 1, stone: 1 },
    vps: 3,
    prereqs: { returnMajor: ['pottery'] },
    category: 'Food Provider',
    text: 'At any time, you can use the Large Pottery to convert 1 Clay to 2 Food. At the end of the game, you may spend 3/5/6/7 Clay from your supply to earn 1/2/3/4 bonus points.',
    anytimeConversions: [
      { from: 'clay', to: 'food', rate: 2 },
    ],
    getEndGamePoints(player) {
      const clay = player.clay
      if (clay >= 7) {
        return 4
      }
      if (clay >= 6) {
        return 3
      }
      if (clay >= 5) {
        return 2
      }
      if (clay >= 3) {
        return 1
      }
      return 0
    },
  },
  {
    id: 'bale-of-straw-d061',
    name: 'Bale of Straw',
    deck: 'minorD',
    number: 61,
    type: 'minor',
    cost: {},
    category: 'Food Provider',
    text: 'At the start of each harvest, if you have at least 3 grain fields (including field cards with planted grain), you get 2 food.',
    onHarvestStart(game, player) {
      const grainFields = player.getGrainFieldCount()
      if (grainFields >= 3) {
        player.addResource('food', 2)
        game.log.add({
          template: '{player} gets 2 food from Bale of Straw',
          args: { player },
        })
      }
    },
  },
  {
    id: 'beer-tap-d062',
    name: 'Beer Tap',
    deck: 'minorD',
    number: 62,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'When you play this card, you immediately get 2 food. In the feeding phase of each harvest, you can turn 2/3/4 grain into 3/6/9 food.',
    onPlay(game, player) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Beer Tap',
        args: { player },
      })
    },
    onFeedingPhase(game, player) {
      if (player.grain >= 2) {
        game.actions.offerBeerTap(player, this)
      }
    },
  },
  {
    id: 'lynchet-d063',
    name: 'Lynchet',
    deck: 'minorD',
    number: 63,
    type: 'minor',
    cost: {},
    category: 'Food Provider',
    text: 'In the field phase of each harvest, you get 1 food for each harvested field tile that is orthogonally adjacent to your house.',
    onHarvest(game, player) {
      const adjacentHarvestedFields = player.getHarvestedFieldsAdjacentToHouse()
      if (adjacentHarvestedFields > 0) {
        player.addResource('food', adjacentHarvestedFields)
        game.log.add({
          template: '{player} gets {amount} food from Lynchet',
          args: { player, amount: adjacentHarvestedFields },
        })
      }
    },
  },
  {
    id: 'baking-course-d064',
    name: 'Baking Course',
    deck: 'minorD',
    number: 64,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 1 },
    category: 'Food Provider',
    text: 'At the end of each round that does not end with a harvest, you can take a "Bake Bread" action. Whenever you bake bread, you may convert: Grain → 2 Food.',
    onRoundEnd(game, player, round) {
      if (!game.isHarvestRound(round)) {
        game.actions.bakeBread(player)
      }
    },
    bakingConversion: { from: 'grain', to: 'food', rate: 2 },
  },
  {
    id: 'grain-sieve-d065',
    name: 'Grain Sieve',
    deck: 'minorD',
    number: 65,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Crop Provider',
    text: 'In the field phase of each harvest, if you harvest at least 2 grain, you get 1 additional grain from the general supply.',
    onHarvestGrain(game, player, amount) {
      if (amount >= 2) {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Grain Sieve',
          args: { player },
        })
      }
    },
  },
  {
    id: 'potter-ceramics-d066',
    name: 'Potter Ceramics',
    deck: 'minorD',
    number: 66,
    type: 'minor',
    cost: {},
    category: 'Food Provider',
    text: 'Each time before you take a "Bake Bread" action, you can exchange exactly 1 clay for 1 grain.',
    onBeforeBake(game, player) {
      if (player.clay >= 1) {
        game.actions.offerPotterCeramics(player, this)
      }
    },
  },
  {
    id: 'reap-hook-d067',
    name: 'Reap Hook',
    deck: 'minorD',
    number: 67,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Crop Provider',
    text: 'Place 1 grain on each of the next 3 of the round spaces 4, 7, 9, 11, 13, and 14. At the start of these rounds, you get the grain.',
    onPlay(game, player) {
      const currentRound = game.state.round
      const targetRounds = [4, 7, 9, 11, 13, 14].filter(r => r > currentRound).slice(0, 3)
      for (const round of targetRounds) {
        if (!game.state.scheduledGrain) {
          game.state.scheduledGrain = {}
        }
        if (!game.state.scheduledGrain[player.name]) {
          game.state.scheduledGrain[player.name] = {}
        }
        game.state.scheduledGrain[player.name][round] =
          (game.state.scheduledGrain[player.name][round] || 0) + 1
      }
      game.log.add({
        template: '{player} schedules grain from Reap Hook',
        args: { player },
      })
    },
  },
  {
    id: 'small-basket-d068',
    name: 'Small Basket',
    deck: 'minorD',
    number: 68,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 2 },
    category: 'Crop Provider',
    text: 'Each time you use the "Reed Bank" accumulation space, you can pay 1 reed to get 1 vegetable. If you do in a game with 4+ players, place that 1 reed on the accumulation space.',
    onAction(game, player, actionId) {
      if (actionId === 'take-reed' && player.reed >= 1) {
        game.actions.offerSmallBasket(player, this)
      }
    },
  },
  {
    id: 'small-greenhouse-d069',
    name: 'Small Greenhouse',
    deck: 'minorD',
    number: 69,
    type: 'minor',
    cost: { wood: 2 },
    vps: 1,
    prereqs: { occupations: 1 },
    category: 'Crop Provider',
    text: 'Add 4 and 7 to the current round and place 1 vegetable on each corresponding round space. At the start of these rounds, you can buy the vegetable for 1 food.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (const offset of [4, 7]) {
        const round = currentRound + offset
        if (round <= 14) {
          if (!game.state.scheduledVegetablesPurchase) {
            game.state.scheduledVegetablesPurchase = {}
          }
          if (!game.state.scheduledVegetablesPurchase[player.name]) {
            game.state.scheduledVegetablesPurchase[player.name] = {}
          }
          game.state.scheduledVegetablesPurchase[player.name][round] =
            (game.state.scheduledVegetablesPurchase[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules vegetables (purchasable for 1 food) from Small Greenhouse',
        args: { player },
      })
    },
  },
  {
    id: 'straw-manure-d070',
    name: 'Straw Manure',
    deck: 'minorD',
    number: 70,
    type: 'minor',
    cost: {},
    prereqs: { fields: 2 },
    category: 'Crop Provider',
    text: 'Before the field phase of each harvest, you can pay 1 grain from your supply to add 1 vegetable to each of up to 2 vegetable fields.',
    onBeforeFieldPhase(game, player) {
      if (player.grain >= 1 && player.getVegetableFieldCount() > 0) {
        game.actions.offerStrawManure(player, this)
      }
    },
  },
  {
    id: 'changeover-d071',
    name: 'Changeover',
    deck: 'minorD',
    number: 71,
    type: 'minor',
    cost: {},
    category: 'Crop Provider',
    text: 'At any time, if a field contains exactly 1 good as a result of a harvest, you can discard that good and immediately take a "Sow" action limited to that field.',
    allowsAnytimeExchange: true,
    changeoverEffect: true,
  },
  {
    id: 'stable-manure-d072',
    name: 'Stable Manure',
    deck: 'minorD',
    number: 72,
    type: 'minor',
    cost: {},
    prereqs: { occupationsAtMost: 1 },
    category: 'Crop Provider',
    text: 'In the field phase of each harvest, you can harvest 1 additional good from a number of fields equal to the number of unfenced stables you have.',
    onHarvest(game, player) {
      const unfencedStables = player.getUnfencedStableCount()
      if (unfencedStables > 0) {
        game.actions.harvestExtraGoods(player, this, unfencedStables)
      }
    },
  },
  {
    id: 'supply-boat-d073',
    name: 'Supply Boat',
    deck: 'minorD',
    number: 73,
    type: 'minor',
    cost: { wood: 1 },
    vps: 1,
    prereqs: { occupations: 1 },
    category: 'Crop Provider',
    text: 'Each time after you use the "Fishing" accumulation space, you can choose to buy 1 grain for 1 food, or 1 vegetable for 3 food.',
    onAction(game, player, actionId) {
      if (actionId === 'fishing' && player.food >= 1) {
        game.actions.offerSupplyBoat(player, this)
      }
    },
  },
  {
    id: 'royal-wood-d074',
    name: 'Royal Wood',
    deck: 'minorD',
    number: 74,
    type: 'minor',
    cost: { food: 1 },
    category: 'Building Resource Provider',
    text: 'At the end of each turn in which you use the "Farm Expansion" action space or build an improvement, you get 1 wood back for every 2 wood paid during those actions (rounded down).',
    onBuildImprovement(game, player, woodPaid) {
      const woodBack = Math.floor(woodPaid / 2)
      if (woodBack > 0) {
        player.addResource('wood', woodBack)
        game.log.add({
          template: '{player} gets {amount} wood back from Royal Wood',
          args: { player, amount: woodBack },
        })
      }
    },
    onFarmExpansion(game, player, woodPaid) {
      const woodBack = Math.floor(woodPaid / 2)
      if (woodBack > 0) {
        player.addResource('wood', woodBack)
        game.log.add({
          template: '{player} gets {amount} wood back from Royal Wood',
          args: { player, amount: woodBack },
        })
      }
    },
  },
  {
    id: 'wood-field-d075',
    name: 'Wood Field',
    deck: 'minorD',
    number: 75,
    type: 'minor',
    cost: { food: 1 },
    vps: 1,
    prereqs: { occupations: 1 },
    category: 'Crop Provider',
    text: 'You can plant wood on this card as though it were 2 fields, but it is considered 1 field. Sow and harvest wood on this card as you would grain.',
    providesWoodField: true,
    fieldCapacity: 2,
  },
  {
    id: 'social-benefits-d076',
    name: 'Social Benefits',
    deck: 'minorD',
    number: 76,
    type: 'minor',
    cost: { reed: 1 },
    prereqs: { occupationsAtMost: 1 },
    category: 'Building Resource Provider',
    text: 'Immediately after the feeding phase of each harvest, if you have no food left, you get 1 wood and 1 clay.',
    onFeedingPhaseEnd(game, player) {
      if (player.food === 0) {
        player.addResource('wood', 1)
        player.addResource('clay', 1)
        game.log.add({
          template: '{player} gets 1 wood and 1 clay from Social Benefits',
          args: { player },
        })
      }
    },
  },
  {
    id: 'recycled-brick-d077',
    name: 'Recycled Brick',
    deck: 'minorD',
    number: 77,
    type: 'minor',
    cost: { food: 1 },
    prereqs: { occupations: 3 },
    category: 'Building Resource Provider',
    text: 'Each time any player (including you) renovates to stone, you get 1 clay for each newly renovated room.',
    onAnyRenovateToStone(game, actingPlayer, cardOwner, roomCount) {
      cardOwner.addResource('clay', roomCount)
      game.log.add({
        template: '{player} gets {amount} clay from Recycled Brick',
        args: { player: cardOwner, amount: roomCount },
      })
    },
  },
  {
    id: 'reed-pond-d078',
    name: 'Reed Pond',
    deck: 'minorD',
    number: 78,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 3 },
    category: 'Building Resource Provider',
    text: 'Place 1 reed on each of the next 3 round spaces. At the start of these rounds, you get the reed.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let i = 1; i <= 3; i++) {
        const round = currentRound + i
        if (round <= 14) {
          if (!game.state.scheduledReed) {
            game.state.scheduledReed = {}
          }
          if (!game.state.scheduledReed[player.name]) {
            game.state.scheduledReed[player.name] = {}
          }
          game.state.scheduledReed[player.name][round] =
            (game.state.scheduledReed[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules reed from Reed Pond',
        args: { player },
      })
    },
  },
  {
    id: 'carrot-museum-d079',
    name: 'Carrot Museum',
    deck: 'minorD',
    number: 79,
    type: 'minor',
    cost: { wood: 1, clay: 2 },
    vps: 2,
    prereqs: { maxRound: 8 },
    category: 'Building Resource Provider',
    text: 'At the end of rounds 8, 10, and 12, you get 1 stone for each vegetable field you have and a number of wood equal to the number of vegetables in your supply.',
    onRoundEnd(game, player, round) {
      if (round === 8 || round === 10 || round === 12) {
        const vegFields = player.getVegetableFieldCount()
        const vegetables = player.vegetables
        if (vegFields > 0) {
          player.addResource('stone', vegFields)
          game.log.add({
            template: '{player} gets {amount} stone from Carrot Museum',
            args: { player, amount: vegFields },
          })
        }
        if (vegetables > 0) {
          player.addResource('wood', vegetables)
          game.log.add({
            template: '{player} gets {amount} wood from Carrot Museum',
            args: { player, amount: vegetables },
          })
        }
      }
    },
  },
  {
    id: 'brick-hammer-d080',
    name: 'Brick Hammer',
    deck: 'minorD',
    number: 80,
    type: 'minor',
    cost: { wood: 1 },
    costAlternative: { food: 1 },
    category: 'Building Resource Provider',
    text: 'Each time after you build an improvement costing at least 2 clay, you get 1 stone.',
    onBuildImprovement(game, player, cost) {
      if (cost && cost.clay >= 2) {
        player.addResource('stone', 1)
        game.log.add({
          template: '{player} gets 1 stone from Brick Hammer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'roof-ladder-d081',
    name: 'Roof Ladder',
    deck: 'minorD',
    number: 81,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Building Resource Provider',
    text: 'Each time you renovate, you pay 1 fewer reed and, at the end of the action, you get 1 stone.',
    modifyRenovationCost(player, cost) {
      const newCost = { ...cost }
      if (newCost.reed) {
        newCost.reed = Math.max(0, newCost.reed - 1)
      }
      return newCost
    },
    onRenovate(game, player) {
      player.addResource('stone', 1)
      game.log.add({
        template: '{player} gets 1 stone from Roof Ladder',
        args: { player },
      })
    },
  },
  {
    id: 'hunting-trophy-d082',
    name: 'Hunting Trophy',
    deck: 'minorD',
    number: 82,
    type: 'minor',
    cost: { boar: 1 },
    costAlternative: { cookBoar: true },
    vps: 1,
    category: 'Building Resource Provider',
    text: 'Improvements built on "House Redevelopment" cost you 1 building resource of your choice less. Fences built on "Farm Redevelopment" cost you a total of 3 wood less.',
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
  },
  {
    id: 'pigswill-d083',
    name: 'Pigswill',
    deck: 'minorD',
    number: 83,
    type: 'minor',
    cost: { food: 2 },
    costAlternative: { grain: 1 },
    category: 'Livestock Provider',
    text: 'Each time you use the "Fencing" action space, you also get 1 wild boar.',
    onAction(game, player, actionId) {
      if (actionId === 'fencing' || actionId === 'build-fences') {
        player.addAnimal('boar', 1)
        game.log.add({
          template: '{player} gets 1 wild boar from Pigswill',
          args: { player },
        })
      }
    },
  },
  {
    id: 'feed-pellets-d084',
    name: 'Feed Pellets',
    deck: 'minorD',
    number: 84,
    type: 'minor',
    cost: {},
    category: 'Livestock Provider',
    text: 'When you play this card, you immediately get 1 sheep. In the feeding phase of each harvest, you can exchange exactly 1 vegetable for 1 animal of a type you already have.',
    onPlay(game, player) {
      player.addAnimal('sheep', 1)
      game.log.add({
        template: '{player} gets 1 sheep from Feed Pellets',
        args: { player },
      })
    },
    onFeedingPhase(game, player) {
      if (player.vegetables >= 1 && player.hasAnyAnimals()) {
        game.actions.offerFeedPellets(player, this)
      }
    },
  },
]

function getCardById(id) {
  return minorImprovements.find(c => c.id === id)
}

function getCardByName(name) {
  return minorImprovements.find(c => c.name === name)
}

function getMinorImprovements() {
  return minorImprovements
}

function getOccupations() {
  return [] // This set has no occupations
}

function getAllCards() {
  return [...minorImprovements]
}

function getCardsByPlayerCount(playerCount) {
  return getAllCards().filter(card => {
    if (!card.players) {
      return true
    }
    const minPlayers = parseInt(card.players)
    return playerCount >= minPlayers
  })
}

module.exports = {
  minorImprovements,
  getCardById,
  getCardByName,
  getMinorImprovements,
  getOccupations,
  getAllCards,
  getCardsByPlayerCount,
}
