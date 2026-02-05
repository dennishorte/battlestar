/**
 * Minor Improvements B Cards for Agricola (Revised Edition)
 * Cards B001-B084 - A standalone minor improvements deck
 */

const minorImprovements = [
  {
    id: 'upscale-lifestyle-b001',
    name: 'Upscale Lifestyle',
    deck: 'minorB',
    number: 1,
    type: 'minor',
    cost: { wood: 3 },
    category: 'Farm Planner',
    text: 'You immediately get 5 clay and a "Renovation" action. If you take the action, you must pay the renovation cost.',
    onPlay(game, player) {
      player.addResource('clay', 5)
      game.log.add({
        template: '{player} gets 5 clay from Upscale Lifestyle',
        args: { player },
      })
      game.actions.offerRenovation(player, this)
    },
  },
  {
    id: 'mini-pasture-b002',
    name: 'Mini Pasture',
    deck: 'minorB',
    number: 2,
    type: 'minor',
    cost: { food: 2 },
    passLeft: true,
    category: 'Farm Planner',
    text: 'Immediately fence a farmyard space, without paying wood for the fences. (If you already have pastures, the new one must be adjacent to an existing one.)',
    onPlay(game, player) {
      game.actions.buildFreeSingleSpacePasture(player, this)
    },
  },
  {
    id: 'moonshine-b003',
    name: 'Moonshine',
    deck: 'minorB',
    number: 3,
    type: 'minor',
    cost: {},
    prereqs: { occupationsInHand: 1 },
    category: 'Actions Booster',
    text: 'Determine a random occupation in your hand. Immediately play it for an occupation cost of 2 food or give it to the player to your left.',
    onPlay(game, player) {
      game.actions.moonshineEffect(player, this)
    },
  },
  {
    id: 'wood-pile-b004',
    name: 'Wood Pile',
    deck: 'minorB',
    number: 4,
    type: 'minor',
    cost: {},
    category: 'Building Resource Provider',
    text: 'You immediately get a number of wood equal to the number of people you have on accumulation spaces.',
    onPlay(game, player) {
      const count = player.getPeopleOnAccumulationSpaces()
      if (count > 0) {
        player.addResource('wood', count)
        game.log.add({
          template: '{player} gets {amount} wood from Wood Pile',
          args: { player, amount: count },
        })
      }
    },
  },
  {
    id: 'store-of-experience-b005',
    name: 'Store of Experience',
    deck: 'minorB',
    number: 5,
    type: 'minor',
    cost: {},
    category: 'Building Resource Provider',
    text: 'If you have 0-3/4/5/6-7 occupations left in hand, you immediately get 1 stone/reed/clay/wood.',
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
  },
  {
    id: 'excursion-to-the-quarry-b006',
    name: 'Excursion to the Quarry',
    deck: 'minorB',
    number: 6,
    type: 'minor',
    cost: { food: 2 },
    prereqs: { occupations: 1 },
    category: 'Building Resource Provider',
    text: 'You immediately get a number of stone equal to the number of people you have.',
    onPlay(game, player) {
      const people = player.familyMembers
      if (people > 0) {
        player.addResource('stone', people)
        game.log.add({
          template: '{player} gets {amount} stone from Excursion to the Quarry',
          args: { player, amount: people },
        })
      }
    },
  },
  {
    id: 'wage-b007',
    name: 'Wage',
    deck: 'minorB',
    number: 7,
    type: 'minor',
    cost: {},
    category: 'Food Provider',
    text: 'You immediately get 2 food and 1 additional food for each major improvement you have from the bottom row of the supply board.',
    onPlay(game, player) {
      const bottomRowMajors = ['clay-oven', 'stone-oven', 'joinery', 'pottery', 'basketmakers-workshop']
      const count = (player.majorImprovements || []).filter(m => bottomRowMajors.includes(m)).length
      const food = 2 + count
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from Wage',
        args: { player, amount: food },
      })
    },
  },
  {
    id: 'market-stall-b008',
    name: 'Market Stall',
    deck: 'minorB',
    number: 8,
    type: 'minor',
    cost: { grain: 1 },
    passLeft: true,
    category: 'Crop Provider',
    text: 'You immediately get 1 vegetable. (Effectively, you are exchanging 1 grain for 1 vegetable.)',
    onPlay(game, player) {
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable from Market Stall',
        args: { player },
      })
    },
  },
  {
    id: 'beating-rod-b009',
    name: 'Beating Rod',
    deck: 'minorB',
    number: 9,
    type: 'minor',
    cost: {},
    category: 'Building Resource Provider',
    text: 'You can immediately choose to either get 1 reed or exchange 1 reed for 1 cattle.',
    onPlay(game, player) {
      game.actions.offerBeatingRod(player, this)
    },
  },
  {
    id: 'caravan-b010',
    name: 'Caravan',
    deck: 'minorB',
    number: 10,
    type: 'minor',
    cost: { wood: 3, food: 3 },
    category: 'Farm Planner',
    text: 'This card provides room for 1 person.',
    providesRoom: true,
  },
  {
    id: 'feedyard-b011',
    name: 'Feedyard',
    deck: 'minorB',
    number: 11,
    type: 'minor',
    cost: { clay: 1, grain: 1 },
    vps: 1,
    category: 'Livestock Provider',
    text: 'This card can hold 1 animal for each pasture you have, even different types. After the breeding phase of each harvest, you receive 1 food for each unused spot on this card.',
    holdsAnimalsPerPasture: true,
    onBreedingPhaseEnd(game, player) {
      const capacity = player.getPastureCount()
      const animalsOnCard = player.feedyardAnimals || 0
      const unused = capacity - animalsOnCard
      if (unused > 0) {
        player.addResource('food', unused)
        game.log.add({
          template: '{player} gets {amount} food from Feedyard',
          args: { player, amount: unused },
        })
      }
    },
  },
  {
    id: 'stockyard-b012',
    name: 'Stockyard',
    deck: 'minorB',
    number: 12,
    type: 'minor',
    cost: { wood: 1, stone: 1 },
    vps: 1,
    category: 'Livestock Provider',
    text: 'This card can hold up to 3 animals of the same type. (It is not considered a pasture.)',
    holdsAnimals: 3,
    sameTypeOnly: true,
  },
  {
    id: 'carpenters-parlor-b013',
    name: "Carpenter's Parlor",
    deck: 'minorB',
    number: 13,
    type: 'minor',
    cost: { wood: 1, stone: 1 },
    category: 'Farm Planner',
    text: 'Wooden rooms only cost you 2 wood and 2 reed each.',
    modifyBuildCost(player, cost, action) {
      if (player.roomType === 'wood' && action === 'build-room') {
        return { wood: 2, reed: 2 }
      }
      return cost
    },
  },
  {
    id: 'hawktower-b014',
    name: 'Hawktower',
    deck: 'minorB',
    number: 14,
    type: 'minor',
    cost: { clay: 2 },
    prereqs: { maxRound: 7 },
    category: 'Farm Planner',
    text: 'Place a stone room on round space 12. If you live in a stone house at the start of that round, you can build the stone room at no cost. Otherwise, discard the stone room.',
    onPlay(game, player) {
      if (!game.state.hawktowerRooms) {
        game.state.hawktowerRooms = {}
      }
      game.state.hawktowerRooms[player.name] = 12
      game.log.add({
        template: '{player} schedules a free stone room for round 12 via Hawktower',
        args: { player },
      })
    },
    onRoundStart(game, player, round) {
      if (round === 12 && game.state.hawktowerRooms && game.state.hawktowerRooms[player.name]) {
        delete game.state.hawktowerRooms[player.name]
        if (player.roomType === 'stone') {
          game.actions.buildFreeRoom(player, this, 'stone')
        }
        else {
          game.log.add({
            template: '{player} discards the Hawktower room (not in stone house)',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'carpenters-bench-b015',
    name: "Carpenter's Bench",
    deck: 'minorB',
    number: 15,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Farm Planner',
    text: 'Immediately after each time you use a wood accumulation space, you can use the taken wood (and only that) to build exactly 1 pasture. If you do, one of the fences is free.',
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
        game.actions.offerCarpentersBench(player, this)
      }
    },
  },
  {
    id: 'mining-hammer-b016',
    name: 'Mining Hammer',
    deck: 'minorB',
    number: 16,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Farm Planner',
    text: 'When you play this card, you immediately get 1 food. Each time you renovate, you can also build a stable without paying wood.',
    onPlay(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Mining Hammer',
        args: { player },
      })
    },
    onRenovate(game, player) {
      game.actions.buildFreeStable(player, this)
    },
  },
  {
    id: 'forest-plow-b017',
    name: 'Forest Plow',
    deck: 'minorB',
    number: 17,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Farm Planner',
    text: 'Each time you use a wood accumulation space, you can pay 2 wood to plow 1 field. Place the paid wood on the accumulation space (for the next visitor).',
    onAction(game, player, actionId) {
      if ((actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') && player.wood >= 2) {
        game.actions.offerForestPlow(player, this, actionId)
      }
    },
  },
  {
    id: 'grassland-harrow-b018',
    name: 'Grassland Harrow',
    deck: 'minorB',
    number: 18,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { occupations: 2, buildingResourcesInSupply: 1 },
    category: 'Farm Planner',
    text: 'Add 1 to the current round for each building resource in your supply and place 1 field on the corresponding round space. At the start of that round, you can plow the field.',
    onPlay(game, player) {
      const buildingResources = player.wood + player.clay + player.reed + player.stone
      const targetRound = game.state.round + buildingResources
      if (targetRound <= 14) {
        if (!game.state.scheduledPlows) {
          game.state.scheduledPlows = {}
        }
        if (!game.state.scheduledPlows[player.name]) {
          game.state.scheduledPlows[player.name] = []
        }
        game.state.scheduledPlows[player.name].push(targetRound)
        game.log.add({
          template: '{player} schedules a field to plow in round {round} via Grassland Harrow',
          args: { player, round: targetRound },
        })
      }
    },
  },
  {
    id: 'moldboard-plow-b019',
    name: 'Moldboard Plow',
    deck: 'minorB',
    number: 19,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { occupations: 1 },
    category: 'Farm Planner',
    text: 'Place 2 field tiles on this card. Twice this game, when you use the "Farmland" action space, you can also plow 1 field from this card.',
    onPlay(game, player) {
      player.moldboardPlowCharges = 2
      game.log.add({
        template: '{player} places 2 field tiles on Moldboard Plow',
        args: { player },
      })
    },
    onAction(game, player, actionId) {
      if (actionId === 'plow-field' && player.moldboardPlowCharges > 0) {
        player.moldboardPlowCharges--
        game.actions.plowField(player, { immediate: true })
      }
    },
  },
  {
    id: 'chain-float-b020',
    name: 'Chain Float',
    deck: 'minorB',
    number: 20,
    type: 'minor',
    cost: { wood: 3 },
    category: 'Farm Planner',
    text: 'Add 7, 8, and 9 to the current round and place 1 field on each corresponding round space. At the start of these rounds, you can plow the field.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (const offset of [7, 8, 9]) {
        const round = currentRound + offset
        if (round <= 14) {
          if (!game.state.scheduledPlows) {
            game.state.scheduledPlows = {}
          }
          if (!game.state.scheduledPlows[player.name]) {
            game.state.scheduledPlows[player.name] = []
          }
          game.state.scheduledPlows[player.name].push(round)
        }
      }
      game.log.add({
        template: '{player} schedules fields to plow from Chain Float',
        args: { player },
      })
    },
  },
  {
    id: 'hayloft-barn-b021',
    name: 'Hayloft Barn',
    deck: 'minorB',
    number: 21,
    type: 'minor',
    cost: { wood: 3 },
    prereqs: { occupations: 1 },
    category: 'Food Provider',
    text: 'Place 4 food on this card. Each time you obtain at least 1 grain, you also get 1 food from this card. Once it is empty, you get a "Family Growth Even without Room" action.',
    onPlay(game, player) {
      player.hayloftBarnFood = 4
      game.log.add({
        template: '{player} places 4 food on Hayloft Barn',
        args: { player },
      })
    },
    onGainGrain(game, player) {
      if (player.hayloftBarnFood > 0) {
        player.hayloftBarnFood--
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Hayloft Barn ({remaining} remaining)',
          args: { player, remaining: player.hayloftBarnFood },
        })
        if (player.hayloftBarnFood === 0) {
          game.actions.familyGrowthWithoutRoom(player, { fromCard: true })
        }
      }
    },
  },
  {
    id: 'walking-boots-b022',
    name: 'Walking Boots',
    deck: 'minorB',
    number: 22,
    type: 'minor',
    cost: {},
    prereqs: { maxPeople: 4 },
    category: 'Actions Booster',
    text: 'You immediately get 2 food. You must immediately place a person from your supply. If you do, in the next returning home phase, you must remove that person from play.',
    onPlay(game, player) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Walking Boots',
        args: { player },
      })
      game.actions.walkingBootsEffect(player, this)
    },
  },
  {
    id: 'final-scenario-b023',
    name: 'Final Scenario',
    deck: 'minorB',
    number: 23,
    type: 'minor',
    cost: {},
    prereqs: { maxRound: 13 },
    category: 'Actions Booster',
    text: 'Place the action space card for round 14 face up in front of you. Only you can use it until it is placed on the game board.',
    onPlay(game, player) {
      player.finalScenarioActive = true
      game.log.add({
        template: '{player} claims exclusive access to round 14 action space via Final Scenario',
        args: { player },
      })
    },
  },
  {
    id: 'lasso-b024',
    name: 'Lasso',
    deck: 'minorB',
    number: 24,
    type: 'minor',
    cost: { reed: 1 },
    category: 'Actions Booster',
    text: 'You can place exactly two people immediately after one another if at least one of them uses the "Sheep Market", "Pig Market", or "Cattle Market" accumulation space.',
    allowDoubleWorkerPlacement: ['take-sheep', 'take-boar', 'take-cattle'],
  },
  {
    id: 'bread-paddle-b025',
    name: 'Bread Paddle',
    deck: 'minorB',
    number: 25,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Actions Booster',
    text: 'When you play this card, you immediately get 1 food. For each occupation you play, you get an additional "Bake Bread" action.',
    onPlay(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Bread Paddle',
        args: { player },
      })
    },
    onPlayOccupation(game, player) {
      game.log.add({
        template: '{player} gets an additional Bake Bread action from Bread Paddle',
        args: { player },
      })
      game.actions.bakeBread(player)
    },
  },
  {
    id: 'agrarian-fences-b026',
    name: 'Agrarian Fences',
    deck: 'minorB',
    number: 26,
    type: 'minor',
    cost: {},
    category: 'Actions Booster',
    text: 'Each time you use the "Grain Utilization" action space, you can take a "Build Fences" action instead of one of the two actions provided by the action space.',
    modifyGrainUtilization: true,
  },
  {
    id: 'toolbox-b027',
    name: 'Toolbox',
    deck: 'minorB',
    number: 27,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Actions Booster',
    text: 'In the work phase, after each turn in which you build at least 1 room, stable or fence, you can build the "Joinery", "Pottery", or "Basketmaker\'s Workshop" major improvement.',
    onBuildRoom(game, player) {
      game.actions.offerToolboxMajor(player, this)
    },
    onBuildStable(game, player) {
      game.actions.offerToolboxMajor(player, this)
    },
    onBuildFences(game, player) {
      game.actions.offerToolboxMajor(player, this)
    },
  },
  {
    id: 'forestry-studies-b028',
    name: 'Forestry Studies',
    deck: 'minorB',
    number: 28,
    type: 'minor',
    cost: { food: 2 },
    category: 'Actions Booster',
    text: 'Each time after you use the "Forest" accumulation space, you can return 2 wood to that space to play 1 occupation without paying an occupation cost.',
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' && player.wood >= 2) {
        game.actions.offerForestryStudies(player, this)
      }
    },
  },
  {
    id: 'cookery-lesson-b029',
    name: 'Cookery Lesson',
    deck: 'minorB',
    number: 29,
    type: 'minor',
    cost: { food: 2 },
    category: 'Points Provider',
    text: 'Each time you use a "Lessons" action space and a Cooking improvement on the same turn, you get 1 bonus point.',
    onLessonsWithCooking(game, player) {
      player.bonusPoints = (player.bonusPoints || 0) + 1
      game.log.add({
        template: '{player} gets 1 bonus point from Cookery Lesson',
        args: { player },
      })
    },
  },
  {
    id: 'wood-palisades-b030',
    name: 'Wood Palisades',
    deck: 'minorB',
    number: 30,
    type: 'minor',
    cost: { food: 1 },
    category: 'Points Provider',
    text: 'Instead of a fence piece, you can place 2 wood on fence spaces at the edge of your farmyard. These fence spaces with 2 wood are worth 1 bonus point.',
    allowWoodPalisades: true,
  },
  {
    id: 'pottery-yard-b031',
    name: 'Pottery Yard',
    deck: 'minorB',
    number: 31,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { hasPotteryOrUpgrade: true },
    category: 'Points Provider',
    text: 'During scoring, if there at least 2 orthogonally adjacent unused spaces in your farmyard, you get 2 bonus points. (You still get the negative points for those unused spaces.)',
    getEndGamePoints(player) {
      if (player.hasAdjacentUnusedSpaces(2)) {
        return 2
      }
      return 0
    },
  },
  {
    id: 'kettle-b032',
    name: 'Kettle',
    deck: 'minorB',
    number: 32,
    type: 'minor',
    cost: { clay: 1 },
    prereqs: { grainFields: 1 },
    category: 'Food Provider',
    text: 'At any time, you can exchange 1/3/5 grain for 3/4/5 food plus 0/1/2 bonus points.',
    allowsAnytimeExchange: true,
    kettleExchange: true,
  },
  {
    id: 'mantlepiece-b033',
    name: 'Mantlepiece',
    deck: 'minorB',
    number: 33,
    type: 'minor',
    cost: { stone: 1 },
    vps: -3,
    prereqs: { houseType: ['clay', 'stone'] },
    category: 'Points Provider',
    text: 'When you play this card, you immediately get 1 bonus point for each complete round left to play. You may no longer renovate your house.',
    onPlay(game, player) {
      const roundsLeft = 14 - game.state.round
      if (roundsLeft > 0) {
        player.bonusPoints = (player.bonusPoints || 0) + roundsLeft
        game.log.add({
          template: '{player} gets {points} bonus points from Mantlepiece',
          args: { player, points: roundsLeft },
        })
      }
      player.cannotRenovate = true
    },
  },
  {
    id: 'special-food-b034',
    name: 'Special Food',
    deck: 'minorB',
    number: 34,
    type: 'minor',
    cost: {},
    prereqs: { noAnimals: true },
    category: 'Points Provider',
    text: 'Once this game, the next time you take animals from an accumulation space and accommodate all of them on your farm, you get 1 bonus point for each such animal.',
    onPlay(game, player) {
      player.specialFoodActive = true
    },
    onTakeAnimals(game, player, animalCount, allAccommodated) {
      if (player.specialFoodActive && allAccommodated && animalCount > 0) {
        player.specialFoodActive = false
        player.bonusPoints = (player.bonusPoints || 0) + animalCount
        game.log.add({
          template: '{player} gets {points} bonus points from Special Food',
          args: { player, points: animalCount },
        })
      }
    },
  },
  {
    id: 'hook-knife-b035',
    name: 'Hook Knife',
    deck: 'minorB',
    number: 35,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Points Provider',
    text: 'Once this game, when you have 9/8/7/6/5/5 sheep on your farm in a 1-/2-/3-/4-/5-/6-player game, you immediately get 2 bonus points.',
    onPlay(game, player) {
      player.hookKnifeActive = true
    },
    checkTrigger(game, player) {
      if (!player.hookKnifeActive) {
        return
      }
      const playerCount = game.players.all().length
      const thresholds = { 1: 9, 2: 8, 3: 7, 4: 6, 5: 5, 6: 5 }
      const threshold = thresholds[playerCount] || 5
      const sheep = player.getTotalAnimals('sheep')
      if (sheep >= threshold) {
        player.hookKnifeActive = false
        player.bonusPoints = (player.bonusPoints || 0) + 2
        game.log.add({
          template: '{player} gets 2 bonus points from Hook Knife',
          args: { player },
        })
      }
    },
  },
  {
    id: 'bottles-b036',
    name: 'Bottles',
    deck: 'minorB',
    number: 36,
    type: 'minor',
    cost: { special: true },
    vps: 4,
    category: 'Points Provider',
    text: 'For each person you have, you must pay an additional 1 clay and 1 food to play this card.',
    getSpecialCost(player) {
      const people = player.familyMembers
      return { clay: people, food: people }
    },
  },
  {
    id: 'grange-b037',
    name: 'Grange',
    deck: 'minorB',
    number: 37,
    type: 'minor',
    cost: {},
    vps: 3,
    prereqs: { fields: 6, allAnimalTypes: true },
    category: 'Points Provider',
    text: 'When you play this card, you immediately get 1 food.',
    onPlay(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Grange',
        args: { player },
      })
    },
  },
  {
    id: 'future-building-site-b038',
    name: 'Future Building Site',
    deck: 'minorB',
    number: 38,
    type: 'minor',
    cost: {},
    vps: 3,
    prereqs: { maxRound: 4 },
    category: 'Farm Planner',
    text: 'Until all other farmyard spaces are used, you cannot use spaces that are orthogonally adjacent to your house.',
    futureBuildingSiteRestriction: true,
  },
  {
    id: 'loom-b039',
    name: 'Loom',
    deck: 'minorB',
    number: 39,
    type: 'minor',
    cost: { wood: 2 },
    vps: 1,
    prereqs: { occupations: 2 },
    category: 'Points Provider',
    text: 'In the field phase of each harvest, if you have at least 1/4/7 sheep, you get 1/2/3 food. During scoring, you get 1 bonus point for every 3 sheep.',
    onHarvest(game, player) {
      const sheep = player.getTotalAnimals('sheep')
      let food = 0
      if (sheep >= 7) {
        food = 3
      }
      else if (sheep >= 4) {
        food = 2
      }
      else if (sheep >= 1) {
        food = 1
      }

      if (food > 0) {
        player.addResource('food', food)
        game.log.add({
          template: '{player} gets {amount} food from Loom',
          args: { player, amount: food },
        })
      }
    },
    getEndGamePoints(player) {
      const sheep = player.getTotalAnimals('sheep')
      return Math.floor(sheep / 3)
    },
  },
  {
    id: 'brewery-pond-b040',
    name: 'Brewery Pond',
    deck: 'minorB',
    number: 40,
    type: 'minor',
    cost: {},
    vps: -1,
    prereqs: { occupations: 2 },
    category: 'Building Resource Provider',
    text: 'Each time you use the "Fishing" or "Reed Bank" accumulation space, you also get 1 grain and 1 wood.',
    onAction(game, player, actionId) {
      if (actionId === 'fishing' || actionId === 'take-reed') {
        player.addResource('grain', 1)
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 grain and 1 wood from Brewery Pond',
          args: { player },
        })
      }
    },
  },
  {
    id: 'hauberg-b041',
    name: 'Hauberg',
    deck: 'minorB',
    number: 41,
    type: 'minor',
    cost: { food: 3 },
    prereqs: { occupations: 3 },
    category: 'Building Resource Provider',
    text: 'Alternate placing 2 wood and 1 wild boar on the next 4 round spaces. You decide what to start with. At the start of these rounds, you get the goods.',
    onPlay(game, player) {
      game.actions.offerHauberg(player, this)
    },
  },
  {
    id: 'forest-inn-b042',
    name: 'Forest Inn',
    deck: 'minorB',
    number: 42,
    type: 'minor',
    cost: { clay: 1, reed: 1 },
    vps: 1,
    prereqs: { maxRound: 6 },
    category: 'Actions Booster',
    text: 'This is an action space for all. A player who uses it can exchange 5/7/9 wood for 8 wood and 2/4/7 food. When another player uses it, they must first pay you 1 food.',
    providesActionSpace: true,
    actionSpaceId: 'forest-inn',
    onActionSpaceUsed(game, actingPlayer, cardOwner) {
      if (actingPlayer.name !== cardOwner.name) {
        if (actingPlayer.food >= 1) {
          actingPlayer.removeResource('food', 1)
          cardOwner.addResource('food', 1)
          game.log.add({
            template: '{actingPlayer} pays 1 food to {owner} to use Forest Inn',
            args: { actingPlayer, owner: cardOwner },
          })
        }
      }
      game.actions.forestInnExchange(actingPlayer, this)
    },
  },
  {
    id: 'chophouse-b043',
    name: 'Chophouse',
    deck: 'minorB',
    number: 43,
    type: 'minor',
    cost: { wood: 2 },
    costAlternative: { clay: 2 },
    vps: 1,
    category: 'Food Provider',
    text: 'Each time you use the "Grain Seeds"/"Vegetable Seeds" action space, place 1 food on each of the next 3/2 round spaces. At the start of these rounds, you get the food.',
    onAction(game, player, actionId) {
      const currentRound = game.state.round
      let rounds = 0
      if (actionId === 'take-grain') {
        rounds = 3
      }
      else if (actionId === 'take-vegetable') {
        rounds = 2
      }

      if (rounds > 0) {
        for (let i = 1; i <= rounds; i++) {
          const round = currentRound + i
          if (round <= 14) {
            if (!game.state.scheduledFood) {
              game.state.scheduledFood = {}
            }
            if (!game.state.scheduledFood[player.name]) {
              game.state.scheduledFood[player.name] = {}
            }
            game.state.scheduledFood[player.name][round] =
              (game.state.scheduledFood[player.name][round] || 0) + 1
          }
        }
        game.log.add({
          template: '{player} places food on the next {count} round spaces from Chophouse',
          args: { player, count: rounds },
        })
      }
    },
  },
  {
    id: 'chick-stable-b044',
    name: 'Chick Stable',
    deck: 'minorB',
    number: 44,
    type: 'minor',
    cost: { wood: 1 },
    costAlternative: { clay: 1 },
    category: 'Food Provider',
    text: 'Add 3 and 4 to the current round and place 2 food on each corresponding round space. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (const offset of [3, 4]) {
        const round = currentRound + offset
        if (round <= 14) {
          if (!game.state.scheduledFood) {
            game.state.scheduledFood = {}
          }
          if (!game.state.scheduledFood[player.name]) {
            game.state.scheduledFood[player.name] = {}
          }
          game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 2
        }
      }
      game.log.add({
        template: '{player} schedules 2 food each for rounds from Chick Stable',
        args: { player },
      })
    },
  },
  {
    id: 'strawberry-patch-b045',
    name: 'Strawberry Patch',
    deck: 'minorB',
    number: 45,
    type: 'minor',
    cost: { wood: 1 },
    vps: 2,
    prereqs: { vegetableFields: 2 },
    category: 'Food Provider',
    text: 'Place 1 food on each of the next 3 round spaces. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let i = 1; i <= 3; i++) {
        const round = currentRound + i
        if (round <= 14) {
          if (!game.state.scheduledFood) {
            game.state.scheduledFood = {}
          }
          if (!game.state.scheduledFood[player.name]) {
            game.state.scheduledFood[player.name] = {}
          }
          game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} places food on the next 3 round spaces from Strawberry Patch',
        args: { player },
      })
    },
  },
  {
    id: 'club-house-b046',
    name: 'Club House',
    deck: 'minorB',
    number: 46,
    type: 'minor',
    cost: { wood: 3 },
    costAlternative: { clay: 2 },
    vps: 1,
    category: 'Building Resource Provider',
    text: 'Place 1 food on each of the next 4 round spaces and 1 stone on the round space after that. At the start of these rounds, you get the respective good.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let i = 1; i <= 4; i++) {
        const round = currentRound + i
        if (round <= 14) {
          if (!game.state.scheduledFood) {
            game.state.scheduledFood = {}
          }
          if (!game.state.scheduledFood[player.name]) {
            game.state.scheduledFood[player.name] = {}
          }
          game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 1
        }
      }
      const stoneRound = currentRound + 5
      if (stoneRound <= 14) {
        if (!game.state.scheduledStone) {
          game.state.scheduledStone = {}
        }
        if (!game.state.scheduledStone[player.name]) {
          game.state.scheduledStone[player.name] = {}
        }
        game.state.scheduledStone[player.name][stoneRound] =
          (game.state.scheduledStone[player.name][stoneRound] || 0) + 1
      }
      game.log.add({
        template: '{player} schedules food and stone from Club House',
        args: { player },
      })
    },
  },
  {
    id: 'herring-pot-b047',
    name: 'Herring Pot',
    deck: 'minorB',
    number: 47,
    type: 'minor',
    cost: { clay: 1 },
    category: 'Food Provider',
    text: 'Each time you use the "Fishing" accumulation space, place 1 food on each of the next 3 round spaces. At the start of these rounds, you get the food.',
    onAction(game, player, actionId) {
      if (actionId === 'fishing') {
        const currentRound = game.state.round
        for (let i = 1; i <= 3; i++) {
          const round = currentRound + i
          if (round <= 14) {
            if (!game.state.scheduledFood) {
              game.state.scheduledFood = {}
            }
            if (!game.state.scheduledFood[player.name]) {
              game.state.scheduledFood[player.name] = {}
            }
            game.state.scheduledFood[player.name][round] =
              (game.state.scheduledFood[player.name][round] || 0) + 1
          }
        }
        game.log.add({
          template: '{player} places food on the next 3 round spaces from Herring Pot',
          args: { player },
        })
      }
    },
  },
  {
    id: 'forest-stone-b048',
    name: 'Forest Stone',
    deck: 'minorB',
    number: 48,
    type: 'minor',
    cost: { wood: 2 },
    costAlternative: { stone: 1 },
    vps: 1,
    prereqs: { occupations: 1 },
    category: 'Food Provider',
    text: 'Place 2 food on this card. Each time you use a wood accumulation space, move 1 of these food to your supply. Each time you use a stone accumulation space, add 2 food to this card.',
    onPlay(game, player) {
      player.forestStoneFood = 2
      game.log.add({
        template: '{player} places 2 food on Forest Stone',
        args: { player },
      })
    },
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
        if (player.forestStoneFood > 0) {
          player.forestStoneFood--
          player.addResource('food', 1)
          game.log.add({
            template: '{player} gets 1 food from Forest Stone ({remaining} remaining)',
            args: { player, remaining: player.forestStoneFood },
          })
        }
      }
      else if (actionId === 'take-stone-1' || actionId === 'take-stone-2') {
        player.forestStoneFood = (player.forestStoneFood || 0) + 2
        game.log.add({
          template: '{player} adds 2 food to Forest Stone ({total} total)',
          args: { player, total: player.forestStoneFood },
        })
      }
    },
  },
  {
    id: 'scales-b049',
    name: 'Scales',
    deck: 'minorB',
    number: 49,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { noOccupations: true },
    category: 'Food Provider',
    text: 'Each time after you place an improvement or occupation in front of you, if you have the same number of improvements and occupations in play, you get 2 food.',
    onBuildImprovement(game, player) {
      const imps = player.getImprovementCount()
      const occs = player.occupationsPlayed || 0
      if (imps === occs) {
        player.addResource('food', 2)
        game.log.add({
          template: '{player} gets 2 food from Scales',
          args: { player },
        })
      }
    },
    onPlayOccupation(game, player) {
      const imps = player.getImprovementCount()
      const occs = player.occupationsPlayed || 0
      if (imps === occs) {
        player.addResource('food', 2)
        game.log.add({
          template: '{player} gets 2 food from Scales',
          args: { player },
        })
      }
    },
  },
  {
    id: 'butter-churn-b050',
    name: 'Butter Churn',
    deck: 'minorB',
    number: 50,
    type: 'minor',
    cost: { wood: 1 },
    vps: 1,
    prereqs: { occupations: 3, occupationsAtMost: true },
    category: 'Food Provider',
    text: 'In the field phase of each harvest, you get 1 food for every 3 sheep and 1 food for every 2 cattle you have.',
    onHarvest(game, player) {
      const sheep = player.getTotalAnimals('sheep')
      const cattle = player.getTotalAnimals('cattle')
      const food = Math.floor(sheep / 3) + Math.floor(cattle / 2)
      if (food > 0) {
        player.addResource('food', food)
        game.log.add({
          template: '{player} gets {amount} food from Butter Churn',
          args: { player, amount: food },
        })
      }
    },
  },
  {
    id: 'digging-spade-b051',
    name: 'Digging Spade',
    deck: 'minorB',
    number: 51,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { minRound: 7 },
    category: 'Food Provider',
    text: 'Each time you use a clay accumulation space, you also get a number of food equal to the number of wild boar in your farmyard.',
    onAction(game, player, actionId) {
      if (actionId === 'take-clay' || actionId === 'take-clay-2') {
        const boar = player.getAnimalsInFarmyard('boar')
        if (boar > 0) {
          player.addResource('food', boar)
          game.log.add({
            template: '{player} gets {amount} food from Digging Spade',
            args: { player, amount: boar },
          })
        }
      }
    },
  },
  {
    id: 'growing-farm-b052',
    name: 'Growing Farm',
    deck: 'minorB',
    number: 52,
    type: 'minor',
    cost: { clay: 2, reed: 1 },
    vps: 2,
    prereqs: { pastureSpacesGteRound: true },
    category: 'Food Provider',
    text: 'You can only play this card if you have at least as many pasture spaces as the number of completed rounds. If you do, you get a number of food equal to the current round.',
    onPlay(game, player) {
      const food = game.state.round
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from Growing Farm',
        args: { player, amount: food },
      })
    },
  },
  {
    id: 'sculpture-course-b053',
    name: 'Sculpture Course',
    deck: 'minorB',
    number: 53,
    type: 'minor',
    cost: { grain: 1 },
    category: 'Food Provider',
    text: 'At the end of each round that does not end with a harvest, you can use this card to exchange either 1 wood for 2 food, or 1 stone for 4 food.',
    onRoundEnd(game, player, round) {
      if (!game.isHarvestRound(round) && (player.wood >= 1 || player.stone >= 1)) {
        game.actions.offerSculptureCourse(player, this)
      }
    },
  },
  {
    id: 'tumbrel-b054',
    name: 'Tumbrel',
    deck: 'minorB',
    number: 54,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'When you play this card, you immediately get 2 food. Each time after you take a "Sow" action, you get 1 food for each stable you have.',
    onPlay(game, player) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Tumbrel',
        args: { player },
      })
    },
    onSow(game, player) {
      const stables = player.getStableCount()
      if (stables > 0) {
        player.addResource('food', stables)
        game.log.add({
          template: '{player} gets {amount} food from Tumbrel',
          args: { player, amount: stables },
        })
      }
    },
  },
  {
    id: 'maintenance-premium-b055',
    name: 'Maintenance Premium',
    deck: 'minorB',
    number: 55,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 2 },
    category: 'Food Provider',
    text: 'Place 3 food on this card. Each time you use a wood accumulation space, you get 1 food from this card. Each time you renovate, restock this card to 3 food.',
    onPlay(game, player) {
      player.maintenancePremiumFood = 3
      game.log.add({
        template: '{player} places 3 food on Maintenance Premium',
        args: { player },
      })
    },
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
        if (player.maintenancePremiumFood > 0) {
          player.maintenancePremiumFood--
          player.addResource('food', 1)
          game.log.add({
            template: '{player} gets 1 food from Maintenance Premium ({remaining} remaining)',
            args: { player, remaining: player.maintenancePremiumFood },
          })
        }
      }
    },
    onRenovate(game, player) {
      player.maintenancePremiumFood = 3
      game.log.add({
        template: '{player} restocks Maintenance Premium to 3 food',
        args: { player },
      })
    },
  },
  {
    id: 'brook-b056',
    name: 'Brook',
    deck: 'minorB',
    number: 56,
    type: 'minor',
    cost: {},
    prereqs: { personOnFishing: true },
    category: 'Food Provider',
    text: 'Each time you use one of the four action spaces above the "Fishing" accumulation space (Reed Bank, Clay Pit, Forest, or the round 1 action card), you get 1 additional food.',
    onAction(game, player, actionId) {
      // The four action spaces above Fishing: Reed Bank, Clay Pit, Forest, and round 1 card
      const aboveFishing = ['take-reed', 'take-clay', 'take-wood']
      // Add the round 1 card (which varies based on shuffle)
      const round1CardId = game.state.roundCardDeck[0]?.id
      if (round1CardId) {
        aboveFishing.push(round1CardId)
      }
      if (aboveFishing.includes(actionId)) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Brook',
          args: { player },
        })
      }
    },
  },
  {
    id: 'scullery-b057',
    name: 'Scullery',
    deck: 'minorB',
    number: 57,
    type: 'minor',
    cost: { wood: 1, clay: 1 },
    category: 'Food Provider',
    text: 'At the start of each round, if you live in a wooden house, you get 1 food.',
    onRoundStart(game, player) {
      if (player.roomType === 'wood') {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Scullery',
          args: { player },
        })
      }
    },
  },
  {
    id: 'crack-weeder-b058',
    name: 'Crack Weeder',
    deck: 'minorB',
    number: 58,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'When you play this card, you immediately get 1 food. For each vegetable you take from a field in the field phase of a harvest, you also get 1 food.',
    onPlay(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Crack Weeder',
        args: { player },
      })
    },
    onHarvestVegetables(game, player, count) {
      if (count > 0) {
        player.addResource('food', count)
        game.log.add({
          template: '{player} gets {amount} food from Crack Weeder',
          args: { player, amount: count },
        })
      }
    },
  },
  {
    id: 'food-chest-b059',
    name: 'Food Chest',
    deck: 'minorB',
    number: 59,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'If you play this card on the "Major Improvement" action space, you immediately get 4 food. If you play it on another action space, you immediately get 2 food.',
    onPlay(game, player, actionId) {
      const food = actionId === 'major-improvement' ? 4 : 2
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from Food Chest',
        args: { player, amount: food },
      })
    },
  },
  {
    id: 'brewing-water-b060',
    name: 'Brewing Water',
    deck: 'minorB',
    number: 60,
    type: 'minor',
    cost: {},
    category: 'Food Provider',
    text: 'Each time you use the "Fishing" accumulation space, you can pay 1 grain to place 1 food on each of the next 6 round spaces. At the start of these rounds, you get the food.',
    onAction(game, player, actionId) {
      if (actionId === 'fishing' && player.grain >= 1) {
        game.actions.offerBrewingWater(player, this)
      }
    },
  },
  {
    id: 'three-field-rotation-b061',
    name: 'Three-Field Rotation',
    deck: 'minorB',
    number: 61,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 3 },
    category: 'Food Provider',
    text: 'At the start of the field phase of each harvest, if you have at least 1 grain field, 1 vegetable field, and 1 empty field, you get 3 food.',
    onHarvest(game, player) {
      const hasGrainField = player.getGrainFieldCount() > 0
      let hasVegetableField = false
      let hasEmptyField = false
      const rows = player.farmyard.grid.length
      const cols = player.farmyard.grid[0].length
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const space = player.farmyard.grid[r][c]
          if (space.type === 'field' && space.crop === 'vegetables') {
            hasVegetableField = true
          }
          if (space.type === 'field' && !space.crop) {
            hasEmptyField = true
          }
        }
      }
      if (hasGrainField && hasVegetableField && hasEmptyField) {
        player.addResource('food', 3)
        game.log.add({
          template: '{player} gets 3 food from Three-Field Rotation',
          args: { player },
        })
      }
    },
  },
  {
    id: 'pitchfork-b062',
    name: 'Pitchfork',
    deck: 'minorB',
    number: 62,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'Each time you use the "Grain Seeds" action space, if the "Farmland" action space is occupied you also get 3 food.',
    onAction(game, player, actionId) {
      if (actionId === 'take-grain') {
        const plowSpace = game.state.actionSpaces['plow-field']
        if (plowSpace && plowSpace.occupiedBy) {
          player.addResource('food', 3)
          game.log.add({
            template: '{player} gets 3 food from Pitchfork',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'tasting-b063',
    name: 'Tasting',
    deck: 'minorB',
    number: 63,
    type: 'minor',
    cost: { wood: 2 },
    vps: 1,
    category: 'Food Provider',
    text: 'Each time you use a "Lessons" action space, before you pay the occupation cost, you can exchange 1 grain for 4 food.',
    onLessons(game, player) {
      if (player.grain >= 1) {
        game.actions.offerTasting(player, this)
      }
    },
  },
  {
    id: 'mill-wheel-b064',
    name: 'Mill Wheel',
    deck: 'minorB',
    number: 64,
    type: 'minor',
    cost: { wood: 2 },
    vps: 1,
    category: 'Food Provider',
    text: 'Each time you use the "Grain Utilization" action space while the "Fishing" accumulation space is occupied, you get an additional 2 food.',
    onAction(game, player, actionId) {
      if (actionId === 'sow-bake') {
        const fishingSpace = game.state.actionSpaces['fishing']
        if (fishingSpace && fishingSpace.occupiedBy) {
          player.addResource('food', 2)
          game.log.add({
            template: '{player} gets 2 food from Mill Wheel',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'grain-depot-b065',
    name: 'Grain Depot',
    deck: 'minorB',
    number: 65,
    type: 'minor',
    cost: { wood: 2 },
    costAlternative: { clay: 2 },
    costAlternative2: { stone: 2 },
    category: 'Crop Provider',
    text: 'If you paid wood/clay/stone for this card, place 1 grain on each of the next 2/3/4 round spaces. At the start of these rounds, you get the grain.',
    onPlay(game, player, paidWith) {
      const currentRound = game.state.round
      let rounds = 2
      if (paidWith === 'clay') {
        rounds = 3
      }
      else if (paidWith === 'stone') {
        rounds = 4
      }

      for (let i = 1; i <= rounds; i++) {
        const round = currentRound + i
        if (round <= 14) {
          if (!game.state.scheduledGrain) {
            game.state.scheduledGrain = {}
          }
          if (!game.state.scheduledGrain[player.name]) {
            game.state.scheduledGrain[player.name] = {}
          }
          game.state.scheduledGrain[player.name][round] =
            (game.state.scheduledGrain[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules grain from Grain Depot',
        args: { player },
      })
    },
  },
  {
    id: 'sack-cart-b066',
    name: 'Sack Cart',
    deck: 'minorB',
    number: 66,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { occupations: 2 },
    category: 'Crop Provider',
    text: 'Place 1 grain each on the remaining spaces for rounds 5, 8, 11, and 14. At the start of these rounds, you get the grain.',
    onPlay(game, player) {
      const currentRound = game.state.round
      const targetRounds = [5, 8, 11, 14].filter(r => r > currentRound)
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
        template: '{player} schedules grain from Sack Cart',
        args: { player },
      })
    },
  },
  {
    id: 'hand-truck-b067',
    name: 'Hand Truck',
    deck: 'minorB',
    number: 67,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Crop Provider',
    text: 'Each time before you take a "Bake Bread" action, you also get 1 grain for each of your people occupying an accumulation space.',
    onBake(game, player) {
      const count = player.getPeopleOnAccumulationSpaces()
      if (count > 0) {
        player.addResource('grain', count)
        game.log.add({
          template: '{player} gets {amount} grain from Hand Truck',
          args: { player, amount: count },
        })
      }
    },
  },
  {
    id: 'beanfield-b068',
    name: 'Beanfield',
    deck: 'minorB',
    number: 68,
    type: 'minor',
    cost: { food: 1 },
    vps: 1,
    prereqs: { occupations: 2 },
    category: 'Crop Provider',
    text: 'This card is a field that can only grow vegetables.',
    providesVegetableField: true,
    onPlay(game, player) {
      player.beanfieldActive = true
      game.log.add({
        template: '{player} plays Beanfield, gaining a vegetable-only field',
        args: { player },
      })
    },
  },
  {
    id: 'potters-market-b069',
    name: "Potter's Market",
    deck: 'minorB',
    number: 69,
    type: 'minor',
    cost: { wood: 2 },
    vps: 1,
    category: 'Crop Provider',
    text: 'At any time, you can pay 3 clay and 2 food. If you do, place 1 vegetable on each of the next 2 round spaces. At the start of these rounds, you get the vegetable.',
    allowsAnytimePurchase: true,
    pottersMarketPurchase: true,
  },
  {
    id: 'new-purchase-b070',
    name: 'New Purchase',
    deck: 'minorB',
    number: 70,
    type: 'minor',
    cost: {},
    category: 'Crop Provider',
    text: 'Before the start of each round that ends with a harvest, you can buy one of each of the following crops: 2 food → 1 grain; 4 food → 1 vegetable.',
    onRoundStart(game, player, round) {
      if (game.isHarvestRound(round) && (player.food >= 2)) {
        game.actions.offerNewPurchase(player, this)
      }
    },
  },
  {
    id: 'harvest-house-b071',
    name: 'Harvest House',
    deck: 'minorB',
    number: 71,
    type: 'minor',
    cost: { wood: 1, clay: 1, reed: 1 },
    vps: 2,
    category: 'Crop Provider',
    text: 'When you play this card, if the number of completed harvests is equal to the number of occupations you played, you immediately get 1 food, 1 grain and 1 vegetable.',
    onPlay(game, player) {
      const harvests = game.getCompletedHarvestCount()
      const occs = player.occupationsPlayed || 0
      if (harvests === occs) {
        player.addResource('food', 1)
        player.addResource('grain', 1)
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 food, 1 grain, and 1 vegetable from Harvest House',
          args: { player },
        })
      }
    },
  },
  {
    id: 'love-for-agriculture-b072',
    name: 'Love for Agriculture',
    deck: 'minorB',
    number: 72,
    type: 'minor',
    cost: {},
    category: 'Farm Planner',
    text: 'You can sow crops in pastures covering 1 or 2 farmyard spaces. If you do, these pastures are also considered fields and hold 1 and 2 animals less, respectively.',
    allowSowInSmallPastures: true,
  },
  {
    id: 'gift-basket-b073',
    name: 'Gift Basket',
    deck: 'minorB',
    number: 73,
    type: 'minor',
    cost: { reed: 1 },
    vps: 1,
    prereqs: { occupations: 3 },
    category: 'Crop Provider',
    text: 'When you play this card, if you have exactly 2/3/4/5 rooms, you immediately get 1 vegetable/food/grain/vegetable.',
    onPlay(game, player) {
      const rooms = player.getRoomCount()
      if (rooms === 2) {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from Gift Basket',
          args: { player },
        })
      }
      else if (rooms === 3) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Gift Basket',
          args: { player },
        })
      }
      else if (rooms === 4) {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Gift Basket',
          args: { player },
        })
      }
      else if (rooms === 5) {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from Gift Basket',
          args: { player },
        })
      }
    },
  },
  {
    id: 'thick-forest-b074',
    name: 'Thick Forest',
    deck: 'minorB',
    number: 74,
    type: 'minor',
    cost: {},
    prereqs: { clay: 5 },
    category: 'Building Resource Provider',
    text: 'Place 1 wood on each remaining even-numbered round space. At the start of these rounds, you get the wood.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let round = 2; round <= 14; round += 2) {
        if (round > currentRound) {
          if (!game.state.scheduledWood) {
            game.state.scheduledWood = {}
          }
          if (!game.state.scheduledWood[player.name]) {
            game.state.scheduledWood[player.name] = {}
          }
          game.state.scheduledWood[player.name][round] =
            (game.state.scheduledWood[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules wood from Thick Forest',
        args: { player },
      })
    },
  },
  {
    id: 'wood-workshop-b075',
    name: 'Wood Workshop',
    deck: 'minorB',
    number: 75,
    type: 'minor',
    cost: { clay: 1 },
    prereqs: { occupations: 1 },
    category: 'Building Resource Provider',
    text: 'Each time before you play or build an improvement, you get 1 wood.',
    onBuildImprovement(game, player) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Wood Workshop',
        args: { player },
      })
    },
  },
  {
    id: 'ceilings-b076',
    name: 'Ceilings',
    deck: 'minorB',
    number: 76,
    type: 'minor',
    cost: { clay: 1 },
    prereqs: { occupations: 1 },
    category: 'Building Resource Provider',
    text: 'Place 1 wood on the next 5 round spaces. At the start of these rounds, you get the wood. Remove the wood promised by this card from future round spaces the next time you renovate.',
    onPlay(game, player) {
      const currentRound = game.state.round
      player.ceilingsRounds = []
      for (let i = 1; i <= 5; i++) {
        const round = currentRound + i
        if (round <= 14) {
          if (!game.state.scheduledWood) {
            game.state.scheduledWood = {}
          }
          if (!game.state.scheduledWood[player.name]) {
            game.state.scheduledWood[player.name] = {}
          }
          game.state.scheduledWood[player.name][round] =
            (game.state.scheduledWood[player.name][round] || 0) + 1
          player.ceilingsRounds.push(round)
        }
      }
      game.log.add({
        template: '{player} schedules wood from Ceilings',
        args: { player },
      })
    },
    onRenovate(game, player) {
      if (player.ceilingsRounds && player.ceilingsRounds.length > 0) {
        for (const round of player.ceilingsRounds) {
          if (game.state.scheduledWood && game.state.scheduledWood[player.name] && game.state.scheduledWood[player.name][round]) {
            game.state.scheduledWood[player.name][round]--
            if (game.state.scheduledWood[player.name][round] <= 0) {
              delete game.state.scheduledWood[player.name][round]
            }
          }
        }
        player.ceilingsRounds = []
        game.log.add({
          template: '{player} removes scheduled wood from Ceilings due to renovation',
          args: { player },
        })
      }
    },
  },
  {
    id: 'loam-pit-b077',
    name: 'Loam Pit',
    deck: 'minorB',
    number: 77,
    type: 'minor',
    cost: { food: 1 },
    vps: 1,
    prereqs: { occupations: 3 },
    category: 'Building Resource Provider',
    text: 'Each time you use the "Day Laborer" action space, you also get 3 clay.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
        player.addResource('clay', 3)
        game.log.add({
          template: '{player} gets 3 clay from Loam Pit',
          args: { player },
        })
      }
    },
  },
  {
    id: 'reed-belt-b078',
    name: 'Reed Belt',
    deck: 'minorB',
    number: 78,
    type: 'minor',
    cost: { food: 2 },
    category: 'Building Resource Provider',
    text: 'Place 1 reed on each remaining space for rounds 5, 8, 10, and 12. At the start of these rounds, you get the reed.',
    onPlay(game, player) {
      const currentRound = game.state.round
      const targetRounds = [5, 8, 10, 12].filter(r => r > currentRound)
      for (const round of targetRounds) {
        if (!game.state.scheduledReed) {
          game.state.scheduledReed = {}
        }
        if (!game.state.scheduledReed[player.name]) {
          game.state.scheduledReed[player.name] = {}
        }
        game.state.scheduledReed[player.name][round] =
          (game.state.scheduledReed[player.name][round] || 0) + 1
      }
      game.log.add({
        template: '{player} schedules reed from Reed Belt',
        args: { player },
      })
    },
  },
  {
    id: 'corf-b079',
    name: 'Corf',
    deck: 'minorB',
    number: 79,
    type: 'minor',
    cost: { reed: 1 },
    category: 'Building Resource Provider',
    text: 'Each time any player (including you) takes at least 3 stone from an accumulation space, you get 1 stone from the general supply.',
    onAnyAction(game, actingPlayer, actionId, cardOwner, details) {
      if ((actionId === 'take-stone-1' || actionId === 'take-stone-2') && details && details.stoneTaken >= 3) {
        cardOwner.addResource('stone', 1)
        game.log.add({
          template: '{player} gets 1 stone from Corf',
          args: { player: cardOwner },
        })
      }
    },
  },
  {
    id: 'hard-porcelain-b080',
    name: 'Hard Porcelain',
    deck: 'minorB',
    number: 80,
    type: 'minor',
    cost: { clay: 1 },
    category: 'Building Resource Provider',
    text: 'At any time, you can exchange 2/3/4 clay for 1/2/3 stone.',
    allowsAnytimeExchange: true,
    exchangeRates: { clay: 2, stone: 1 },
  },
  {
    id: 'handcart-b081',
    name: 'Handcart',
    deck: 'minorB',
    number: 81,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Building Resource Provider',
    text: 'Before the start of each work phase, you can take 1 building resource from a wood/clay/reed/stone accumulation space with at least 6/5/4/4 building resources of the same type. You can only take 1 resource per round.',
    onWorkPhaseStart(game, player) {
      game.actions.offerHandcart(player, this)
    },
  },
  {
    id: 'value-assets-b082',
    name: 'Value Assets',
    deck: 'minorB',
    number: 82,
    type: 'minor',
    cost: {},
    category: 'Building Resource Provider',
    text: 'After each harvest, you can buy exactly one of the following building resources: 1 food → 1 wood; 1 food → 1 clay; 2 food → 1 reed; 2 food → 1 stone.',
    onHarvestEnd(game, player) {
      if (player.food >= 1) {
        game.actions.offerValueAssets(player, this)
      }
    },
  },
  {
    id: 'muddy-puddles-b083',
    name: 'Muddy Puddles',
    deck: 'minorB',
    number: 83,
    type: 'minor',
    cost: { clay: 2 },
    category: 'Livestock Provider',
    text: 'Pile (from bottom to top) 1 wild boar, 1 food, 1 cattle, 1 food, and 1 sheep on this card. At any time, you can pay 1 clay to take the top good.',
    onPlay(game, player) {
      player.muddyPuddlesStack = ['boar', 'food', 'cattle', 'food', 'sheep']
      game.log.add({
        template: '{player} places goods on Muddy Puddles',
        args: { player },
      })
    },
    allowsAnytimePurchase: true,
    muddyPuddlesPurchase: true,
  },
  {
    id: 'acorns-basket-b084',
    name: 'Acorns Basket',
    deck: 'minorB',
    number: 84,
    type: 'minor',
    cost: { reed: 1 },
    prereqs: { occupations: 3 },
    category: 'Livestock Provider',
    text: 'Place 1 wild boar on each of the next 2 round spaces. At the start of these rounds, you get the wild boar.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let i = 1; i <= 2; i++) {
        const round = currentRound + i
        if (round <= 14) {
          if (!game.state.scheduledBoar) {
            game.state.scheduledBoar = {}
          }
          if (!game.state.scheduledBoar[player.name]) {
            game.state.scheduledBoar[player.name] = {}
          }
          game.state.scheduledBoar[player.name][round] =
            (game.state.scheduledBoar[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules wild boar from Acorns Basket',
        args: { player },
      })
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
