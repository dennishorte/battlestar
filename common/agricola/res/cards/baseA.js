/**
 * Base A Cards for Agricola
 * Minor Improvements and Occupations
 */

const minorImprovements = [
  {
    id: 'shifting-cultivation',
    name: 'Shifting Cultivation',
    deck: 'A',
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
    id: 'clay-embankment',
    name: 'Clay Embankment',
    deck: 'A',
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
    id: 'young-animal-market',
    name: 'Young Animal Market',
    deck: 'A',
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
    id: 'drinking-trough',
    name: 'Drinking Trough',
    deck: 'A',
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
    id: 'rammed-clay',
    name: 'Rammed Clay',
    deck: 'A',
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
      // Allow using clay instead of wood
      return { wood: 1, alternateResource: 'clay' }
    },
  },
  {
    id: 'handplow',
    name: 'Handplow',
    deck: 'A',
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
    id: 'threshing-board',
    name: 'Threshing Board',
    deck: 'A',
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
    id: 'sleeping-corner',
    name: 'Sleeping Corner',
    deck: 'A',
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
    id: 'manger',
    name: 'Manger',
    deck: 'A',
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
    id: 'big-country',
    name: 'Big Country',
    deck: 'A',
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
    id: 'wool-blankets',
    name: 'Wool Blankets',
    deck: 'A',
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
    id: 'pond-hut',
    name: 'Pond Hut',
    deck: 'A',
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
    id: 'milk-jug',
    name: 'Milk Jug',
    deck: 'A',
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
    id: 'claypipe',
    name: 'Claypipe',
    deck: 'A',
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
    id: 'junk-room',
    name: 'Junk Room',
    deck: 'A',
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
    id: 'basket',
    name: 'Basket',
    deck: 'A',
    number: 56,
    type: 'minor',
    cost: { reed: 1 },
    category: 'Food Provider',
    text: 'Immediately after each time you use a wood accumulation space, you can exchange 2 wood for 3 food. If you do, place those 2 wood on the accumulation space.',
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' || actionId === 'copse') {
        if (player.wood >= 2) {
          game.actions.offerWoodForFoodExchange(player, this, { wood: 2, food: 3 })
        }
      }
    },
  },
  {
    id: 'dutch-windmill',
    name: 'Dutch Windmill',
    deck: 'A',
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
    id: 'corn-scoop',
    name: 'Corn Scoop',
    deck: 'A',
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
    id: 'large-greenhouse',
    name: 'Large Greenhouse',
    deck: 'A',
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
    id: 'clearing-spade',
    name: 'Clearing Spade',
    deck: 'A',
    number: 71,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Crop Provider',
    text: 'At any time, you can move 1 crop from a planted field containing at least 2 crops to an empty field.',
    allowsAnytimeCropMove: true,
  },
  {
    id: 'lumber-mill',
    name: 'Lumber Mill',
    deck: 'A',
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
    id: 'canoe',
    name: 'Canoe',
    deck: 'A',
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
    id: 'stone-tongs',
    name: 'Stone Tongs',
    deck: 'A',
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
    id: 'shepherds-crook',
    name: "Shepherd's Crook",
    deck: 'A',
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
]

const occupations = [
  {
    id: 'animal-tamer',
    name: 'Animal Tamer',
    deck: 'A',
    number: 86,
    type: 'occupation',
    players: '1+',
    category: 'Farm Planner',
    text: 'When you play this card, you immediately get your choice of 1 wood or 1 grain. Instead of just 1 animal total, you can keep any 1 animal in each room of your house.',
    onPlay(game, player) {
      game.actions.offerResourceChoice(player, this, ['wood', 'grain'])
    },
    modifyHouseAnimalCapacity(player) {
      // Instead of 1 pet total, 1 per room
      return player.getRoomCount()
    },
  },
  {
    id: 'conservator',
    name: 'Conservator',
    deck: 'A',
    number: 87,
    type: 'occupation',
    players: '1+',
    category: 'Farm Planner',
    text: 'You can renovate your wooden house directly to stone without renovating it to clay first.',
    allowDirectStoneRenovation: true,
  },
  {
    id: 'hedge-keeper',
    name: 'Hedge Keeper',
    deck: 'A',
    number: 88,
    type: 'occupation',
    players: '1+',
    category: 'Farm Planner',
    text: 'Each time you take a "Build Fences" action, you do not have to pay wood for 3 of the fences you build.',
    modifyFenceCost(player, fenceCount) {
      // 3 fences are free
      return Math.max(0, fenceCount - 3)
    },
  },
  {
    id: 'plow-driver',
    name: 'Plow Driver',
    deck: 'A',
    number: 90,
    type: 'occupation',
    players: '1+',
    category: 'Farm Planner',
    text: 'Once you live in a stone house, at the start of each round, you can pay 1 food to plow 1 field.',
    onRoundStart(game, player) {
      if (player.roomType === 'stone' && player.food >= 1) {
        game.offerPlowForFood(player, this)
      }
    },
  },
  {
    id: 'adoptive-parents',
    name: 'Adoptive Parents',
    deck: 'A',
    number: 92,
    type: 'occupation',
    players: '1+',
    category: 'Actions Booster',
    text: 'For 1 food, you can take an action with offspring in the same round you get it. If you do, the offspring does not count as "newborn".',
    allowImmediateOffspringAction: true,
  },
  {
    id: 'stable-architect',
    name: 'Stable Architect',
    deck: 'A',
    number: 98,
    type: 'occupation',
    players: '1+',
    category: 'Points Provider',
    text: 'During scoring, you get 1 bonus point for each unfenced stable in your farmyard.',
    getEndGamePoints(player) {
      return player.getUnfencedStableCount()
    },
  },
  {
    id: 'grocer',
    name: 'Grocer',
    deck: 'A',
    number: 102,
    type: 'occupation',
    players: '1+',
    category: 'Goods Provider',
    text: 'Pile the following goods on this card (wood, grain, reed, stone, vegetable, clay, reed, vegetable). At any time, you can buy the top good for 1 food.',
    onPlay(game, player) {
      player.grocerGoods = ['wood', 'grain', 'reed', 'stone', 'vegetables', 'clay', 'reed', 'vegetables']
    },
    allowsAnytimePurchase: true,
  },
  {
    id: 'mushroom-collector',
    name: 'Mushroom Collector',
    deck: 'A',
    number: 108,
    type: 'occupation',
    players: '1+',
    category: 'Food Provider',
    text: 'Immediately after each time you use a wood accumulation space, you can exchange 1 wood for 2 food. If you do, place the wood on the accumulation space.',
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' || actionId === 'copse') {
        if (player.wood >= 1) {
          game.actions.offerWoodForFoodExchange(player, this, { wood: 1, food: 2 })
        }
      }
    },
  },
  {
    id: 'roughcaster',
    name: 'Roughcaster',
    deck: 'A',
    number: 110,
    type: 'occupation',
    players: '1+',
    category: 'Food Provider',
    text: 'Each time you build at least 1 clay room or renovate your house from clay to stone, you also get 3 food.',
    onBuildRoom(game, player, roomType) {
      if (roomType === 'clay') {
        player.addResource('food', 3)
        game.log.add({
          template: '{player} gets 3 food from Roughcaster',
          args: { player },
        })
      }
    },
    onRenovate(game, player, fromType, toType) {
      if (fromType === 'clay' && toType === 'stone') {
        player.addResource('food', 3)
        game.log.add({
          template: '{player} gets 3 food from Roughcaster',
          args: { player },
        })
      }
    },
  },
  {
    id: 'wall-builder',
    name: 'Wall Builder',
    deck: 'A',
    number: 111,
    type: 'occupation',
    players: '1+',
    category: 'Food Provider',
    text: 'Each time you build at least 1 room, you can place 1 food on each of the next 4 round spaces. At the start of these rounds, you get the food.',
    onBuildRoom(game, player) {
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
      game.log.add({
        template: '{player} places food on the next 4 round spaces from Wall Builder',
        args: { player },
      })
    },
  },
  {
    id: 'scythe-worker',
    name: 'Scythe Worker',
    deck: 'A',
    number: 112,
    type: 'occupation',
    players: '1+',
    category: 'Crop Provider',
    text: 'When you play this card, you immediately get 1 grain. In the field phase of each harvest, you can harvest 1 additional grain from each of your grain fields.',
    onPlay(game, player) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Scythe Worker',
        args: { player },
      })
    },
    onHarvest(game, player) {
      const grainFields = player.getGrainFieldCount()
      if (grainFields > 0) {
        player.addResource('grain', grainFields)
        game.log.add({
          template: '{player} harvests {amount} additional grain from Scythe Worker',
          args: { player, amount: grainFields },
        })
      }
    },
  },
  {
    id: 'seasonal-worker',
    name: 'Seasonal Worker',
    deck: 'A',
    number: 114,
    type: 'occupation',
    players: '1+',
    category: 'Crop Provider',
    text: 'Each time you use the "Day Laborer" action space, you get 1 additional grain. From round 6 on, you can choose to get 1 vegetable instead.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
        if (game.state.round >= 6) {
          game.actions.offerResourceChoice(player, this, ['grain', 'vegetables'])
        }
        else {
          player.addResource('grain', 1)
          game.log.add({
            template: '{player} gets 1 grain from Seasonal Worker',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'wood-cutter',
    name: 'Wood Cutter',
    deck: 'A',
    number: 116,
    type: 'occupation',
    players: '1+',
    category: 'Building Resource Provider',
    text: 'Each time you use a wood accumulation space, you get 1 additional wood.',
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 additional wood from Wood Cutter',
          args: { player },
        })
      }
    },
  },
  {
    id: 'firewood-collector',
    name: 'Firewood Collector',
    deck: 'A',
    number: 119,
    type: 'occupation',
    players: '1+',
    category: 'Building Resource Provider',
    text: 'Each time you use the "Farmland", "Grain Seeds", "Grain Utilization", or "Cultivation" action space, at the end of that turn, you get 1 wood.',
    onAction(game, player, actionId) {
      if (actionId === 'plow-field' || actionId === 'take-grain' || actionId === 'sow-bake' || actionId === 'plow-sow') {
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 wood from Firewood Collector',
          args: { player },
        })
      }
    },
  },
  {
    id: 'clay-hut-builder',
    name: 'Clay Hut Builder',
    deck: 'A',
    number: 120,
    type: 'occupation',
    players: '1+',
    category: 'Building Resource Provider',
    text: 'Once you no longer live in a wooden house, place 2 clay on each of the next 5 round spaces. At the start of these rounds, you get the clay.',
    checkTrigger(game, player) {
      if (player.roomType !== 'wood' && !player.clayHutBuilderTriggered) {
        player.clayHutBuilderTriggered = true
        const currentRound = game.state.round
        for (let i = 1; i <= 5; i++) {
          const round = currentRound + i
          if (round <= 14) {
            if (!game.state.scheduledClay) {
              game.state.scheduledClay = {}
            }
            if (!game.state.scheduledClay[player.name]) {
              game.state.scheduledClay[player.name] = {}
            }
            game.state.scheduledClay[player.name][round] =
              (game.state.scheduledClay[player.name][round] || 0) + 2
          }
        }
        game.log.add({
          template: '{player} schedules clay from Clay Hut Builder',
          args: { player },
        })
      }
    },
  },
  {
    id: 'frame-builder',
    name: 'Frame Builder',
    deck: 'A',
    number: 123,
    type: 'occupation',
    players: '1+',
    category: 'Building Resource Provider',
    text: 'Each time you build a room/renovate, but only once per room/action, you can replace exactly 2 clay or 2 stone with 1 wood.',
    modifyBuildCost(player, cost, count) {
      // Can replace 2 clay/stone with 1 wood for each room
      return { ...cost, allowWoodSubstitution: count }
    },
  },
  {
    id: 'priest',
    name: 'Priest',
    deck: 'A',
    number: 125,
    type: 'occupation',
    players: '1+',
    category: 'Building Resource Provider',
    text: 'When you play this card, if you live in a clay house with exactly 2 rooms, you immediately get 3 clay, 2 reed, and 2 stone.',
    onPlay(game, player) {
      if (player.roomType === 'clay' && player.getRoomCount() === 2) {
        player.addResource('clay', 3)
        player.addResource('reed', 2)
        player.addResource('stone', 2)
        game.log.add({
          template: '{player} gets 3 clay, 2 reed, and 2 stone from Priest',
          args: { player },
        })
      }
    },
  },
  {
    id: 'braggart',
    name: 'Braggart',
    deck: 'A',
    number: 133,
    type: 'occupation',
    players: '3+',
    category: 'Points Provider',
    text: 'During the scoring, you get 2/3/4/5/7/9 bonus points for having at least 5/6/7/8/9/10 improvements in front of you.',
    getEndGamePoints(player) {
      const improvements = player.getImprovementCount()
      if (improvements >= 10) {
        return 9
      }
      if (improvements >= 9) {
        return 7
      }
      if (improvements >= 8) {
        return 5
      }
      if (improvements >= 7) {
        return 4
      }
      if (improvements >= 6) {
        return 3
      }
      if (improvements >= 5) {
        return 2
      }
      return 0
    },
  },
  {
    id: 'harpooner',
    name: 'Harpooner',
    deck: 'A',
    number: 138,
    type: 'occupation',
    players: '3+',
    category: 'Goods Provider',
    text: 'Each time you use the "Fishing" accumulation space you can also pay 1 wood to get 1 food for each person you have, and 1 reed.',
    onAction(game, player, actionId) {
      if (actionId === 'fishing' && player.wood >= 1) {
        game.actions.offerHarpoonerBonus(player, this)
      }
    },
  },
  {
    id: 'stonecutter',
    name: 'Stonecutter',
    deck: 'A',
    number: 143,
    type: 'occupation',
    players: '3+',
    category: 'Building Resource Provider',
    text: 'Every improvement, room, and renovation costs you 1 stone less.',
    modifyAnyCost(player, cost) {
      if (cost.stone && cost.stone > 0) {
        return { ...cost, stone: cost.stone - 1 }
      }
      return cost
    },
  },
  {
    id: 'animal-dealer',
    name: 'Animal Dealer',
    deck: 'A',
    number: 147,
    type: 'occupation',
    players: '3+',
    category: 'Livestock Provider',
    text: 'Each time you use the "Sheep Market", "Pig Market", or "Cattle Market" accumulation space, you can buy 1 additional animal of the respective type for 1 food.',
    onAction(game, player, actionId) {
      const animalMarkets = {
        'take-sheep': 'sheep',
        'take-boar': 'boar',
        'take-cattle': 'cattle',
      }
      if (animalMarkets[actionId] && player.food >= 1) {
        game.actions.offerBuyAnimal(player, this, animalMarkets[actionId])
      }
    },
  },
  {
    id: 'conjurer',
    name: 'Conjurer',
    deck: 'A',
    number: 155,
    type: 'occupation',
    players: '4+',
    category: 'Goods Provider',
    text: 'Each time you use the "Traveling Players" accumulation space, you get an additional 1 wood and 1 grain.',
    onAction(game, player, actionId) {
      if (actionId === 'traveling-players') {
        player.addResource('wood', 1)
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 wood and 1 grain from Conjurer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'lutenist',
    name: 'Lutenist',
    deck: 'A',
    number: 160,
    type: 'occupation',
    players: '4+',
    category: 'Crop Provider',
    text: 'Each time another player uses the "Traveling Players" accumulation space, you get 1 food and 1 wood. Immediately after, you can buy exactly 1 vegetable for 2 food.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'traveling-players' && actingPlayer.name !== cardOwner.name) {
        cardOwner.addResource('food', 1)
        cardOwner.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 food and 1 wood from Lutenist',
          args: { player: cardOwner },
        })
        if (cardOwner.food >= 2) {
          const choices = ['Buy 1 vegetable for 2 food', 'Skip']
          const selection = game.actions.choose(cardOwner, choices, {
            title: 'Lutenist: Buy a vegetable?',
            min: 1,
            max: 1,
          })
          if (selection[0] !== 'Skip') {
            cardOwner.removeResource('food', 2)
            cardOwner.addResource('vegetables', 1)
            game.log.add({
              template: '{player} buys 1 vegetable for 2 food using Lutenist',
              args: { player: cardOwner },
            })
          }
        }
      }
    },
  },
  {
    id: 'pig-breeder',
    name: 'Pig Breeder',
    deck: 'A',
    number: 165,
    type: 'occupation',
    players: '4+',
    category: 'Livestock Provider',
    text: 'When you play this card, you immediately get 1 wild boar. Your wild boar breed at the end of round 12 (if there is room for the new wild boar).',
    onPlay(game, player) {
      if (player.canPlaceAnimals('boar', 1)) {
        player.addAnimals('boar', 1)
        game.log.add({
          template: '{player} gets 1 wild boar from Pig Breeder',
          args: { player },
        })
      }
    },
    onRoundEnd(game, player, round) {
      if (round === 12) {
        const boarCount = player.getTotalAnimals('boar')
        if (boarCount >= 2 && player.canPlaceAnimals('boar', 1)) {
          player.addAnimals('boar', 1)
          game.log.add({
            template: "{player}'s wild boar breed from Pig Breeder",
            args: { player },
          })
        }
      }
    },
  },
]

function getCardById(id) {
  return [...minorImprovements, ...occupations].find(c => c.id === id)
}

function getCardByName(name) {
  return [...minorImprovements, ...occupations].find(c => c.name === name)
}

function getMinorImprovements() {
  return minorImprovements
}

function getOccupations() {
  return occupations
}

function getAllCards() {
  return [...minorImprovements, ...occupations]
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
  occupations,
  getCardById,
  getCardByName,
  getMinorImprovements,
  getOccupations,
  getAllCards,
  getCardsByPlayerCount,
}
