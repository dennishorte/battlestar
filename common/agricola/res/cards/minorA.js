/**
 * Minor Improvements A Cards for Agricola (Revised Edition)
 * Cards A001-A084 - A standalone minor improvements deck
 */

const minorImprovements = [
  {
    id: 'shelter-a001',
    name: 'Shelter',
    deck: 'minorA',
    number: 1,
    type: 'minor',
    cost: {},
    category: 'Farm Planner',
    text: 'You can immediately build a stable at no cost, but only if you place it in a pasture covering exactly 1 farmyard space.',
    onPlay(game, player) {
      const singleSpacePastures = (player.farmyard.pastures || []).filter(p => p.spaces.length === 1 && !player.hasStableAt(p.spaces[0]))
      if (singleSpacePastures.length > 0) {
        game.actions.offerBuildFreeStableInSinglePasture(player, this, singleSpacePastures)
      }
    },
  },
  {
    id: 'shifting-cultivation-a002',
    name: 'Shifting Cultivation',
    deck: 'minorA',
    number: 2,
    type: 'minor',
    cost: { food: 2 },
    passLeft: true,
    category: 'Farm Planner',
    text: 'Immediately plow 1 field.',
    onPlay(game, player) {
      game.actions.plowField(player, { immediate: true })
    },
  },
  {
    id: 'paper-knife-a003',
    name: 'Paper Knife',
    deck: 'minorA',
    number: 3,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Actions Booster',
    prereqs: { occupationsInHand: 3 },
    text: 'Select 3 occupations in your hand. Select one of them randomly, which you can play immediately without paying an occupation cost.',
    onPlay(game, player) {
      game.actions.paperKnifeEffect(player, this)
    },
  },
  {
    id: 'baseboards-a004',
    name: 'Baseboards',
    deck: 'minorA',
    number: 4,
    type: 'minor',
    cost: { food: 2, grain: 1 },
    category: 'Building Resource Provider',
    text: 'You immediately get 1 wood for each room you have. If you have more rooms than people, you get 1 additional wood.',
    onPlay(game, player) {
      const rooms = player.getRoomCount()
      const people = player.familyMembers
      let bonus = rooms
      if (rooms > people) {
        bonus++
      }
      if (bonus > 0) {
        player.addResource('wood', bonus)
        game.log.add({
          template: '{player} gets {amount} wood from Baseboards',
          args: { player, amount: bonus },
        })
      }
    },
  },
  {
    id: 'clay-embankment-a005',
    name: 'Clay Embankment',
    deck: 'minorA',
    number: 5,
    type: 'minor',
    cost: { food: 1 },
    passLeft: true,
    category: 'Building Resource Provider',
    text: 'You immediately get 1 clay for every 2 clay you already have in your supply.',
    onPlay(game, player) {
      const bonus = Math.floor(player.clay / 2)
      if (bonus > 0) {
        player.addResource('clay', bonus)
        game.log.add({
          template: '{player} gets {amount} clay from Clay Embankment',
          args: { player, amount: bonus },
        })
      }
    },
  },
  {
    id: 'storage-barn-a006',
    name: 'Storage Barn',
    deck: 'minorA',
    number: 6,
    type: 'minor',
    cost: {},
    category: 'Building Resource Provider',
    text: 'If you have the Well, Joinery, Pottery, and/or Basketmaker\'s Workshop, you immediately get 1 stone, 1 wood, 1 clay, and/or 1 reed, respectively.',
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
  },
  {
    id: 'gardeners-knife-a007',
    name: "Gardener's Knife",
    deck: 'minorA',
    number: 7,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'You immediately get 1 food for each grain field you have and 1 grain for each vegetable field you have.',
    onPlay(game, player) {
      const grainFields = player.getGrainFieldCount()
      const vegFields = player.getVegetableFieldCount()
      if (grainFields > 0) {
        player.addResource('food', grainFields)
        game.log.add({
          template: '{player} gets {amount} food from Gardener\'s Knife',
          args: { player, amount: grainFields },
        })
      }
      if (vegFields > 0) {
        player.addResource('grain', vegFields)
        game.log.add({
          template: '{player} gets {amount} grain from Gardener\'s Knife',
          args: { player, amount: vegFields },
        })
      }
    },
  },
  {
    id: 'food-basket-a008',
    name: 'Food Basket',
    deck: 'minorA',
    number: 8,
    type: 'minor',
    cost: { reed: 1 },
    prereqs: { occupations: 2, improvements: 2 },
    category: 'Crop Provider',
    text: 'You immediately get 1 grain and 1 vegetable.',
    onPlay(game, player) {
      player.addResource('grain', 1)
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 grain and 1 vegetable from Food Basket',
        args: { player },
      })
    },
  },
  {
    id: 'young-animal-market-a009',
    name: 'Young Animal Market',
    deck: 'minorA',
    number: 9,
    type: 'minor',
    cost: { sheep: 1 },
    passLeft: true,
    category: 'Livestock Provider',
    text: 'You immediately get 1 cattle. (Effectively, you are exchanging 1 sheep for 1 cattle.)',
    onPlay(game, player) {
      if (player.canPlaceAnimals('cattle', 1)) {
        player.addAnimals('cattle', 1)
        game.log.add({
          template: '{player} gets 1 cattle from Young Animal Market',
          args: { player },
        })
      }
    },
  },
  {
    id: 'wooden-shed-a010',
    name: 'Wooden Shed',
    deck: 'minorA',
    number: 10,
    type: 'minor',
    cost: { wood: 2, reed: 1 },
    prereqs: { houseType: 'wood' },
    category: 'Farm Planner',
    vps: 0,
    text: 'This card can only be played via a "Major Improvement" action. It provides room for one person. You may no longer renovate.',
    requiresMajorImprovementAction: true,
    providesRoom: true,
    onPlay(game, player) {
      player.cannotRenovate = true
      game.log.add({
        template: '{player} can no longer renovate (Wooden Shed)',
        args: { player },
      })
    },
  },
  {
    id: 'mud-patch-a011',
    name: 'Mud Patch',
    deck: 'minorA',
    number: 11,
    type: 'minor',
    cost: {},
    category: 'Livestock Provider',
    text: 'When you play this card, you immediately get 1 wild boar. You can hold 1 wild boar on each of your unplanted field tiles.',
    onPlay(game, player) {
      if (player.canPlaceAnimals('boar', 1)) {
        player.addAnimals('boar', 1)
        game.log.add({
          template: '{player} gets 1 wild boar from Mud Patch',
          args: { player },
        })
      }
    },
    allowBoarOnFields: true,
  },
  {
    id: 'drinking-trough-a012',
    name: 'Drinking Trough',
    deck: 'minorA',
    number: 12,
    type: 'minor',
    cost: { clay: 1 },
    category: 'Farm Planner',
    text: 'Each of your pastures (with or without a stable) can hold up to 2 more animals.',
    modifyPastureCapacity(player, pasture, baseCapacity) {
      return baseCapacity + 2
    },
  },
  {
    id: 'renovation-company-a013',
    name: 'Renovation Company',
    deck: 'minorA',
    number: 13,
    type: 'minor',
    cost: { wood: 4 },
    prereqs: { roomCount: 2, roomCountExact: true, houseType: 'wood' },
    category: 'Farm Planner',
    text: 'When you play this card, you immediately get 3 clay. Immediately after, you can renovate without paying any building resources.',
    onPlay(game, player) {
      player.addResource('clay', 3)
      game.log.add({
        template: '{player} gets 3 clay from Renovation Company',
        args: { player },
      })
      game.actions.offerFreeRenovation(player, this)
    },
  },
  {
    id: 'carpenters-hammer-a014',
    name: "Carpenter's Hammer",
    deck: 'minorA',
    number: 14,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Building Resource Provider',
    text: 'Each time you build at least 2 wood/clay/stone rooms at once, you get a total discount of 2 reed as well as 2 wood/3 clay/4 stone.',
    modifyMultiRoomCost(player, cost, roomCount, roomType) {
      if (roomCount >= 2) {
        const discount = {
          reed: 2,
          [roomType]: roomType === 'wood' ? 2 : (roomType === 'clay' ? 3 : 4),
        }
        return {
          ...cost,
          reed: Math.max(0, (cost.reed || 0) - discount.reed),
          [roomType]: Math.max(0, (cost[roomType] || 0) - discount[roomType]),
        }
      }
      return cost
    },
  },
  {
    id: 'carpenters-axe-a015',
    name: "Carpenter's Axe",
    deck: 'minorA',
    number: 15,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Farm Planner',
    text: 'Each time after you use a wood accumulation space, if you then have at least 7 wood in your supply, you can build exactly 1 stable for 1 wood.',
    onAction(game, player, actionId) {
      if ((actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') && player.wood >= 7) {
        game.actions.offerBuildStableForWood(player, this, 1)
      }
    },
  },
  {
    id: 'rammed-clay-a016',
    name: 'Rammed Clay',
    deck: 'minorA',
    number: 16,
    type: 'minor',
    cost: {},
    category: 'Farm Planner',
    text: 'When you play this card, you immediately get 1 clay. You can use clay instead of wood to build fences.',
    onPlay(game, player) {
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 clay from Rammed Clay',
        args: { player },
      })
    },
    modifyFenceCost() {
      return { wood: 1, alternateResource: 'clay' }
    },
  },
  {
    id: 'reclamation-plow-a017',
    name: 'Reclamation Plow',
    deck: 'minorA',
    number: 17,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Farm Planner',
    text: 'After the next time you take animals from an accumulation space and accommodate all of them on your farm, you can plow 1 field.',
    onPlay(game, player) {
      player.reclamationPlowActive = true
    },
    onTakeAnimals(game, player, allAccommodated) {
      if (player.reclamationPlowActive && allAccommodated) {
        player.reclamationPlowActive = false
        game.actions.plowField(player, { immediate: true })
      }
    },
  },
  {
    id: 'wheel-plow-a018',
    name: 'Wheel Plow',
    deck: 'minorA',
    number: 18,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { occupations: 2 },
    category: 'Farm Planner',
    text: 'Once this game, when you use the "Farmland" or "Cultivation" action space with the first person you place in a round, you can plow 2 additional fields.',
    onAction(game, player, actionId) {
      if (!player.wheelPlowUsed && (actionId === 'plow-field' || actionId === 'plow-sow')) {
        if (player.isFirstWorkerThisRound()) {
          player.wheelPlowUsed = true
          game.log.add({
            template: '{player} plows 2 additional fields from Wheel Plow',
            args: { player },
          })
          game.actions.plowField(player, { immediate: true })
          game.actions.plowField(player, { immediate: true })
        }
      }
    },
  },
  {
    id: 'handplow-a019',
    name: 'Handplow',
    deck: 'minorA',
    number: 19,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Farm Planner',
    text: 'Add 5 to the current round and place 1 field tile on the corresponding round space. At the start of that round, you can plow the field.',
    onPlay(game, player) {
      const targetRound = game.state.round + 5
      if (targetRound <= 14) {
        if (!game.state.scheduledPlows) {
          game.state.scheduledPlows = {}
        }
        if (!game.state.scheduledPlows[player.name]) {
          game.state.scheduledPlows[player.name] = []
        }
        game.state.scheduledPlows[player.name].push(targetRound)
        game.log.add({
          template: '{player} schedules a field to plow in round {round}',
          args: { player, round: targetRound },
        })
      }
    },
  },
  {
    id: 'double-turn-plow-a020',
    name: 'Double-Turn Plow',
    deck: 'minorA',
    number: 20,
    type: 'minor',
    cost: { grain: 1 },
    prereqs: { maxRound: 5 },
    category: 'Farm Planner',
    text: 'When you play this card, you can immediately plow up to 2 fields.',
    getSpecialCost(player, game) {
      if (game && game.state.round >= 4) {
        return { grain: 1, food: 1 }
      }
      return { grain: 1 }
    },
    onPlay(game, player) {
      game.actions.plowField(player, { immediate: true, optional: true })
      game.actions.plowField(player, { immediate: true, optional: true })
    },
  },
  {
    id: 'family-friendly-home-a021',
    name: 'Family Friendly Home',
    deck: 'minorA',
    number: 21,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 1 },
    category: 'Actions Booster',
    text: 'Each time you take a "Build Rooms" action while having more rooms than people already, you also get a "Family Growth" action and 1 food.',
    onBuildRoom(game, player) {
      if (player.getRoomCount() > player.familyMembers) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Family Friendly Home',
          args: { player },
        })
        game.actions.familyGrowth(player, { fromCard: true })
      }
    },
  },
  {
    id: 'telegram-a022',
    name: 'Telegram',
    deck: 'minorA',
    number: 22,
    type: 'minor',
    cost: { food: 2 },
    vps: 1,
    prereqs: { fencesInSupply: 1 },
    category: 'Actions Booster',
    text: 'Add 1 to the current round for each fence in your supply and mark the corresponding round space. In that round only, you can place a person from your supply.',
    onPlay(game, player) {
      const fences = player.getFencesInSupply()
      const targetRound = game.state.round + fences
      if (targetRound <= 14) {
        if (!game.state.telegramRounds) {
          game.state.telegramRounds = {}
        }
        game.state.telegramRounds[player.name] = targetRound
        game.log.add({
          template: '{player} schedules a temporary worker for round {round} via Telegram',
          args: { player, round: targetRound },
        })
      }
    },
  },
  {
    id: 'stone-company-a023',
    name: 'Stone Company',
    deck: 'minorA',
    number: 23,
    type: 'minor',
    cost: { clay: 2, reed: 1 },
    vps: 1,
    category: 'Actions Booster',
    text: 'Immediately after each time you use a "Quarry" accumulation space, you get a "Major or Minor Improvement" action during which you must spend at least 1 stone.',
    onAction(game, player, actionId) {
      if (actionId === 'take-stone-1' || actionId === 'take-stone-2') {
        game.log.add({
          template: '{player} gets an improvement action from Stone Company',
          args: { player },
        })
        game.actions.buildImprovement(player, { requireStone: true })
      }
    },
  },
  {
    id: 'threshing-board-a024',
    name: 'Threshing Board',
    deck: 'minorA',
    number: 24,
    type: 'minor',
    cost: { wood: 1 },
    vps: 1,
    prereqs: { occupations: 2 },
    category: 'Actions Booster',
    text: 'Each time you use the "Farmland" or "Cultivation" action space, you get an additional "Bake Bread" action.',
    onAction(game, player, actionId) {
      if (actionId === 'plow-field' || actionId === 'plow-sow') {
        game.log.add({
          template: '{player} gets an additional Bake Bread action from Threshing Board',
          args: { player },
        })
        game.actions.bakeBread(player)
      }
    },
  },
  {
    id: 'bassinet-a025',
    name: 'Bassinet',
    deck: 'minorA',
    number: 25,
    type: 'minor',
    cost: { wood: 1, reed: 1 },
    category: 'Actions Booster',
    text: 'Each work phase, you can place a(nother) person on the first non-accumulating action space used by any player (including you), as long as there is only 1 person on that space.',
    allowsBassinetPlacement: true,
  },
  {
    id: 'sleeping-corner-a026',
    name: 'Sleeping Corner',
    deck: 'minorA',
    number: 26,
    type: 'minor',
    cost: { wood: 1 },
    vps: 1,
    prereqs: { grainFields: 2 },
    category: 'Actions Booster',
    text: 'You can use any "Wish for Children" action space even if it is occupied by one other player\'s person.',
    allowOccupiedFamilyGrowth: true,
  },
  {
    id: 'oven-site-a027',
    name: 'Oven Site',
    deck: 'minorA',
    number: 27,
    type: 'minor',
    cost: {},
    prereqs: { hasFireplaceAndCookingHearth: true },
    category: 'Building Resource Provider',
    text: 'When you play this card, you get 2 wood and you can immediately build the "Clay Oven" or "Stone Oven" major improvement. Either way, it only costs you 1 clay and 1 stone.',
    onPlay(game, player) {
      player.addResource('wood', 2)
      game.log.add({
        template: '{player} gets 2 wood from Oven Site',
        args: { player },
      })
      game.actions.offerDiscountedOven(player, this, { clay: 1, stone: 1 })
    },
  },
  {
    id: 'forest-school-a028',
    name: 'Forest School',
    deck: 'minorA',
    number: 28,
    type: 'minor',
    cost: { wood: 1, clay: 1 },
    vps: 1,
    category: 'Actions Booster',
    text: 'You can consider the "Lessons" action spaces not occupied. You can replace each food that an occupation costs with wood.',
    allowIgnoreLessonsOccupied: true,
    modifyOccupationCost(player, cost) {
      if (cost.food) {
        return { ...cost, food: 0, woodOrFood: cost.food }
      }
      return cost
    },
  },
  {
    id: 'ale-benches-a029',
    name: 'Ale-Benches',
    deck: 'minorA',
    number: 29,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { occupations: 2 },
    category: 'Points Provider',
    text: 'In the returning home phase of each round, you can pay exactly 1 grain from your supply to get 1 bonus point. If you do, each other player gets 1 food.',
    onReturnHome(game, player) {
      if (player.grain >= 1) {
        game.actions.offerAleBenches(player, this)
      }
    },
  },
  {
    id: 'baking-sheet-a030',
    name: 'Baking Sheet',
    deck: 'minorA',
    number: 30,
    type: 'minor',
    cost: {},
    prereqs: { noGrainFields: true },
    category: 'Food Provider',
    text: 'Each time you take a "Bake Bread" action, you can use this card to exchange exactly 1 grain for 2 food and 1 bonus point.',
    onBake(game, player) {
      if (player.grain >= 1) {
        game.actions.offerBakingSheet(player, this)
      }
    },
  },
  {
    id: 'debt-security-a031',
    name: 'Debt Security',
    deck: 'minorA',
    number: 31,
    type: 'minor',
    cost: { food: 2 },
    category: 'Points Provider',
    text: 'During scoring, you get 1 bonus point for each major improvement you have, up to the number of your unused farmyard spaces.',
    getEndGamePoints(player) {
      const majorCount = (player.majorImprovements || []).length
      const unusedSpaces = player.getUnusedFarmyardSpaceCount()
      return Math.min(majorCount, unusedSpaces)
    },
  },
  {
    id: 'manger-a032',
    name: 'Manger',
    deck: 'minorA',
    number: 32,
    type: 'minor',
    cost: { wood: 2 },
    category: 'Points Provider',
    text: 'During scoring, if your pastures cover at least 6/7/8/10 farmyard spaces, you get 1/2/3/4 bonus points.',
    getEndGamePoints(player) {
      const pastureSpaces = player.getPastureSpaceCount()
      if (pastureSpaces >= 10) {
        return 4
      }
      if (pastureSpaces >= 8) {
        return 3
      }
      if (pastureSpaces >= 7) {
        return 2
      }
      if (pastureSpaces >= 6) {
        return 1
      }
      return 0
    },
  },
  {
    id: 'big-country-a033',
    name: 'Big Country',
    deck: 'minorA',
    number: 33,
    type: 'minor',
    cost: {},
    prereqs: { allFarmyardUsed: true },
    category: 'Points Provider',
    text: 'For each complete round left to play, you immediately get 1 bonus point and 2 food.',
    onPlay(game, player) {
      const roundsLeft = 14 - game.state.round
      if (roundsLeft > 0) {
        player.bonusPoints = (player.bonusPoints || 0) + roundsLeft
        player.addResource('food', roundsLeft * 2)
        game.log.add({
          template: '{player} gets {points} bonus points and {food} food from Big Country',
          args: { player, points: roundsLeft, food: roundsLeft * 2 },
        })
      }
    },
  },
  {
    id: 'loppers-a034',
    name: 'Loppers',
    deck: 'minorA',
    number: 34,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { occupations: 2 },
    category: 'Points Provider',
    text: 'Each time you build 1 or more fences, you can also use this card to exchange 1 wood and 1 fence in your supply for 2 food and 1 bonus point.',
    onBuildFences(game, player) {
      if (player.wood >= 1 && player.getFencesInSupply() >= 1) {
        game.actions.offerLoppers(player, this)
      }
    },
  },
  {
    id: 'swimming-class-a035',
    name: 'Swimming Class',
    deck: 'minorA',
    number: 35,
    type: 'minor',
    cost: { food: 1 },
    prereqs: { occupations: 2 },
    category: 'Points Provider',
    text: 'In the returning home phase of each round, if you return a person from the "Fishing" accumulation space, you get 2 bonus points for each newborn that you return home.',
    onReturnHome(game, player) {
      if (player.usedFishingThisRound) {
        const newborns = player.getNewbornsReturningHome()
        if (newborns > 0) {
          const points = newborns * 2
          player.bonusPoints = (player.bonusPoints || 0) + points
          game.log.add({
            template: '{player} gets {points} bonus points from Swimming Class',
            args: { player, points },
          })
        }
      }
    },
  },
  {
    id: 'facades-carving-a036',
    name: 'Facades Carving',
    deck: 'minorA',
    number: 36,
    type: 'minor',
    cost: { clay: 2, reed: 1 },
    prereqs: { woodGteRound: true },
    category: 'Points Provider',
    text: 'When you play this card, you can exchange any number of food for 1 bonus point each, up to the number of completed harvests.',
    onPlay(game, player) {
      const harvests = game.getCompletedHarvestCount()
      if (harvests > 0 && player.food >= 1) {
        game.actions.offerFacadesCarving(player, this, harvests)
      }
    },
  },
  {
    id: 'bucksaw-a037',
    name: 'Bucksaw',
    deck: 'minorA',
    number: 37,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Points Provider',
    text: 'Each time you renovate, you can also pay 1 wood to get 1 bonus point and 1 grain.',
    onRenovate(game, player) {
      if (player.wood >= 1) {
        game.actions.offerBucksaw(player, this)
      }
    },
  },
  {
    id: 'wool-blankets-a038',
    name: 'Wool Blankets',
    deck: 'minorA',
    number: 38,
    type: 'minor',
    cost: {},
    prereqs: { sheep: 5 },
    category: 'Points Provider',
    text: 'During scoring, if you live in a wooden/clay/stone house by then, you get 3/2/0 bonus points.',
    getEndGamePoints(player) {
      if (player.roomType === 'wood') {
        return 3
      }
      if (player.roomType === 'clay') {
        return 2
      }
      return 0
    },
  },
  {
    id: 'chapel-a039',
    name: 'Chapel',
    deck: 'minorA',
    number: 39,
    type: 'minor',
    cost: { wood: 3, clay: 2 },
    vps: 3,
    prereqs: { occupations: 2 },
    category: 'Points Provider',
    text: 'This is an action space for all. A player who uses it gets 3 bonus points. If another player uses it, they must first pay you 1 grain.',
    providesActionSpace: true,
    actionSpaceId: 'chapel',
    onActionSpaceUsed(game, actingPlayer, cardOwner) {
      if (actingPlayer.name !== cardOwner.name) {
        if (actingPlayer.grain >= 1) {
          actingPlayer.removeResource('grain', 1)
          cardOwner.addResource('grain', 1)
          game.log.add({
            template: '{actingPlayer} pays 1 grain to {owner} to use Chapel',
            args: { actingPlayer, owner: cardOwner },
          })
        }
      }
      actingPlayer.bonusPoints = (actingPlayer.bonusPoints || 0) + 3
      game.log.add({
        template: '{player} gets 3 bonus points from Chapel',
        args: { player: actingPlayer },
      })
    },
  },
  {
    id: 'potters-yard-a040',
    name: "Potter's Yard",
    deck: 'minorA',
    number: 40,
    type: 'minor',
    cost: { wood: 1, reed: 1 },
    prereqs: { unusedFarmyardAtMost: 7 },
    category: 'Building Resource Provider',
    text: 'Immediately place 1 clay on each unused space in your farmyard. Each time you turn a space into a used space, you get the clay and you can immediately exchange it for 2 food.',
    onPlay(game, player) {
      const unused = player.getUnusedFarmyardSpaceCount()
      if (unused > 0) {
        player.pottersYardClay = unused
        game.log.add({
          template: '{player} places {amount} clay on unused farmyard spaces',
          args: { player, amount: unused },
        })
      }
    },
    onUseSpace(game, player) {
      if (player.pottersYardClay > 0) {
        player.pottersYardClay--
        player.addResource('clay', 1)
        game.log.add({
          template: '{player} gets 1 clay from Potter\'s Yard',
          args: { player },
        })
        game.actions.offerClayForFood(player, this)
      }
    },
  },
  {
    id: 'vegetable-slicer-a041',
    name: 'Vegetable Slicer',
    deck: 'minorA',
    number: 41,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Crop Provider',
    text: 'Each time you upgrade a Fireplace to a Cooking Hearth, you immediately get 2 wood and 1 vegetable (not retroactively).',
    onUpgradeFireplace(game, player) {
      player.addResource('wood', 2)
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 2 wood and 1 vegetable from Vegetable Slicer',
        args: { player },
      })
    },
  },
  {
    id: 'forest-lake-hut-a042',
    name: 'Forest Lake Hut',
    deck: 'minorA',
    number: 42,
    type: 'minor',
    cost: { clay: 2 },
    vps: 1,
    category: 'Food Provider',
    text: 'Each time you use the "Fishing"/"Forest" accumulation space, you also get 1 wood/food.',
    onAction(game, player, actionId) {
      if (actionId === 'fishing') {
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 wood from Forest Lake Hut',
          args: { player },
        })
      }
      else if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Forest Lake Hut',
          args: { player },
        })
      }
    },
  },
  {
    id: 'farmyard-manure-a043',
    name: 'Farmyard Manure',
    deck: 'minorA',
    number: 43,
    type: 'minor',
    cost: {},
    prereqs: { animals: 1 },
    category: 'Food Provider',
    text: 'Each time you build 1 or more stables in one turn, you place 1 food on each of the next 3 round spaces. At the start of these rounds, you get the food.',
    onBuildStable(game, player) {
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
        template: '{player} places food on the next 3 round spaces from Farmyard Manure',
        args: { player },
      })
    },
  },
  {
    id: 'pond-hut-a044',
    name: 'Pond Hut',
    deck: 'minorA',
    number: 44,
    type: 'minor',
    cost: { wood: 1 },
    vps: 1,
    prereqs: { occupations: 2, occupationsExact: true },
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
        template: '{player} places food on the next 3 round spaces',
        args: { player },
      })
    },
  },
  {
    id: 'fire-protection-pond-a045',
    name: 'Fire Protection Pond',
    deck: 'minorA',
    number: 45,
    type: 'minor',
    cost: { food: 1 },
    prereqs: { houseType: 'wood' },
    category: 'Food Provider',
    text: 'Once you no longer live in a wooden house, place 1 food on each of the next 6 round spaces. At the start of these rounds, you get the food.',
    checkTrigger(game, player) {
      if (player.roomType !== 'wood' && !player.fireProtectionPondTriggered) {
        player.fireProtectionPondTriggered = true
        const currentRound = game.state.round
        for (let i = 1; i <= 6; i++) {
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
          template: '{player} schedules food from Fire Protection Pond',
          args: { player },
        })
      }
    },
  },
  {
    id: 'claw-knife-a046',
    name: 'Claw Knife',
    deck: 'minorA',
    number: 46,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { pastures: 1, pasturesExact: true },
    category: 'Food Provider',
    text: 'Each time you use the "Sheep Market" accumulation space, place 1 food on each of the next 2 round spaces. At the start of these rounds, you get the food.',
    onAction(game, player, actionId) {
      if (actionId === 'take-sheep') {
        const currentRound = game.state.round
        for (let i = 1; i <= 2; i++) {
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
          template: '{player} places food on the next 2 round spaces from Claw Knife',
          args: { player },
        })
      }
    },
  },
  {
    id: 'trellises-a047',
    name: 'Trellises',
    deck: 'minorA',
    number: 47,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'Immediately place 1 food on each of the next round spaces, up to the number of fences you have built. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const fences = player.getBuiltFenceCount()
      const currentRound = game.state.round
      for (let i = 1; i <= fences && currentRound + i <= 14; i++) {
        const round = currentRound + i
        if (!game.state.scheduledFood) {
          game.state.scheduledFood = {}
        }
        if (!game.state.scheduledFood[player.name]) {
          game.state.scheduledFood[player.name] = {}
        }
        game.state.scheduledFood[player.name][round] =
          (game.state.scheduledFood[player.name][round] || 0) + 1
      }
      if (fences > 0) {
        game.log.add({
          template: '{player} places food on the next {count} round spaces from Trellises',
          args: { player, count: Math.min(fences, 14 - currentRound) },
        })
      }
    },
  },
  {
    id: 'shaving-horse-a048',
    name: 'Shaving Horse',
    deck: 'minorA',
    number: 48,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'Each time after you obtain at least 1 wood, if you then have 5 or more wood in your supply, you can exchange 1 wood for 3 food. With 7 or more wood, you must do so.',
    onGainWood(game, player) {
      if (player.wood >= 7) {
        player.removeResource('wood', 1)
        player.addResource('food', 3)
        game.log.add({
          template: '{player} must exchange 1 wood for 3 food from Shaving Horse',
          args: { player },
        })
      }
      else if (player.wood >= 5) {
        game.actions.offerShavingHorse(player, this)
      }
    },
  },
  {
    id: 'nest-site-a049',
    name: 'Nest Site',
    deck: 'minorA',
    number: 49,
    type: 'minor',
    cost: { food: 1 },
    prereqs: { occupations: 1 },
    category: 'Food Provider',
    text: 'Each time 1 reed is placed on a non-empty "Reed Bank" accumulation space during the preparation phase, you get 1 food.',
    onReedBankReplenish(game, player, wasNonEmpty) {
      if (wasNonEmpty) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Nest Site',
          args: { player },
        })
      }
    },
  },
  {
    id: 'milk-jug-a050',
    name: 'Milk Jug',
    deck: 'minorA',
    number: 50,
    type: 'minor',
    cost: { clay: 1 },
    category: 'Food Provider',
    text: 'Each time any player (including you) uses the "Cattle Market" accumulation space, you get 3 food, and each other player gets 1 food.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'take-cattle') {
        cardOwner.addResource('food', 3)
        game.log.add({
          template: '{player} gets 3 food from Milk Jug',
          args: { player: cardOwner },
        })
        for (const player of game.players.all()) {
          if (player.name !== cardOwner.name) {
            player.addResource('food', 1)
            game.log.add({
              template: '{player} gets 1 food from Milk Jug',
              args: { player },
            })
          }
        }
      }
    },
  },
  {
    id: 'drift-net-boat-a051',
    name: 'Drift-Net Boat',
    deck: 'minorA',
    number: 51,
    type: 'minor',
    cost: { wood: 1, reed: 1 },
    vps: 1,
    category: 'Food Provider',
    text: 'Each time you use the "Fishing" accumulation space, you get an additional 2 food.',
    onAction(game, player, actionId) {
      if (actionId === 'fishing') {
        player.addResource('food', 2)
        game.log.add({
          template: '{player} gets 2 additional food from Drift-Net Boat',
          args: { player },
        })
      }
    },
  },
  {
    id: 'throwing-axe-a052',
    name: 'Throwing Axe',
    deck: 'minorA',
    number: 52,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { minRound: 7 },
    category: 'Food Provider',
    text: 'Each time you use a wood accumulation space while there is at least 1 wild boar on the "Pig Market" accumulation space, you also get 2 food.',
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
        const pigMarket = game.state.actionSpaces['take-boar']
        if (pigMarket && pigMarket.accumulated >= 1) {
          player.addResource('food', 2)
          game.log.add({
            template: '{player} gets 2 food from Throwing Axe',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'claypipe-a053',
    name: 'Claypipe',
    deck: 'minorA',
    number: 53,
    type: 'minor',
    cost: { clay: 1 },
    category: 'Food Provider',
    text: 'In the returning home phase of each round, if you gained at least 7 building resources in the preceding work phase, you get 2 food.',
    onReturnHome(game, player) {
      const gained = player.resourcesGainedThisRound || {}
      const buildingResources = (gained.wood || 0) + (gained.clay || 0) +
                                (gained.stone || 0) + (gained.reed || 0)
      if (buildingResources >= 7) {
        player.addResource('food', 2)
        game.log.add({
          template: '{player} gets 2 food from Claypipe',
          args: { player },
        })
      }
    },
  },
  {
    id: 'credit-a054',
    name: 'Credit',
    deck: 'minorA',
    number: 54,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 3, occupationsAtMost: true },
    category: 'Food Provider',
    text: 'When you play this card, you immediately get 5 food. At the end of each round that does not end with a harvest, you must pay 1 food, or else take a begging marker.',
    onPlay(game, player) {
      player.addResource('food', 5)
      player.creditActive = true
      game.log.add({
        template: '{player} gets 5 food from Credit',
        args: { player },
      })
    },
    onRoundEnd(game, player, round) {
      if (player.creditActive && !game.isHarvestRound(round)) {
        if (player.food >= 1) {
          player.removeResource('food', 1)
          game.log.add({
            template: '{player} pays 1 food for Credit',
            args: { player },
          })
        }
        else {
          player.beggingMarkers = (player.beggingMarkers || 0) + 1
          game.log.add({
            template: '{player} takes a begging marker (Credit)',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'junk-room-a055',
    name: 'Junk Room',
    deck: 'minorA',
    number: 55,
    type: 'minor',
    cost: { wood: 1, clay: 1 },
    category: 'Food Provider',
    text: 'Each time after you build an improvement, including this one, you get 1 food.',
    onPlay(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Junk Room',
        args: { player },
      })
    },
    onBuildImprovement(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Junk Room',
        args: { player },
      })
    },
  },
  {
    id: 'basket-a056',
    name: 'Basket',
    deck: 'minorA',
    number: 56,
    type: 'minor',
    cost: { reed: 1 },
    category: 'Food Provider',
    text: 'Immediately after each time you use a wood accumulation space, you can exchange 2 wood for 3 food. If you do, place those 2 wood on the accumulation space.',
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
        if (player.wood >= 2) {
          game.actions.offerWoodForFoodExchange(player, this, { wood: 2, food: 3 })
        }
      }
    },
  },
  {
    id: 'milking-parlor-a057',
    name: 'Milking Parlor',
    deck: 'minorA',
    number: 57,
    type: 'minor',
    cost: { wood: 2 },
    vps: 1,
    prereqs: { unusedFarmyard: 4 },
    category: 'Food Provider',
    text: 'When you play this card, if you have at least 1/3/4 sheep, you immediately get 2/3/4 food. The same applies if you have at least 1/2/3 cattle.',
    onPlay(game, player) {
      const sheep = player.getTotalAnimals('sheep')
      const cattle = player.getTotalAnimals('cattle')
      let food = 0

      if (sheep >= 4) {
        food += 4
      }
      else if (sheep >= 3) {
        food += 3
      }
      else if (sheep >= 1) {
        food += 2
      }

      if (cattle >= 3) {
        food += 4
      }
      else if (cattle >= 2) {
        food += 3
      }
      else if (cattle >= 1) {
        food += 2
      }

      if (food > 0) {
        player.addResource('food', food)
        game.log.add({
          template: '{player} gets {amount} food from Milking Parlor',
          args: { player, amount: food },
        })
      }
    },
  },
  {
    id: 'asparagus-knife-a058',
    name: 'Asparagus Knife',
    deck: 'minorA',
    number: 58,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Crop Provider',
    text: 'In the returning home phase of rounds 8, 10, and 12, you can take 1 vegetable from exactly 1 vegetable field. You can immediately exchange it for 3 food and 1 bonus point.',
    onReturnHome(game, player) {
      const round = game.state.round
      if ((round === 8 || round === 10 || round === 12) && player.getVegetableFieldCount() > 0) {
        game.actions.offerAsparagusKnife(player, this)
      }
    },
  },
  {
    id: 'potato-ridger-a059',
    name: 'Potato Ridger',
    deck: 'minorA',
    number: 59,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Crop Provider',
    text: 'Each time after you harvest 1+ vegetables, if you then have 3+ vegetables in your supply, you can turn exactly 1 vegetable into 6 food. With 4+ vegetables, you must do so.',
    onHarvestVegetables(game, player) {
      if (player.vegetables >= 4) {
        player.removeResource('vegetables', 1)
        player.addResource('food', 6)
        game.log.add({
          template: '{player} must convert 1 vegetable to 6 food from Potato Ridger',
          args: { player },
        })
      }
      else if (player.vegetables >= 3) {
        game.actions.offerPotatoRidger(player, this)
      }
    },
  },
  {
    id: 'oriental-fireplace-a060',
    name: 'Oriental Fireplace',
    deck: 'minorA',
    number: 60,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { returnFireplaceOrCookingHearth: true },
    category: 'Food Provider',
    text: 'At any time, you may convert goods to food as follows: Vegetable → 4 food; Sheep → 3 food; Cattle → 5 food. Whenever you bake bread, you may convert: Grain → 2 food.',
    countsAsMajorOrMinor: true,
    anytimeConversions: [
      { from: 'vegetables', to: 'food', rate: 4 },
      { from: 'sheep', to: 'food', rate: 3 },
      { from: 'cattle', to: 'food', rate: 5 },
    ],
    bakingConversion: { from: 'grain', to: 'food', rate: 2 },
  },
  {
    id: 'winnowing-fan-a061',
    name: 'Winnowing Fan',
    deck: 'minorA',
    number: 61,
    type: 'minor',
    cost: { reed: 1 },
    prereqs: { bakingImprovement: true },
    category: 'Food Provider',
    text: 'After the field phase of each harvest, you can use a baking improvement but only to turn exactly 1 grain into food. (This is not considered a "Bake Bread" action.)',
    onFieldPhaseEnd(game, player) {
      if (player.grain >= 1 && player.hasBakingImprovement()) {
        game.actions.offerWinnowingFan(player, this)
      }
    },
  },
  {
    id: 'beer-keg-a062',
    name: 'Beer Keg',
    deck: 'minorA',
    number: 62,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { grain: 2 },
    category: 'Food Provider',
    text: 'In the feeding phase of each harvest, you can use this card to exchange 1/2/3 grain for 0/1/2 bonus points and exactly 3 food.',
    onFeedingPhase(game, player) {
      if (player.grain >= 1) {
        game.actions.offerBeerKeg(player, this)
      }
    },
  },
  {
    id: 'dutch-windmill-a063',
    name: 'Dutch Windmill',
    deck: 'minorA',
    number: 63,
    type: 'minor',
    cost: { wood: 2, stone: 2 },
    vps: 2,
    category: 'Food Provider',
    text: 'Each time you take a "Bake Bread" action in a round immediately following a harvest, you get 3 additional food.',
    onBake(game, player) {
      const lastHarvest = game.state.lastHarvestRound || 0
      if (game.state.round === lastHarvest + 1) {
        player.addResource('food', 3)
        game.log.add({
          template: '{player} gets 3 additional food from Dutch Windmill',
          args: { player },
        })
      }
    },
  },
  {
    id: 'barley-mill-a064',
    name: 'Barley Mill',
    deck: 'minorA',
    number: 64,
    type: 'minor',
    cost: { wood: 1, clay: 4 },
    costAlternative: { wood: 1, stone: 2 },
    vps: 1,
    category: 'Food Provider',
    text: 'In the field phase of each harvest, you get 1 food for each grain field that you harvest.',
    onHarvest(game, player) {
      const grainFields = player.getGrainFieldCount()
      if (grainFields > 0) {
        player.addResource('food', grainFields)
        game.log.add({
          template: '{player} gets {amount} food from Barley Mill',
          args: { player, amount: grainFields },
        })
      }
    },
  },
  {
    id: 'seed-pellets-a065',
    name: 'Seed Pellets',
    deck: 'minorA',
    number: 65,
    type: 'minor',
    cost: {},
    prereqs: { fields: 3 },
    category: 'Crop Provider',
    text: 'Each time before you take an unconditional "Sow" action, you get 1 grain.',
    onSow(game, player, isUnconditional) {
      if (isUnconditional) {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Seed Pellets',
          args: { player },
        })
      }
    },
  },
  {
    id: 'feeding-dish-a066',
    name: 'Feeding Dish',
    deck: 'minorA',
    number: 66,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Crop Provider',
    text: 'Each time you use an animal accumulation space while already having an animal of that type, you get 1 grain.',
    onAction(game, player, actionId) {
      const animalMarkets = {
        'take-sheep': 'sheep',
        'take-boar': 'boar',
        'take-cattle': 'cattle',
      }
      const animalType = animalMarkets[actionId]
      if (animalType && player.getTotalAnimals(animalType) > 0) {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Feeding Dish',
          args: { player },
        })
      }
    },
  },
  {
    id: 'corn-scoop-a067',
    name: 'Corn Scoop',
    deck: 'minorA',
    number: 67,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Crop Provider',
    text: 'Each time you use the "Grain Seeds" action space, you get 1 additional grain.',
    onAction(game, player, actionId) {
      if (actionId === 'take-grain') {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 additional grain from Corn Scoop',
          args: { player },
        })
      }
    },
  },
  {
    id: 'asparagus-gift-a068',
    name: 'Asparagus Gift',
    deck: 'minorA',
    number: 68,
    type: 'minor',
    cost: {},
    prereqs: { unplantedFields: 1 },
    category: 'Crop Provider',
    text: 'Each time you build a number of fences equal to or greater than the current round, you immediately get 1 vegetable.',
    onBuildFences(game, player, fenceCount) {
      if (fenceCount >= game.state.round) {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from Asparagus Gift',
          args: { player },
        })
      }
    },
  },
  {
    id: 'large-greenhouse-a069',
    name: 'Large Greenhouse',
    deck: 'minorA',
    number: 69,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { occupations: 2 },
    category: 'Crop Provider',
    text: 'Add 4, 7, and 9 to the current round and place 1 vegetable on each corresponding round space. At the start of these rounds, you get the vegetable.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (const offset of [4, 7, 9]) {
        const round = currentRound + offset
        if (round <= 14) {
          if (!game.state.scheduledVegetables) {
            game.state.scheduledVegetables = {}
          }
          if (!game.state.scheduledVegetables[player.name]) {
            game.state.scheduledVegetables[player.name] = {}
          }
          game.state.scheduledVegetables[player.name][round] =
            (game.state.scheduledVegetables[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules vegetables from Large Greenhouse',
        args: { player },
      })
    },
  },
  {
    id: 'lifting-machine-a070',
    name: 'Lifting Machine',
    deck: 'minorA',
    number: 70,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { fields: 3 },
    category: 'Crop Provider',
    text: 'At the end of each round that does not end with a harvest, you can move 1 vegetable from one of your fields to your supply. (This is not considered a field phase.)',
    onRoundEnd(game, player, round) {
      if (!game.isHarvestRound(round) && player.getVegetableFieldCount() > 0) {
        game.actions.offerLiftingMachine(player, this)
      }
    },
  },
  {
    id: 'clearing-spade-a071',
    name: 'Clearing Spade',
    deck: 'minorA',
    number: 71,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Crop Provider',
    text: 'At any time, you can move 1 crop from a planted field containing at least 2 crops to an empty field.',
    allowsAnytimeCropMove: true,
  },
  {
    id: 'calcium-fertilizers-a072',
    name: 'Calcium Fertilizers',
    deck: 'minorA',
    number: 72,
    type: 'minor',
    cost: {},
    prereqs: { noFields: true },
    category: 'Crop Provider',
    text: 'Each time you use a "Quarry" accumulation space, add 1 additional good of the respective type to each of your planted fields growing a single type of crop.',
    onAction(game, player, actionId) {
      if (actionId === 'take-stone-1' || actionId === 'take-stone-2') {
        const plantedFields = player.getPlantedFields()
        for (const field of plantedFields) {
          if (field.cropCount > 0) {
            player.addCropToField(field, 1)
            game.log.add({
              template: '{player} adds 1 {crop} to a field from Calcium Fertilizers',
              args: { player, crop: field.crop },
            })
          }
        }
      }
    },
  },
  {
    id: 'agricultural-fertilizers-a073',
    name: 'Agricultural Fertilizers',
    deck: 'minorA',
    number: 73,
    type: 'minor',
    cost: {},
    prereqs: { pastures: 1 },
    category: 'Crop Provider',
    text: 'Each time after you turn at least 2 unused spaces into used spaces in one action, you get an additional "Sow" action.',
    onUseMultipleSpaces(game, player, spaceCount) {
      if (spaceCount >= 2) {
        game.log.add({
          template: '{player} gets an additional Sow action from Agricultural Fertilizers',
          args: { player },
        })
        game.actions.sow(player)
      }
    },
  },
  {
    id: 'stable-tree-a074',
    name: 'Stable Tree',
    deck: 'minorA',
    number: 74,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Building Resource Provider',
    text: 'Each time you build 1 or more stables on your turn, place 1 wood on each of the next 3 round spaces. At the start of these rounds, you get the wood.',
    onBuildStable(game, player) {
      const currentRound = game.state.round
      for (let i = 1; i <= 3; i++) {
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
        }
      }
      game.log.add({
        template: '{player} places wood on the next 3 round spaces from Stable Tree',
        args: { player },
      })
    },
  },
  {
    id: 'lumber-mill-a075',
    name: 'Lumber Mill',
    deck: 'minorA',
    number: 75,
    type: 'minor',
    cost: { stone: 2 },
    vps: 2,
    prereqs: { occupations: 3, occupationsAtMost: true },
    category: 'Building Resource Provider',
    text: 'Every improvement costs you 1 wood less.',
    modifyImprovementCost(player, cost) {
      if (cost.wood && cost.wood > 0) {
        return { ...cost, wood: cost.wood - 1 }
      }
      return cost
    },
  },
  {
    id: 'cob-a076',
    name: 'Cob',
    deck: 'minorA',
    number: 76,
    type: 'minor',
    cost: { food: 1 },
    category: 'Building Resource Provider',
    text: 'At the start of each work phase, if you have at least 1 clay in your supply, you can exchange exactly 1 grain for 2 clay and 1 food.',
    onWorkPhaseStart(game, player) {
      if (player.clay >= 1 && player.grain >= 1) {
        game.actions.offerCob(player, this)
      }
    },
  },
  {
    id: 'hod-a077',
    name: 'Hod',
    deck: 'minorA',
    number: 77,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Building Resource Provider',
    text: 'When you play this card, you immediately get 1 clay. Each time any player (including you) uses the "Pig Market" accumulation space, you immediately get 2 clay.',
    onPlay(game, player) {
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 clay from Hod',
        args: { player },
      })
    },
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'take-boar') {
        cardOwner.addResource('clay', 2)
        game.log.add({
          template: '{player} gets 2 clay from Hod',
          args: { player: cardOwner },
        })
      }
    },
  },
  {
    id: 'canoe-a078',
    name: 'Canoe',
    deck: 'minorA',
    number: 78,
    type: 'minor',
    cost: { wood: 2 },
    vps: 1,
    prereqs: { occupations: 1 },
    category: 'Building Resource Provider',
    text: 'Each time you use the "Fishing" accumulation space, you get an additional 1 food and 1 reed.',
    onAction(game, player, actionId) {
      if (actionId === 'fishing') {
        player.addResource('food', 1)
        player.addResource('reed', 1)
        game.log.add({
          template: '{player} gets 1 food and 1 reed from Canoe',
          args: { player },
        })
      }
    },
  },
  {
    id: 'garden-hoe-a079',
    name: 'Garden Hoe',
    deck: 'minorA',
    number: 79,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Building Resource Provider',
    text: 'Each time you take an unconditional "Sow" action planting vegetables in at least 1 field, you get 1 clay and 1 stone.',
    onSowVegetables(game, player, isUnconditional) {
      if (isUnconditional) {
        player.addResource('clay', 1)
        player.addResource('stone', 1)
        game.log.add({
          template: '{player} gets 1 clay and 1 stone from Garden Hoe',
          args: { player },
        })
      }
    },
  },
  {
    id: 'stone-tongs-a080',
    name: 'Stone Tongs',
    deck: 'minorA',
    number: 80,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Building Resource Provider',
    text: 'Each time you use a stone accumulation space, you get 1 additional stone.',
    onAction(game, player, actionId) {
      if (actionId === 'take-stone-1' || actionId === 'take-stone-2') {
        player.addResource('stone', 1)
        game.log.add({
          template: '{player} gets 1 additional stone from Stone Tongs',
          args: { player },
        })
      }
    },
  },
  {
    id: 'interim-storage-a081',
    name: 'Interim Storage',
    deck: 'minorA',
    number: 81,
    type: 'minor',
    cost: { food: 2 },
    category: 'Building Resource Provider',
    text: 'Each time you use a clay/reed/stone accumulation space, place 1 wood/clay/reed on this card. At the start of rounds 7, 11, and 14, move all the goods on this card to your supply.',
    onPlay(game, player) {
      player.interimStorage = { wood: 0, clay: 0, reed: 0 }
    },
    onAction(game, player, actionId) {
      if (!player.interimStorage) {
        return
      }
      if (actionId === 'take-clay' || actionId === 'take-clay-2') {
        player.interimStorage.wood = (player.interimStorage.wood || 0) + 1
      }
      else if (actionId === 'take-reed') {
        player.interimStorage.clay = (player.interimStorage.clay || 0) + 1
      }
      else if (actionId === 'take-stone-1' || actionId === 'take-stone-2') {
        player.interimStorage.reed = (player.interimStorage.reed || 0) + 1
      }
    },
    onRoundStart(game, player, round) {
      if ((round === 7 || round === 11 || round === 14) && player.interimStorage) {
        const storage = player.interimStorage
        if (storage.wood > 0) {
          player.addResource('wood', storage.wood)
        }
        if (storage.clay > 0) {
          player.addResource('clay', storage.clay)
        }
        if (storage.reed > 0) {
          player.addResource('reed', storage.reed)
        }
        game.log.add({
          template: '{player} receives {wood} wood, {clay} clay, {reed} reed from Interim Storage',
          args: { player, wood: storage.wood, clay: storage.clay, reed: storage.reed },
        })
        player.interimStorage = { wood: 0, clay: 0, reed: 0 }
      }
    },
  },
  {
    id: 'work-certificate-a082',
    name: 'Work Certificate',
    deck: 'minorA',
    number: 82,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 3 },
    category: 'Building Resource Provider',
    text: 'Each time after you use an action space, you can take 1 building resource from a building resource accumulation space with at least 4 building resources on it.',
    onAction(game, player) {
      game.actions.offerWorkCertificate(player, this)
    },
  },
  {
    id: 'shepherds-crook-a083',
    name: "Shepherd's Crook",
    deck: 'minorA',
    number: 83,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Livestock Provider',
    text: 'Each time you fence a new pasture covering at least 4 farmyard spaces, you immediately get 2 sheep on this pasture.',
    onBuildPasture(game, player, pasture) {
      if (pasture.spaces.length >= 4) {
        if (player.canPlaceAnimals('sheep', 2)) {
          player.addAnimals('sheep', 2)
          game.log.add({
            template: "{player} gets 2 sheep from Shepherd's Crook",
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'silage-a084',
    name: 'Silage',
    deck: 'minorA',
    number: 84,
    type: 'minor',
    cost: {},
    prereqs: { fields: 2 },
    category: 'Livestock Provider',
    text: 'In each returning home phase after which there is no harvest, you can pay exactly 1 grain - even from a field - to breed exactly one type of animal.',
    onReturnHome(game, player) {
      const round = game.state.round
      if (!game.isHarvestRound(round)) {
        const canPayGrain = player.grain >= 1 || player.getGrainFieldCount() > 0
        if (canPayGrain) {
          game.actions.offerSilage(player, this)
        }
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
