/**
 * Minor Improvements C Cards for Agricola (Revised Edition)
 * Cards C001-C084 - A standalone minor improvements deck
 */

const minorImprovements = [
  {
    id: 'overhaul-c001',
    name: 'Overhaul',
    deck: 'minorC',
    number: 1,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { occupations: 2 },
    category: 'Farm Planner',
    text: 'Immediately raze all of your fences, add up to 3 fences from your supply, and rebuild them. (You do not lose any animals during this.)',
    onPlay(game, player) {
      game.actions.overhaulFences(player, this)
    },
  },
  {
    id: 'stable-c002',
    name: 'Stable',
    deck: 'minorC',
    number: 2,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Farm Planner',
    text: 'Immediately build 1 stable. (The stable costs you nothing, but you must pay the cost shown on this card.)',
    onPlay(game, player) {
      game.actions.buildFreeStable(player, this)
    },
  },
  {
    id: 'carriage-trip-c003',
    name: 'Carriage Trip',
    deck: 'minorC',
    number: 3,
    type: 'minor',
    cost: {},
    prereqs: { personYetToPlace: true },
    category: 'Actions Booster',
    text: 'If you play this card in the work phase, you can immediately place another person.',
    onPlay(game, player) {
      game.actions.placeExtraPerson(player, this)
    },
  },
  {
    id: 'writing-boards-c004',
    name: 'Writing Boards',
    deck: 'minorC',
    number: 4,
    type: 'minor',
    cost: { food: 1 },
    category: 'Building Resource Provider',
    text: 'You immediately get 1 wood for each occupation you have in front of you.',
    onPlay(game, player) {
      const occs = player.occupationsPlayed || 0
      if (occs > 0) {
        player.addResource('wood', occs)
        game.log.add({
          template: '{player} gets {amount} wood from Writing Boards',
          args: { player, amount: occs },
        })
      }
    },
  },
  {
    id: 'remodeling-c005',
    name: 'Remodeling',
    deck: 'minorC',
    number: 5,
    type: 'minor',
    cost: { food: 1 },
    category: 'Building Resource Provider',
    text: 'You immediately get 1 clay for each clay room and for each major improvement you have.',
    onPlay(game, player) {
      let count = 0
      if (player.roomType === 'clay') {
        count += player.getRoomCount()
      }
      count += (player.majorImprovements || []).length
      if (count > 0) {
        player.addResource('clay', count)
        game.log.add({
          template: '{player} gets {amount} clay from Remodeling',
          args: { player, amount: count },
        })
      }
    },
  },
  {
    id: 'stone-clearing-c006',
    name: 'Stone Clearing',
    deck: 'minorC',
    number: 6,
    type: 'minor',
    cost: { food: 1 },
    category: 'Building Resource Provider',
    text: 'Immediately place 1 stone on each of your empty fields. Harvest them during the next field phase. These fields are considered planted until then.',
    onPlay(game, player) {
      game.actions.stoneClearingEffect(player, this)
    },
  },
  {
    id: 'blade-shears-c007',
    name: 'Blade Shears',
    deck: 'minorC',
    number: 7,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { pastures: 1 },
    category: 'Food Provider',
    text: 'You immediately get your choice of 3 food or 1 food for each sheep you have. (Keep the sheep.)',
    onPlay(game, player) {
      game.actions.bladeShearsChoice(player, this)
    },
  },
  {
    id: 'plant-fertilizer-c008',
    name: 'Plant Fertilizer',
    deck: 'minorC',
    number: 8,
    type: 'minor',
    cost: {},
    category: 'Crop Provider',
    text: 'In each field with exactly 1 good, you can immediately place 1 additional good of the same type.',
    onPlay(game, player) {
      game.actions.plantFertilizerEffect(player, this)
    },
  },
  {
    id: 'automatic-water-trough-c009',
    name: 'Automatic Water Trough',
    deck: 'minorC',
    number: 9,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Livestock Provider',
    text: 'If you can accommodate the animal, you can immediately buy 1 sheep/wild boar/cattle for 0/1/2 food.',
    onPlay(game, player) {
      game.actions.automaticWaterTroughPurchase(player, this)
    },
  },
  {
    id: 'bunk-beds-c010',
    name: 'Bunk Beds',
    deck: 'minorC',
    number: 10,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { majorImprovements: 2 },
    category: 'Farm Planner',
    text: 'Once you have 4 rooms, your house can hold 5 people.',
    modifyHouseCapacity(player, capacity) {
      if (player.getRoomCount() >= 4) {
        return Math.max(capacity, 5)
      }
      return capacity
    },
  },
  {
    id: 'wildlife-reserve-c011',
    name: 'Wildlife Reserve',
    deck: 'minorC',
    number: 11,
    type: 'minor',
    cost: { wood: 2 },
    vps: 1,
    prereqs: { occupations: 2 },
    category: 'Livestock Provider',
    text: 'This card can hold up to 1 sheep, 1 wild boar, and 1 cattle.',
    holdsAnimals: { sheep: 1, boar: 1, cattle: 1 },
    mixedAnimals: true,
  },
  {
    id: 'cattle-farm-c012',
    name: 'Cattle Farm',
    deck: 'minorC',
    number: 12,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Livestock Provider',
    text: 'For each pasture you have, you can keep 1 cattle on this card.',
    holdsCattlePerPasture: true,
  },
  {
    id: 'wood-slide-hammer-c013',
    name: 'Wood Slide Hammer',
    deck: 'minorC',
    number: 13,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Farm Planner',
    text: 'On your first renovation, if you have at least 5 wood rooms, you can renovate to stone directly and you get a discount of 2 stone on the renovation cost.',
    modifyRenovation(player, options) {
      if (!player.hasRenovated && player.roomType === 'wood' && player.getRoomCount() >= 5) {
        return {
          ...options,
          canSkipToClay: false,
          canSkipToStone: true,
          stoneDiscount: 2,
        }
      }
      return options
    },
  },
  {
    id: 'straw-thatched-roof-c014',
    name: 'Straw-thatched Roof',
    deck: 'minorC',
    number: 14,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { grainFields: 3 },
    category: 'Farm Planner',
    text: 'You no longer need reed to renovate or build a room.',
    modifyBuildCost(player, cost, action) {
      if (action === 'build-room' || action === 'renovate') {
        const newCost = { ...cost }
        delete newCost.reed
        return newCost
      }
      return cost
    },
  },
  {
    id: 'trellis-c015',
    name: 'Trellis',
    deck: 'minorC',
    number: 15,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 2 },
    category: 'Actions Booster',
    text: 'Each time before you use the "Pig Market" accumulation space, you can take a "Build Fences" action. (You must pay wood for the fences as usual.)',
    onBeforeAction(game, player, actionId) {
      if (actionId === 'take-boar') {
        game.actions.offerBuildFences(player, this)
      }
    },
  },
  {
    id: 'field-fences-c016',
    name: 'Field Fences',
    deck: 'minorC',
    number: 16,
    type: 'minor',
    cost: { food: 2 },
    category: 'Farm Planner',
    text: 'You can immediately take a "Build Fences" action, during which you do not have to pay wood for fences that you build next to field tiles.',
    onPlay(game, player) {
      game.actions.fieldFencesAction(player, this)
    },
  },
  {
    id: 'newly-plowed-field-c017',
    name: 'Newly-Plowed Field',
    deck: 'minorC',
    number: 17,
    type: 'minor',
    cost: {},
    prereqs: { fieldsExactly: 3 },
    category: 'Farm Planner',
    text: 'When you play this card, you can immediately plow 1 field, which needs not be adjacent to another field.',
    onPlay(game, player) {
      game.actions.plowField(player, { allowNonAdjacent: true })
    },
  },
  {
    id: 'roll-over-plow-c018',
    name: 'Roll-Over Plow',
    deck: 'minorC',
    number: 18,
    type: 'minor',
    cost: { wood: 2 },
    category: 'Farm Planner',
    text: 'At any time, if you have at least 3 planted fields, you can discard all goods from one of those fields to plow 1 field.',
    allowsAnytimePlow: true,
    rollOverPlowEffect: true,
  },
  {
    id: 'swing-plow-c019',
    name: 'Swing Plow',
    deck: 'minorC',
    number: 19,
    type: 'minor',
    cost: { wood: 3 },
    prereqs: { occupations: 3 },
    category: 'Farm Planner',
    text: 'Place 4 field tiles on this card. Each time you use the "Farmland" action space, you can also plow up to 2 fields from this card.',
    onPlay(game, player) {
      player.swingPlowCharges = 4
      game.log.add({
        template: '{player} places 4 field tiles on Swing Plow',
        args: { player },
      })
    },
    onAction(game, player, actionId) {
      if (actionId === 'plow-field' && player.swingPlowCharges > 0) {
        const fieldsToAdd = Math.min(2, player.swingPlowCharges)
        player.swingPlowCharges -= fieldsToAdd
        for (let i = 0; i < fieldsToAdd; i++) {
          game.actions.plowField(player, { immediate: true })
        }
      }
    },
  },
  {
    id: 'mole-plow-c020',
    name: 'Mole Plow',
    deck: 'minorC',
    number: 20,
    type: 'minor',
    cost: { wood: 3, food: 1 },
    prereqs: { minRound: 9 },
    category: 'Farm Planner',
    text: 'Each time you use the "Farmland" or "Cultivation" action space, you can plow 1 additional field.',
    onAction(game, player, actionId) {
      if (actionId === 'plow-field' || actionId === 'plow-sow') {
        game.actions.plowField(player, { immediate: true })
      }
    },
  },
  {
    id: 'heart-of-stone-c021',
    name: 'Heart of Stone',
    deck: 'minorC',
    number: 21,
    type: 'minor',
    cost: { food: 4 },
    category: 'Actions Booster',
    text: 'Each time a "Quarry" accumulation space is revealed, if you have room in your house, you can immediately take a "Family Growth" action without placing a person.',
    onStageReveal(game, player, actionId) {
      if ((actionId === 'take-stone-1' || actionId === 'take-stone-2') && player.canAddFamilyMember()) {
        game.actions.familyGrowthWithoutRoom(player, { fromCard: true, noWorkerPlacement: true })
      }
    },
  },
  {
    id: 'basket-chair-c022',
    name: 'Basket Chair',
    deck: 'minorC',
    number: 22,
    type: 'minor',
    cost: { reed: 1 },
    vps: 1,
    category: 'Actions Booster',
    text: 'When you play this card, you can immediately move the first person you placed this work phase to this card. If you do, immediately afterward, you can place another person.',
    onPlay(game, player) {
      game.actions.basketChairEffect(player, this)
    },
  },
  {
    id: 'job-contract-c023',
    name: 'Job Contract',
    deck: 'minorC',
    number: 23,
    type: 'minor',
    cost: {},
    prereqs: { noOccupations: true },
    category: 'Actions Booster',
    text: 'If both are unoccupied, you can use the "Day Laborer" and the adjacent "Lessons" action space with a single person (in that order). Afterward, both spaces are considered occupied.',
    allowsCombinedAction: ['day-laborer', 'lessons-1'],
  },
  {
    id: 'bed-in-the-grain-field-c024',
    name: 'Bed in the Grain Field',
    deck: 'minorC',
    number: 24,
    type: 'minor',
    cost: {},
    prereqs: { grainFields: 1 },
    category: 'Actions Booster',
    text: 'At the start of the next harvest, you get a "Family Growth" action if you have room for the newborn.',
    onPlay(game, player) {
      player.bedInGrainFieldNextHarvest = true
      game.log.add({
        template: '{player} will get Family Growth at the start of the next harvest',
        args: { player },
      })
    },
  },
  {
    id: 'steam-machine-c025',
    name: 'Steam Machine',
    deck: 'minorC',
    number: 25,
    type: 'minor',
    cost: { wood: 2 },
    vps: 1,
    category: 'Actions Booster',
    text: 'Each work phase, if the last action space you use is an accumulation space, you can immediately afterward take a "Bake Bread" action.',
    onWorkPhaseEnd(game, player, lastActionId) {
      if (game.isAccumulationSpace(lastActionId)) {
        game.actions.bakeBread(player)
      }
    },
  },
  {
    id: 'flail-c026',
    name: 'Flail',
    deck: 'minorC',
    number: 26,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'When you play this card, you immediately get 2 food. Each time you use the "Farmland" or "Cultivation" action space, you can also take a "Bake Bread" action.',
    onPlay(game, player) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Flail',
        args: { player },
      })
    },
    onAction(game, player, actionId) {
      if (actionId === 'plow-field' || actionId === 'plow-sow') {
        game.actions.bakeBread(player)
      }
    },
  },
  {
    id: 'blueprint-c027',
    name: 'Blueprint',
    deck: 'minorC',
    number: 27,
    type: 'minor',
    cost: { food: 1 },
    category: 'Actions Booster',
    text: 'You can build the major improvements "Joinery", "Pottery", and "Basketmaker\'s Workshop" even when taking a "Minor Improvement" action. They each cost you 1 stone less.',
    allowsMajorsOnMinorAction: ['joinery', 'pottery', 'basketmakers-workshop'],
    modifyMajorCost(majorId, cost) {
      if (['joinery', 'pottery', 'basketmakers-workshop'].includes(majorId)) {
        const newCost = { ...cost }
        if (newCost.stone) {
          newCost.stone = Math.max(0, newCost.stone - 1)
        }
        return newCost
      }
      return cost
    },
  },
  {
    id: 'teachers-desk-c028',
    name: "Teacher's Desk",
    deck: 'minorC',
    number: 28,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { occupations: 1 },
    category: 'Actions Booster',
    text: 'Each time you use the "Major Improvement" or "House Redevelopment" action space, you can also play 1 occupation at an occupation cost of 1 food.',
    onAction(game, player, actionId) {
      if (actionId === 'major-improvement' || actionId === 'house-redevelopment') {
        game.actions.offerOccupationForFood(player, this, 1)
      }
    },
  },
  {
    id: 'beer-table-c029',
    name: 'Beer Table',
    deck: 'minorC',
    number: 29,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { noGrain: true },
    category: 'Points Provider',
    text: 'At the end of the field phase of each harvest, you can pay 1 grain from your supply to get 2 bonus points. If you do, all other players get 1 food each.',
    onFieldPhaseEnd(game, player) {
      if (player.grain >= 1) {
        game.actions.offerBeerTable(player, this)
      }
    },
  },
  {
    id: 'half-timbered-house-c030',
    name: 'Half-Timbered House',
    deck: 'minorC',
    number: 30,
    type: 'minor',
    cost: { wood: 1, clay: 1, stone: 2, reed: 1 },
    category: 'Points Provider',
    text: 'During scoring, you get 1 bonus point for each stone room you have. You can only use one card to get bonus points for your stone house.',
    getEndGamePoints(player) {
      if (player.roomType === 'stone') {
        return player.getRoomCount()
      }
      return 0
    },
  },
  {
    id: 'writing-chamber-c031',
    name: 'Writing Chamber',
    deck: 'minorC',
    number: 31,
    type: 'minor',
    cost: { wood: 2 },
    category: 'Points Provider',
    text: 'During scoring, you get a number of bonus points equal to the total of negative points you have, to a maximum of 7 bonus points.',
    getEndGamePoints(player) {
      const negativePoints = player.calculateNegativePoints()
      return Math.min(Math.abs(negativePoints), 7)
    },
  },
  {
    id: 'abort-oriel-c032',
    name: 'Abort Oriel',
    deck: 'minorC',
    number: 32,
    type: 'minor',
    cost: { clay: 2 },
    vps: 3,
    prereqs: { maxCardsInPlay: 5 },
    category: 'Points Provider',
    text: 'You can no longer play this card when any player (including you) has 5 or more cards in front of them.',
  },
  {
    id: 'greening-plan-c033',
    name: 'Greening Plan',
    deck: 'minorC',
    number: 33,
    type: 'minor',
    cost: { food: 3 },
    category: 'Points Provider',
    text: 'During scoring, if you then have at least 2/4/5/6 unplanted fields, you get 1/2/3/5 bonus points.',
    getEndGamePoints(player) {
      const emptyFields = player.getEmptyFieldCount()
      if (emptyFields >= 6) {
        return 5
      }
      if (emptyFields >= 5) {
        return 3
      }
      if (emptyFields >= 4) {
        return 2
      }
      if (emptyFields >= 2) {
        return 1
      }
      return 0
    },
  },
  {
    id: 'elephantgrass-plant-c034',
    name: 'Elephantgrass Plant',
    deck: 'minorC',
    number: 34,
    type: 'minor',
    cost: { clay: 2, stone: 1 },
    prereqs: { occupations: 2 },
    category: 'Points Provider',
    text: 'Immediately after each harvest, you can use this card to exchange exactly 1 reed for 1 bonus point.',
    onHarvestEnd(game, player) {
      if (player.reed >= 1) {
        game.actions.offerElephantgrassPlant(player, this)
      }
    },
  },
  {
    id: 'lantern-house-c035',
    name: 'Lantern House',
    deck: 'minorC',
    number: 35,
    type: 'minor',
    cost: { wood: 1 },
    vps: 7,
    prereqs: { noOccupations: true },
    category: 'Points Provider',
    text: 'During scoring, you get 1 negative point for each card left in your hand. You cannot discard cards from your hand unplayed.',
    getEndGamePoints(player) {
      const cardsInHand = player.getHandSize()
      return -cardsInHand
    },
    preventsDiscard: true,
  },
  {
    id: 'clay-deposit-c036',
    name: 'Clay Deposit',
    deck: 'minorC',
    number: 36,
    type: 'minor',
    cost: { food: 2 },
    prereqs: { occupations: 1 },
    category: 'Points Provider',
    text: 'Immediately after each time you use a clay accumulation space, you can exchange 1 clay for 1 bonus point. If you do, place the clay on the accumulation space.',
    onAction(game, player, actionId) {
      if (actionId === 'take-clay' || actionId === 'take-clay-2') {
        if (player.clay >= 1) {
          game.actions.offerClayDeposit(player, this, actionId)
        }
      }
    },
  },
  {
    id: 'dwelling-mound-c037',
    name: 'Dwelling Mound',
    deck: 'minorC',
    number: 37,
    type: 'minor',
    cost: { food: 1 },
    vps: 3,
    prereqs: { maxRound: 3 },
    category: 'Points Provider',
    text: 'From now on, you must pay 1 food for each new field tile that you place in your farmyard.',
    modifyFieldCost(player, cost) {
      return { ...cost, food: (cost.food || 0) + 1 }
    },
  },
  {
    id: 'christianity-c038',
    name: 'Christianity',
    deck: 'minorC',
    number: 38,
    type: 'minor',
    cost: {},
    vps: 2,
    prereqs: { sheepExactly: 1 },
    category: 'Points Provider',
    text: 'When you play this card, all other players get 1 food each.',
    onPlay(game, player) {
      for (const otherPlayer of game.players.all()) {
        if (otherPlayer.name !== player.name) {
          otherPlayer.addResource('food', 1)
          game.log.add({
            template: '{other} gets 1 food from Christianity',
            args: { other: otherPlayer },
          })
        }
      }
    },
  },
  {
    id: 'studio-boat-c039',
    name: 'Studio Boat',
    deck: 'minorC',
    number: 39,
    type: 'minor',
    cost: { wood: 1 },
    prereqs: { occupations: 1 },
    category: 'Points Provider',
    text: 'Each time you use the "Traveling Players" accumulation space, you also get 1 bonus point. In games with 1-3 players, this card is considered "Traveling Players" (same effect as "Fishing").',
    onAction(game, player, actionId) {
      if (actionId === 'traveling-players') {
        player.bonusPoints = (player.bonusPoints || 0) + 1
        game.log.add({
          template: '{player} gets 1 bonus point from Studio Boat',
          args: { player },
        })
      }
    },
    providesActionSpace: true,
    actionSpaceId: 'studio-boat',
    actionSpaceForPlayerCount: [1, 2, 3],
  },
  {
    id: 'canvas-sack-c040',
    name: 'Canvas Sack',
    deck: 'minorC',
    number: 40,
    type: 'minor',
    cost: { grain: 1 },
    costAlternative: { reed: 1 },
    vps: 1,
    prereqs: { noOccupations: true },
    category: 'Crop Provider',
    text: 'When you play this card paying grain/reed for it, you immediately get 1 vegetable/4 wood.',
    onPlay(game, player, paidWith) {
      if (paidWith === 'grain') {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from Canvas Sack',
          args: { player },
        })
      }
      else if (paidWith === 'reed') {
        player.addResource('wood', 4)
        game.log.add({
          template: '{player} gets 4 wood from Canvas Sack',
          args: { player },
        })
      }
    },
  },
  {
    id: 'farm-store-c041',
    name: 'Farm Store',
    deck: 'minorC',
    number: 41,
    type: 'minor',
    cost: { wood: 2, clay: 2 },
    category: 'Building Resource Provider',
    text: 'After the feeding phase of each harvest, you can exchange exactly 1 food for 2 different building resources of your choice or 1 vegetable.',
    onFeedingPhaseEnd(game, player) {
      if (player.food >= 1) {
        game.actions.offerFarmStore(player, this)
      }
    },
  },
  {
    id: 'ravenous-hunger-c042',
    name: 'Ravenous Hunger',
    deck: 'minorC',
    number: 42,
    type: 'minor',
    cost: { grain: 1 },
    category: 'Actions Booster',
    text: 'Immediately after each time you use the "Vegetable Seeds" action space, you can place another person on an accumulation space and get 1 additional good of the accumulating type.',
    onAction(game, player, actionId) {
      if (actionId === 'take-vegetable') {
        game.actions.offerRavenousHunger(player, this)
      }
    },
  },
  {
    id: 'farm-building-c043',
    name: 'Farm Building',
    deck: 'minorC',
    number: 43,
    type: 'minor',
    cost: { clay: 1, reed: 1 },
    vps: 1,
    category: 'Food Provider',
    text: 'Each time you build a major improvement, place 1 food on each of the next 3 round spaces. At the start of these rounds, you get the food.',
    onBuildMajor(game, player) {
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
        template: '{player} schedules food from Farm Building',
        args: { player },
      })
    },
  },
  {
    id: 'chicken-coop-c044',
    name: 'Chicken Coop',
    deck: 'minorC',
    number: 44,
    type: 'minor',
    cost: { wood: 2, reed: 1 },
    costAlternative: { clay: 2, reed: 1 },
    vps: 1,
    category: 'Food Provider',
    text: 'Place 1 food on each of the next 8 round spaces. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let i = 1; i <= 8; i++) {
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
        template: '{player} schedules food from Chicken Coop',
        args: { player },
      })
    },
  },
  {
    id: 'stew-c045',
    name: 'Stew',
    deck: 'minorC',
    number: 45,
    type: 'minor',
    cost: { clay: 1 },
    category: 'Food Provider',
    text: 'Each time you use the "Day Laborer" action space, also place 1 food on each of the next 4 round spaces. At the start of these rounds, you get the food.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
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
          template: '{player} schedules food from Stew',
          args: { player },
        })
      }
    },
  },
  {
    id: 'mandoline-c046',
    name: 'Mandoline',
    deck: 'minorC',
    number: 46,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Points Provider',
    text: 'Once per round, you can pay 1 vegetable to get 1 bonus point. If you do, place 1 food on each of the next 2 round spaces. At the start of these rounds, you get the food.',
    allowsAnytimePurchase: true,
    mandolineEffect: true,
  },
  {
    id: 'garden-claw-c047',
    name: 'Garden Claw',
    deck: 'minorC',
    number: 47,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'Place 1 food on each remaining round space, up to three times the number of planted fields you have. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const plantedFields = player.getPlantedFields().length
      const maxRounds = plantedFields * 3
      const currentRound = game.state.round
      let placed = 0
      for (let round = currentRound + 1; round <= 14 && placed < maxRounds; round++) {
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
        template: '{player} places {amount} food from Garden Claw',
        args: { player, amount: placed },
      })
    },
  },
  {
    id: 'farmstead-c048',
    name: 'Farmstead',
    deck: 'minorC',
    number: 48,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 1 },
    category: 'Food Provider',
    text: 'After each turn in which you make at least one unused farmyard space used, you get 1 food.',
    onUseFarmyardSpace(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Farmstead',
        args: { player },
      })
    },
  },
  {
    id: 'beer-stall-c049',
    name: 'Beer Stall',
    deck: 'minorC',
    number: 49,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'In the feeding phase of each harvest, for each empty unfenced stable you have, you can exchange 1 grain for 5 food.',
    onFeedingPhase(game, player) {
      const emptyUnfencedStables = player.getEmptyUnfencedStableCount()
      if (emptyUnfencedStables > 0 && player.grain >= 1) {
        game.actions.offerBeerStall(player, this, emptyUnfencedStables)
      }
    },
  },
  {
    id: 'stable-yard-c050',
    name: 'Stable Yard',
    deck: 'minorC',
    number: 50,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { stables: 3, pastures: 3 },
    category: 'Food Provider',
    text: 'When you play this card, you immediately get 1 food for each completed round left to play. At any time, you can exchange 1 sheep plus 1 wild boar for 1 cattle.',
    onPlay(game, player) {
      const roundsLeft = 14 - game.state.round
      if (roundsLeft > 0) {
        player.addResource('food', roundsLeft)
        game.log.add({
          template: '{player} gets {amount} food from Stable Yard',
          args: { player, amount: roundsLeft },
        })
      }
    },
    allowsAnytimeExchange: true,
    stableYardExchange: true,
  },
  {
    id: 'fishing-net-c051',
    name: 'Fishing Net',
    deck: 'minorC',
    number: 51,
    type: 'minor',
    cost: { reed: 1 },
    vps: 1,
    category: 'Food Provider',
    text: 'Each time another player uses the "Fishing" accumulation space, they must first pay you 1 food. Then, in the returning home phase of that round, place 2 food on "Fishing".',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'fishing' && actingPlayer.name !== cardOwner.name) {
        if (actingPlayer.food >= 1) {
          actingPlayer.removeResource('food', 1)
          cardOwner.addResource('food', 1)
          game.log.add({
            template: '{acting} pays 1 food to {owner} for Fishing Net',
            args: { acting: actingPlayer, owner: cardOwner },
          })
          // Schedule 2 food to be added to Fishing in returning home phase
          if (!game.state.fishingNetBonus) {
            game.state.fishingNetBonus = 0
          }
          game.state.fishingNetBonus += 2
        }
      }
    },
  },
  {
    id: 'huntsmans-hat-c052',
    name: "Huntsman's Hat",
    deck: 'minorC',
    number: 52,
    type: 'minor',
    cost: { reed: 1 },
    vps: 1,
    prereqs: { cookingImprovement: true },
    category: 'Food Provider',
    text: 'For each new wild boar you get from the effect of an action space, you also get 1 food.',
    onGainBoar(game, player, count, fromActionSpace) {
      if (fromActionSpace && count > 0) {
        player.addResource('food', count)
        game.log.add({
          template: '{player} gets {amount} food from Huntsman\'s Hat',
          args: { player, amount: count },
        })
      }
    },
  },
  {
    id: 'gypsys-crock-c053',
    name: "Gypsy's Crock",
    deck: 'minorC',
    number: 53,
    type: 'minor',
    cost: { clay: 2 },
    vps: 1,
    category: 'Food Provider',
    text: 'Each time you use a cooking improvement to turn 2 goods into food at the same time, you get 1 additional food.',
    onCook(game, player, goodsConverted) {
      if (goodsConverted >= 2) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Gypsy\'s Crock',
          args: { player },
        })
      }
    },
  },
  {
    id: 'market-stall-c054',
    name: 'Market Stall',
    deck: 'minorC',
    number: 54,
    type: 'minor',
    cost: { stable: 1 },
    category: 'Food Provider',
    text: 'After the field phase of each harvest, you can exchange 1 grain plus 1 fence (both from your supply) for 5 food.',
    onFieldPhaseEnd(game, player) {
      if (player.grain >= 1 && player.fences >= 1) {
        game.actions.offerMarketStallC054(player, this)
      }
    },
  },
  {
    id: 'studio-c055',
    name: 'Studio',
    deck: 'minorC',
    number: 55,
    type: 'minor',
    cost: { clay: 1, reed: 1 },
    vps: 1,
    category: 'Food Provider',
    text: 'In the feeding phase of each harvest, you can use this card to turn exactly 1 wood/clay/stone into 2/2/3 food.',
    onFeedingPhase(game, player) {
      if (player.wood >= 1 || player.clay >= 1 || player.stone >= 1) {
        game.actions.offerStudio(player, this)
      }
    },
  },
  {
    id: 'feed-fence-c056',
    name: 'Feed Fence',
    deck: 'minorC',
    number: 56,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'For each new stable you build, you get 1 food - for your last one, get 3 food. Each time you build stables, you can build exactly 1 stable for 1 clay instead of wood.',
    onBuildStable(game, player, isLastStable) {
      const food = isLastStable ? 3 : 1
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from Feed Fence',
        args: { player, amount: food },
      })
    },
    allowsClayStable: true,
  },
  {
    id: 'crudite-c057',
    name: 'Crudité',
    deck: 'minorC',
    number: 57,
    type: 'minor',
    cost: {},
    category: 'Food Provider',
    text: 'When you play this card, you can immediately buy exactly 1 vegetable for 3 food. At any time, you can discard 1 vegetable on top of another vegetable in a field to get 4 food.',
    onPlay(game, player) {
      if (player.food >= 3) {
        game.actions.offerCruditePurchase(player, this)
      }
    },
    allowsAnytimeExchange: true,
    cruditeEffect: true,
  },
  {
    id: 'woodcraft-c058',
    name: 'Woodcraft',
    deck: 'minorC',
    number: 58,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 1 },
    category: 'Food Provider',
    text: 'Each time you use a wood accumulation space, if immediately afterward you have at most 5 wood in your supply, you get 1 food.',
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
        if (player.wood <= 5) {
          player.addResource('food', 1)
          game.log.add({
            template: '{player} gets 1 food from Woodcraft',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'schnapps-distillery-c059',
    name: 'Schnapps Distillery',
    deck: 'minorC',
    number: 59,
    type: 'minor',
    cost: { stone: 2, vegetables: 1 },
    vps: 2,
    category: 'Food Provider',
    text: 'In each feeding phase, you can use this card to turn exactly 1 vegetable into 5 food. During scoring, you get 1 bonus point each for your 5th and 6th vegetable.',
    onFeedingPhase(game, player) {
      if (player.vegetables >= 1) {
        game.actions.offerSchnappsDistillery(player, this)
      }
    },
    getEndGamePoints(player) {
      const vegs = player.vegetables
      if (vegs >= 6) {
        return 2
      }
      if (vegs >= 5) {
        return 1
      }
      return 0
    },
  },
  {
    id: 'small-potters-oven-c060',
    name: "Small Potter's Oven",
    deck: 'minorC',
    number: 60,
    type: 'minor',
    cost: { clay: 2 },
    vps: 5,
    prereqs: { returnMajor: ['clay-oven', 'stone-oven'] },
    category: 'Food Provider',
    text: 'When you play this card, you immediately get 5 food. Each time before you get a "Bake Bread" action, you can build the "Clay Oven" or "Stone Oven" major improvement.',
    onPlay(game, player) {
      player.addResource('food', 5)
      game.log.add({
        template: '{player} gets 5 food from Small Potter\'s Oven',
        args: { player },
      })
    },
    onBeforeBake(game, player) {
      game.actions.offerBuildOven(player, this)
    },
    isOven: true,
  },
  {
    id: 'beer-stein-c061',
    name: 'Beer Stein',
    deck: 'minorC',
    number: 61,
    type: 'minor',
    cost: { clay: 1 },
    category: 'Food Provider',
    text: 'Each time you take a "Bake Bread" action, you can use this card once to turn 1 grain into 2 food and 1 bonus point.',
    onBake(game, player) {
      if (player.grain >= 1) {
        game.actions.offerBeerStein(player, this)
      }
    },
  },
  {
    id: 'cooking-hearth-extension-c062',
    name: 'Cooking Hearth Extension',
    deck: 'minorC',
    number: 62,
    type: 'minor',
    cost: { clay: 2 },
    category: 'Food Provider',
    text: 'Each harvest, you can use each of your cooking improvements once to get double the amount of food for 1 animal or vegetable.',
    onHarvest(game, player) {
      game.actions.offerCookingHearthExtension(player, this)
    },
  },
  {
    id: 'craft-brewery-c063',
    name: 'Craft Brewery',
    deck: 'minorC',
    number: 63,
    type: 'minor',
    cost: { wood: 2, clay: 1 },
    category: 'Food Provider',
    text: 'In the feeding phase of each harvest, you can use this card to exchange 1 grain from your supply plus 1 grain from a field for 2 bonus points and 4 food.',
    onFeedingPhase(game, player) {
      if (player.grain >= 1 && player.hasGrainField()) {
        game.actions.offerCraftBrewery(player, this)
      }
    },
  },
  {
    id: 'corn-schnapps-distillery-c064',
    name: 'Corn Schnapps Distillery',
    deck: 'minorC',
    number: 64,
    type: 'minor',
    cost: { wood: 1, clay: 2 },
    vps: 1,
    category: 'Food Provider',
    text: 'Once per round, you can pay 1 grain to place 1 food on each of the next 4 round spaces. At the start of these rounds, you get the food.',
    allowsAnytimePurchase: true,
    cornSchnappsEffect: true,
  },
  {
    id: 'granary-c065',
    name: 'Granary',
    deck: 'minorC',
    number: 65,
    type: 'minor',
    cost: { wood: 3 },
    costAlternative: { clay: 3 },
    vps: 1,
    category: 'Crop Provider',
    text: 'Place 1 grain each on the remaining spaces for rounds 8, 10, and 12. At the start of these rounds, you get the grain.',
    onPlay(game, player) {
      const currentRound = game.state.round
      const targetRounds = [8, 10, 12].filter(r => r > currentRound)
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
        template: '{player} schedules grain from Granary',
        args: { player },
      })
    },
  },
  {
    id: 'eternal-rye-cultivation-c066',
    name: 'Eternal Rye Cultivation',
    deck: 'minorC',
    number: 66,
    type: 'minor',
    cost: {},
    prereqs: { grainFields: 1 },
    category: 'Crop Provider',
    text: 'After each harvest in which you have 2 or 3+ grain in your supply, you get 1 food and 1 additional grain, respectively.',
    onHarvestEnd(game, player) {
      if (player.grain >= 3) {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Eternal Rye Cultivation',
          args: { player },
        })
      }
      else if (player.grain >= 2) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Eternal Rye Cultivation',
          args: { player },
        })
      }
    },
  },
  {
    id: 'mineral-feeder-c067',
    name: 'Mineral Feeder',
    deck: 'minorC',
    number: 67,
    type: 'minor',
    cost: { reed: 1 },
    vps: 1,
    category: 'Crop Provider',
    text: 'At the start of each round that does not end with a harvest, if you have at least 1 sheep in a pasture, you get 1 grain.',
    onRoundStart(game, player, round) {
      if (!game.isHarvestRound(round) && player.getSheepInPastures() >= 1) {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Mineral Feeder',
          args: { player },
        })
      }
    },
  },
  {
    id: 'bookcase-c068',
    name: 'Bookcase',
    deck: 'minorC',
    number: 68,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { occupations: 1 },
    category: 'Crop Provider',
    text: 'Each time after you play an occupation, you get 1 vegetable.',
    onPlayOccupation(game, player) {
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable from Bookcase',
        args: { player },
      })
    },
  },
  {
    id: 'land-consolidation-c069',
    name: 'Land Consolidation',
    deck: 'minorC',
    number: 69,
    type: 'minor',
    cost: {},
    category: 'Crop Provider',
    text: 'At any time, you can exchange 3 grain in a field for 1 vegetable in that field.',
    allowsAnytimeExchange: true,
    landConsolidationEffect: true,
  },
  {
    id: 'lettuce-patch-c070',
    name: 'Lettuce Patch',
    deck: 'minorC',
    number: 70,
    type: 'minor',
    cost: {},
    vps: 1,
    prereqs: { occupations: 3 },
    category: 'Crop Provider',
    text: 'This card is a field that can only grow vegetables. You can immediately turn each vegetable you harvested from this card into 4 food.',
    providesVegetableField: true,
    onPlay(game, player) {
      player.addVirtualField({
        cardId: 'lettuce-patch-c070',
        label: 'Lettuce Patch',
        cropRestriction: 'vegetables',
        onHarvest: true,
      })
      game.log.add({
        template: '{player} plays Lettuce Patch, gaining a vegetable-only field',
        args: { player },
      })
    },
    onHarvest(game, player, amount) {
      // Offer to convert harvested vegetables to food (4 food each)
      if (amount > 0) {
        game.actions.offerLettucePatchConversion(player, amount)
      }
    },
  },
  {
    id: 'slurry-c071',
    name: 'Slurry',
    deck: 'minorC',
    number: 71,
    type: 'minor',
    cost: {},
    category: 'Actions Booster',
    text: 'In the breeding phase of each harvest, if you get newborn animals of at least two types, you also get a "Sow" action.',
    onBreedingPhaseEnd(game, player, newbornTypes) {
      if (newbornTypes >= 2) {
        game.actions.sow(player)
      }
    },
  },
  {
    id: 'harvest-festival-planning-c072',
    name: 'Harvest Festival Planning',
    deck: 'minorC',
    number: 72,
    type: 'minor',
    cost: { food: 1 },
    prereqs: { occupations: 2 },
    category: 'Actions Booster',
    text: 'When you play this card, immediately carry out the field phase of the harvest. Afterwards, you get a "Major or Minor Improvement" action.',
    onPlay(game, player) {
      game.actions.harvestFieldPhase(player)
      game.actions.majorOrMinorImprovement(player)
    },
  },
  {
    id: 'seaweed-fertilizer-c073',
    name: 'Seaweed Fertilizer',
    deck: 'minorC',
    number: 73,
    type: 'minor',
    cost: { food: 2 },
    category: 'Crop Provider',
    text: 'Each time after you take an unconditional "Sow" action, you get 1 grain from the general supply. From round 11 on, you can get 1 vegetable instead.',
    onSow(game, player) {
      if (game.state.round >= 11) {
        game.actions.offerSeaweedFertilizer(player, this)
      }
      else {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Seaweed Fertilizer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'private-forest-c074',
    name: 'Private Forest',
    deck: 'minorC',
    number: 74,
    type: 'minor',
    cost: { food: 2 },
    prereqs: { occupations: 1 },
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
        template: '{player} schedules wood from Private Forest',
        args: { player },
      })
    },
  },
  {
    id: 'firewood-c075',
    name: 'Firewood',
    deck: 'minorC',
    number: 75,
    type: 'minor',
    cost: { food: 2 },
    category: 'Building Resource Provider',
    text: 'In the returning home phase of each round, place 1 wood on this card. Each time before you build a Fireplace, Cooking Hearth, or oven, move up to 4 wood from this card to your supply.',
    onReturnHome(game, player) {
      player.firewoodWood = (player.firewoodWood || 0) + 1
      game.log.add({
        template: '{player} places 1 wood on Firewood ({total} total)',
        args: { player, total: player.firewoodWood },
      })
    },
    onBeforeBuildCooking(game, player) {
      if (player.firewoodWood > 0) {
        const woodToMove = Math.min(4, player.firewoodWood)
        player.firewoodWood -= woodToMove
        player.addResource('wood', woodToMove)
        game.log.add({
          template: '{player} moves {amount} wood from Firewood to supply',
          args: { player, amount: woodToMove },
        })
      }
    },
  },
  {
    id: 'wood-cart-c076',
    name: 'Wood Cart',
    deck: 'minorC',
    number: 76,
    type: 'minor',
    cost: { wood: 3 },
    prereqs: { occupations: 3 },
    category: 'Building Resource Provider',
    text: 'Each time you use a wood accumulation space, you get 2 additional wood.',
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
        player.addResource('wood', 2)
        game.log.add({
          template: '{player} gets 2 wood from Wood Cart',
          args: { player },
        })
      }
    },
  },
  {
    id: 'clay-supply-c077',
    name: 'Clay Supply',
    deck: 'minorC',
    number: 77,
    type: 'minor',
    cost: { food: 1 },
    category: 'Building Resource Provider',
    text: 'Place 1 clay on each of the next 3 round spaces. At the start of these rounds, you get the clay.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let i = 1; i <= 3; i++) {
        const round = currentRound + i
        if (round <= 14) {
          if (!game.state.scheduledCite) {
            game.state.scheduledClay = {}
          }
          if (!game.state.scheduledClay[player.name]) {
            game.state.scheduledClay[player.name] = {}
          }
          game.state.scheduledClay[player.name][round] =
            (game.state.scheduledClay[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules clay from Clay Supply',
        args: { player },
      })
    },
  },
  {
    id: 'reed-hatted-toad-c078',
    name: 'Reed-Hatted Toad',
    deck: 'minorC',
    number: 78,
    type: 'minor',
    cost: { food: 1 },
    category: 'Building Resource Provider',
    text: 'Add 5, 7, 9, 11, and 13 to the current round and place 1 reed on each corresponding round space. At the start of these rounds, you get the reed.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (const offset of [5, 7, 9, 11, 13]) {
        const round = currentRound + offset
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
        template: '{player} schedules reed from Reed-Hatted Toad',
        args: { player },
      })
    },
  },
  {
    id: 'stone-cart-c079',
    name: 'Stone Cart',
    deck: 'minorC',
    number: 79,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { occupations: 2 },
    category: 'Building Resource Provider',
    text: 'Place 1 stone on each remaining even-numbered round space. At the start of these rounds, you get the stone.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let round = 2; round <= 14; round += 2) {
        if (round > currentRound) {
          if (!game.state.scheduledStone) {
            game.state.scheduledStone = {}
          }
          if (!game.state.scheduledStone[player.name]) {
            game.state.scheduledStone[player.name] = {}
          }
          game.state.scheduledStone[player.name][round] =
            (game.state.scheduledStone[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules stone from Stone Cart',
        args: { player },
      })
    },
  },
  {
    id: 'rocky-terrain-c080',
    name: 'Rocky Terrain',
    deck: 'minorC',
    number: 80,
    type: 'minor',
    cost: { food: 1 },
    category: 'Building Resource Provider',
    text: 'Each time you plow a field (tile or card), you can also buy 1 stone for 1 food.',
    onPlowField(game, player) {
      if (player.food >= 1) {
        game.actions.offerRockyTerrain(player, this)
      }
    },
  },
  {
    id: 'material-hub-c081',
    name: 'Material Hub',
    deck: 'minorC',
    number: 81,
    type: 'minor',
    cost: { wood: 1, clay: 1 },
    prereqs: { reed: 1, stone: 1 },
    category: 'Building Resource Provider',
    text: 'Immediately place 2 of each building resource on this card. Each time any player (including you) takes at least 5 wood, 4 clay, 3 reed, or 3 stone, you get 1 of that building resource from this card.',
    onPlay(game, player) {
      player.materialHubResources = { wood: 2, clay: 2, reed: 2, stone: 2 }
      game.log.add({
        template: '{player} places resources on Material Hub',
        args: { player },
      })
    },
    onAnyAction(game, actingPlayer, actionId, cardOwner, details) {
      if (!cardOwner.materialHubResources) {
        return
      }
      const thresholds = { wood: 5, clay: 4, reed: 3, stone: 3 }
      for (const [resource, threshold] of Object.entries(thresholds)) {
        if (details && details[`${resource}Taken`] >= threshold && cardOwner.materialHubResources[resource] > 0) {
          cardOwner.materialHubResources[resource]--
          cardOwner.addResource(resource, 1)
          game.log.add({
            template: '{player} gets 1 {resource} from Material Hub',
            args: { player: cardOwner, resource },
          })
        }
      }
    },
  },
  {
    id: 'hardware-store-c082',
    name: 'Hardware Store',
    deck: 'minorC',
    number: 82,
    type: 'minor',
    cost: { wood: 1, clay: 1 },
    vps: 1,
    category: 'Building Resource Provider',
    text: 'Each time after you use the "Day Laborer" action space, you can pay 2 food total to buy 1 wood, 1 clay, 1 reed, and 1 stone.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer' && player.food >= 2) {
        game.actions.offerHardwareStore(player, this)
      }
    },
  },
  {
    id: 'early-cattle-c083',
    name: 'Early Cattle',
    deck: 'minorC',
    number: 83,
    type: 'minor',
    cost: {},
    vps: -3,
    prereqs: { pastures: 1 },
    category: 'Livestock Provider',
    text: 'When you play this card, you immediately get 2 cattle.',
    onPlay(game, player) {
      player.addAnimal('cattle', 2)
      game.log.add({
        template: '{player} gets 2 cattle from Early Cattle',
        args: { player },
      })
    },
  },
  {
    id: 'perennial-rye-c084',
    name: 'Perennial Rye',
    deck: 'minorC',
    number: 84,
    type: 'minor',
    cost: { food: 1 },
    prereqs: { occupations: 2 },
    category: 'Livestock Provider',
    text: 'Each round that does not end with a harvest, you can pay 1 grain to breed exactly 1 type of animal. (This is not considered a breeding phase.)',
    onRoundEnd(game, player, round) {
      if (!game.isHarvestRound(round) && player.grain >= 1) {
        game.actions.offerPerennialRye(player, this)
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
