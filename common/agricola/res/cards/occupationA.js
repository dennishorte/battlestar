/**
 * Occupations A Cards for Agricola (Revised Edition)
 * Cards A085-A168 - A standalone occupations deck
 */

const occupations = [
  {
    id: 'homekeeper-a085',
    name: 'Homekeeper',
    deck: 'occupationA',
    number: 85,
    type: 'occupation',
    players: '1+',
    text: 'Exactly one clay or stone room in your house can hold an additional person if the room is adjacent to both a field and a pasture.',
    modifyRoomCapacity(game, player, room) {
      if ((player.roomType === 'clay' || player.roomType === 'stone') &&
          player.isRoomAdjacentToField(room) &&
          player.isRoomAdjacentToPasture(room)) {
        return 1 // One room can hold +1 person
      }
      return 0
    },
  },
  {
    id: 'animal-tamer-a086',
    name: 'Animal Tamer',
    deck: 'occupationA',
    number: 86,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get your choice of 1 wood or 1 grain. Instead of just 1 animal total, you can keep any 1 animal in each room of your house.',
    onPlay(game, player) {
      game.actions.offerResourceChoice(player, this, ['wood', 'grain'])
    },
    modifyHouseAnimalCapacity(player) {
      return player.getRoomCount()
    },
  },
  {
    id: 'conservator-a087',
    name: 'Conservator',
    deck: 'occupationA',
    number: 87,
    type: 'occupation',
    players: '1+',
    text: 'You can renovate your wooden house directly to stone without renovating it to clay first.',
    allowDirectStoneRenovation: true,
  },
  {
    id: 'hedge-keeper-a088',
    name: 'Hedge Keeper',
    deck: 'occupationA',
    number: 88,
    type: 'occupation',
    players: '1+',
    text: 'Each time you take a "Build Fences" action, you do not have to pay wood for 3 of the fences you build.',
    modifyFenceCost(player, fenceCount) {
      return Math.max(0, fenceCount - 3)
    },
  },
  {
    id: 'stable-planner-a089',
    name: 'Stable Planner',
    deck: 'occupationA',
    number: 89,
    type: 'occupation',
    players: '1+',
    text: 'Add 3, 6, and 9 to the current round. You can place 1 stable on each corresponding round space. At the start of these rounds (not earlier), you can build the stable at no cost.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (const offset of [3, 6, 9]) {
        const round = currentRound + offset
        if (round <= 14) {
          if (!game.state.scheduledFreeStables) {
            game.state.scheduledFreeStables = {}
          }
          if (!game.state.scheduledFreeStables[player.name]) {
            game.state.scheduledFreeStables[player.name] = []
          }
          game.state.scheduledFreeStables[player.name].push(round)
        }
      }
      game.log.add({
        template: '{player} schedules free stables from Stable Planner',
        args: { player },
      })
    },
  },
  {
    id: 'plow-driver-a090',
    name: 'Plow Driver',
    deck: 'occupationA',
    number: 90,
    type: 'occupation',
    players: '1+',
    text: 'Once you live in a stone house, at the start of each round, you can pay 1 food to plow 1 field.',
    onRoundStart(game, player) {
      if (player.roomType === 'stone' && (player.food >= 1 || game.getAnytimeFoodConversionOptions(player).length > 0)) {
        game.offerPlowForFood(player, this)
      }
    },
  },
  {
    id: 'shifting-cultivator-a091',
    name: 'Shifting Cultivator',
    deck: 'occupationA',
    number: 91,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use a wood accumulation space, you can also pay 3 food to plow 1 field.',
    onAction(game, player, actionId) {
      const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
      if (woodActions.includes(actionId) && player.food >= 3) {
        game.offerPlowForFood(player, this, 3)
      }
    },
  },
  {
    id: 'adoptive-parents-a092',
    name: 'Adoptive Parents',
    deck: 'occupationA',
    number: 92,
    type: 'occupation',
    players: '1+',
    text: 'For 1 food, you can take an action with offspring in the same round you get it. If you do, the offspring does not count as "newborn".',
    allowImmediateOffspringAction: true,
  },
  {
    id: 'bed-maker-a093',
    name: 'Bed Maker',
    deck: 'occupationA',
    number: 93,
    type: 'occupation',
    players: '1+',
    text: 'Each time you add rooms to your house, you can also pay 1 wood and 1 grain to immediately get a "Family Growth with Room Only" action.',
    onBuildRoom(game, player) {
      if (player.wood >= 1 && player.grain >= 1 && player.canGrowFamily()) {
        game.actions.offerBedMakerGrowth(player, this)
      }
    },
  },
  {
    id: 'lazy-sowman-a094',
    name: 'Lazy Sowman',
    deck: 'occupationA',
    number: 94,
    type: 'occupation',
    players: '1+',
    text: 'Each time you decline an unconditional "Sow" action on your turn, you can immediately place another person on an action space of your choice (even if it is occupied).',
    onDeclineSow(game, player) {
      game.actions.offerExtraPerson(player, this, { allowOccupied: true, excludeMeetingPlace: true })
    },
  },
  {
    id: 'angler-a095',
    name: 'Angler',
    deck: 'occupationA',
    number: 95,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you use the "Fishing" Accumulation space while there are at most 2 food on that space, you get a "Major or Minor Improvement" action.',
    onAction(game, player, actionId) {
      if (actionId === 'fishing') {
        const foodOnSpace = game.getAccumulatedResources('fishing').food || 0
        if (foodOnSpace <= 2) {
          game.actions.offerImprovementAction(player, this)
        }
      }
    },
  },
  {
    id: 'task-artisan-a096',
    name: 'Task Artisan',
    deck: 'occupationA',
    number: 96,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card and each time a stone accumulation space appears on a round space in the preparation phase, you get 1 wood and a "Minor Improvement" action.',
    onPlay(game, player) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Task Artisan',
        args: { player },
      })
      game.actions.offerMinorImprovementAction(player, this)
    },
    onStoneActionRevealed(game, player) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Task Artisan',
        args: { player },
      })
      game.actions.offerMinorImprovementAction(player, this)
    },
  },
  {
    id: 'freshman-a097',
    name: 'Freshman',
    deck: 'occupationA',
    number: 97,
    type: 'occupation',
    players: '1+',
    text: 'Each time you get a "Bake Bread" action, instead of taking the action, you can play an occupation without paying an occupation cost.',
    onBakeBreadAction(game, player) {
      game.actions.offerFreshmanChoice(player, this)
    },
  },
  {
    id: 'stable-architect-a098',
    name: 'Stable Architect',
    deck: 'occupationA',
    number: 98,
    type: 'occupation',
    players: '1+',
    text: 'During scoring, you get 1 bonus point for each unfenced stable in your farmyard.',
    getEndGamePoints(player) {
      return player.getUnfencedStableCount()
    },
  },
  {
    id: 'fellow-grazer-a099',
    name: 'Fellow Grazer',
    deck: 'occupationA',
    number: 99,
    type: 'occupation',
    players: '1+',
    text: 'During scoring, you get 2 bonus points for each pasture you have covering at least 3 farmyard spaces.',
    getEndGamePoints(player) {
      const largePastures = player.getPasturesWithMinSpaces(3)
      return largePastures * 2
    },
  },
  {
    id: 'curator-a100',
    name: 'Curator',
    deck: 'occupationA',
    number: 100,
    type: 'occupation',
    players: '1+',
    text: 'In the returning home phase of each round, if you return at least 3 people from accumulation spaces, you can buy 1 bonus point for 1 food.',
    onReturnHome(game, player) {
      const workersFromAccumulation = player.getWorkersReturnedFromAccumulationSpaces()
      if (workersFromAccumulation >= 3 && player.food >= 1) {
        game.actions.offerBuyBonusPoint(player, this, 1)
      }
    },
  },
  {
    id: 'cookery-outfitter-a101',
    name: 'Cookery Outfitter',
    deck: 'occupationA',
    number: 101,
    type: 'occupation',
    players: '1+',
    text: 'During scoring, you get 1 bonus point for each cooking improvement you have.',
    getEndGamePoints(player) {
      return player.getCookingImprovementCount()
    },
  },
  {
    id: 'grocer-a102',
    name: 'Grocer',
    deck: 'occupationA',
    number: 102,
    type: 'occupation',
    players: '1+',
    text: 'Pile the following goods on this card (wood, grain, reed, stone, vegetable, clay, reed, vegetable). At any time, you can buy the top good for 1 food.',
    onPlay(game, player) {
      player.grocerGoods = ['wood', 'grain', 'reed', 'stone', 'vegetables', 'clay', 'reed', 'vegetables']
    },
    allowsAnytimePurchase: true,
  },
  {
    id: 'portmonger-a103',
    name: 'Portmonger',
    deck: 'occupationA',
    number: 103,
    type: 'occupation',
    players: '1+',
    text: 'Each time you take 1/2/3+ food from a food accumulation space, you also get 1 vegetable/grain/reed.',
    onAction(game, player, actionId, resources) {
      if (resources && resources.food > 0) {
        const foodTaken = resources.food
        let bonus = null
        if (foodTaken >= 3) {
          bonus = 'reed'
        }
        else if (foodTaken === 2) {
          bonus = 'grain'
        }
        else if (foodTaken === 1) {
          bonus = 'vegetables'
        }
        if (bonus) {
          player.addResource(bonus, 1)
          game.log.add({
            template: '{player} gets 1 {resource} from Portmonger',
            args: { player, resource: bonus },
          })
        }
      }
    },
  },
  {
    id: 'wood-harvester-a104',
    name: 'Wood Harvester',
    deck: 'occupationA',
    number: 104,
    type: 'occupation',
    players: '1+',
    text: 'In the field phase of each harvest, you get 1 wood/1 food for each wood accumulation space with exactly 2 wood/at least 3 wood.',
    onFieldPhase(game, player) {
      const woodSpaces = game.getWoodAccumulationSpaces()
      let wood = 0
      let food = 0
      for (const space of woodSpaces) {
        const woodOnSpace = space.accumulated || 0
        if (woodOnSpace === 2) {
          wood++
        }
        else if (woodOnSpace >= 3) {
          food++
        }
      }
      if (wood > 0) {
        player.addResource('wood', wood)
        game.log.add({
          template: '{player} gets {amount} wood from Wood Harvester',
          args: { player, amount: wood },
        })
      }
      if (food > 0) {
        player.addResource('food', food)
        game.log.add({
          template: '{player} gets {amount} food from Wood Harvester',
          args: { player, amount: food },
        })
      }
    },
  },
  {
    id: 'barrow-pusher-a105',
    name: 'Barrow Pusher',
    deck: 'occupationA',
    number: 105,
    type: 'occupation',
    players: '1+',
    text: 'For each new field tile you get, you also get 1 clay and 1 food.',
    onPlowField(game, player) {
      player.addResource('clay', 1)
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 clay and 1 food from Barrow Pusher',
        args: { player },
      })
    },
  },
  {
    id: 'slurry-spreader-a106',
    name: 'Slurry Spreader',
    deck: 'occupationA',
    number: 106,
    type: 'occupation',
    players: '1+',
    text: 'In the field phase of each harvest, each time you take the last grain/vegetable from a field, you also get 2 food/1 food.',
    onHarvestLastCrop(game, player, cropType) {
      const food = cropType === 'grain' ? 2 : 1
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from Slurry Spreader',
        args: { player, amount: food },
      })
    },
  },
  {
    id: 'catcher-a107',
    name: 'Catcher',
    deck: 'occupationA',
    number: 107,
    type: 'occupation',
    players: '1+',
    text: 'Each time you place your 1st/2nd/3rd person in a round on a building resource accumulation space with exactly 5/4/3 building resources, you get 1 food.',
    onPlacePerson(game, player, actionId, personNumber) {
      const thresholds = { 1: 5, 2: 4, 3: 3 }
      if (personNumber <= 3 && game.isBuildingResourceAccumulationSpace(actionId)) {
        const resources = game.getAccumulatedBuildingResources(actionId)
        if (resources === thresholds[personNumber]) {
          player.addResource('food', 1)
          game.log.add({
            template: '{player} gets 1 food from Catcher',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'mushroom-collector-a108',
    name: 'Mushroom Collector',
    deck: 'occupationA',
    number: 108,
    type: 'occupation',
    players: '1+',
    text: 'Immediately after each time you use a wood accumulation space, you can exchange 1 wood for 2 food. If you do, place the wood on the accumulation space.',
    onAction(game, player, actionId) {
      const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
      if (woodActions.includes(actionId) && player.wood >= 1) {
        game.actions.offerWoodForFoodExchange(player, this, { wood: 1, food: 2 })
      }
    },
  },
  {
    id: 'small-trader-a109',
    name: 'Small Trader',
    deck: 'occupationA',
    number: 109,
    type: 'occupation',
    players: '1+',
    text: 'Each time you take a "Major or Minor Improvement" action to play an improvement from your hand, you also get 3 food.',
    onPlayMinorFromHand(game, player) {
      player.addResource('food', 3)
      game.log.add({
        template: '{player} gets 3 food from Small Trader',
        args: { player },
      })
    },
  },
  {
    id: 'roughcaster-a110',
    name: 'Roughcaster',
    deck: 'occupationA',
    number: 110,
    type: 'occupation',
    players: '1+',
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
    id: 'wall-builder-a111',
    name: 'Wall Builder',
    deck: 'occupationA',
    number: 111,
    type: 'occupation',
    players: '1+',
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
    id: 'scythe-worker-a112',
    name: 'Scythe Worker',
    deck: 'occupationA',
    number: 112,
    type: 'occupation',
    players: '1+',
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
    id: 'heresy-teacher-a113',
    name: 'Heresy Teacher',
    deck: 'occupationA',
    number: 113,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use a "Lessons" action space, you get 1 vegetable in each of your fields with at least 3 grain and no vegetable. Place the vegetable below the grain.',
    onAction(game, player, actionId) {
      if (actionId === 'lessons-1' || actionId === 'lessons-2') {
        const eligibleFields = player.getFieldsWithGrainNoVegetable(3)
        for (const field of eligibleFields) {
          player.addVegetableToField(field)
        }
        if (eligibleFields.length > 0) {
          game.log.add({
            template: '{player} places vegetables in {count} fields from Heresy Teacher',
            args: { player, count: eligibleFields.length },
          })
        }
      }
    },
  },
  {
    id: 'seasonal-worker-a114',
    name: 'Seasonal Worker',
    deck: 'occupationA',
    number: 114,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Day Laborer" action space, you get 1 additional grain. From Round 6 on, you can choose to get 1 vegetable instead.',
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
    id: 'chief-forester-a115',
    name: 'Chief Forester',
    deck: 'occupationA',
    number: 115,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use a wood accumulation space, you also get a "Sow" action for exactly 1 field.',
    onAction(game, player, actionId) {
      const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
      if (woodActions.includes(actionId)) {
        game.actions.offerSowSingleField(player, this)
      }
    },
  },
  {
    id: 'wood-cutter-a116',
    name: 'Wood Cutter',
    deck: 'occupationA',
    number: 116,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use a wood accumulation space, you get 1 additional wood.',
    onAction(game, player, actionId) {
      const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
      if (woodActions.includes(actionId)) {
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 additional wood from Wood Cutter',
          args: { player },
        })
      }
    },
  },
  {
    id: 'wood-carrier-a117',
    name: 'Wood Carrier',
    deck: 'occupationA',
    number: 117,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 wood for each improvement in front of you.',
    onPlay(game, player) {
      const improvements = player.getImprovementCount()
      if (improvements > 0) {
        player.addResource('wood', improvements)
        game.log.add({
          template: '{player} gets {amount} wood from Wood Carrier',
          args: { player, amount: improvements },
        })
      }
    },
  },
  {
    id: 'treegardener-a118',
    name: 'Treegardener',
    deck: 'occupationA',
    number: 118,
    type: 'occupation',
    players: '1+',
    text: 'In the field phase of each harvest, you get 1 wood and you can buy up to 2 additional wood for 1 food each.',
    onFieldPhase(game, player) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Treegardener',
        args: { player },
      })
      if (player.food >= 1) {
        game.actions.offerBuyWood(player, this, 2, 1)
      }
    },
  },
  {
    id: 'firewood-collector-a119',
    name: 'Firewood Collector',
    deck: 'occupationA',
    number: 119,
    type: 'occupation',
    players: '1+',
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
    id: 'clay-hut-builder-a120',
    name: 'Clay Hut Builder',
    deck: 'occupationA',
    number: 120,
    type: 'occupation',
    players: '1+',
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
    id: 'clay-puncher-a121',
    name: 'Clay Puncher',
    deck: 'occupationA',
    number: 121,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card and each time after you use a "Lessons" action space or the "Clay Pit" accumulation space, you get 1 clay.',
    onPlay(game, player) {
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 clay from Clay Puncher',
        args: { player },
      })
    },
    onAction(game, player, actionId) {
      if (actionId === 'lessons-1' || actionId === 'lessons-2' || actionId === 'take-clay') {
        player.addResource('clay', 1)
        game.log.add({
          template: '{player} gets 1 clay from Clay Puncher',
          args: { player },
        })
      }
    },
  },
  {
    id: 'pan-baker-a122',
    name: 'Pan Baker',
    deck: 'occupationA',
    number: 122,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Grain Utilization" action space, you also get 2 clay and 1 wood.',
    onAction(game, player, actionId) {
      if (actionId === 'sow-bake') {
        player.addResource('clay', 2)
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 2 clay and 1 wood from Pan Baker',
          args: { player },
        })
      }
    },
  },
  {
    id: 'frame-builder-a123',
    name: 'Frame Builder',
    deck: 'occupationA',
    number: 123,
    type: 'occupation',
    players: '1+',
    text: 'Each time you build a room/renovate, but only once per room/action, you can replace exactly 2 clay or 2 stone with 1 wood.',
    modifyBuildCost(player, cost, count) {
      return { ...cost, allowWoodSubstitution: count }
    },
  },
  {
    id: 'knapper-a124',
    name: 'Knapper',
    deck: 'occupationA',
    number: 124,
    type: 'occupation',
    players: '1+',
    text: 'Each time before you use an action space card on round spaces 5 to 7, you get 1 stone.',
    onBeforeAction(game, player, actionId) {
      const actionRound = game.getActionSpaceRound(actionId)
      if (actionRound >= 5 && actionRound <= 7) {
        player.addResource('stone', 1)
        game.log.add({
          template: '{player} gets 1 stone from Knapper',
          args: { player },
        })
      }
    },
  },
  {
    id: 'priest-a125',
    name: 'Priest',
    deck: 'occupationA',
    number: 125,
    type: 'occupation',
    players: '1+',
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
    id: 'master-workman-a126',
    name: 'Master Workman',
    deck: 'occupationA',
    number: 126,
    type: 'occupation',
    players: '1+',
    text: 'Each time before you use an action space card on round spaces 1/2/3/4, you get 1 wood/clay/reed/stone.',
    onBeforeAction(game, player, actionId) {
      const actionRound = game.getActionSpaceRound(actionId)
      const resources = { 1: 'wood', 2: 'clay', 3: 'reed', 4: 'stone' }
      if (resources[actionRound]) {
        player.addResource(resources[actionRound], 1)
        game.log.add({
          template: '{player} gets 1 {resource} from Master Workman',
          args: { player, resource: resources[actionRound] },
        })
      }
    },
  },
  {
    id: 'lodger-a127',
    name: 'Lodger',
    deck: 'occupationA',
    number: 127,
    type: 'occupation',
    players: '1+',
    text: 'This card provides room for one person, but only until the returning home phase of round 9. If, by then, there is no room elsewhere for that person, remove it from play.',
    providesRoom: true,
    providesRoomUntilRound: 9,
  },
  {
    id: 'riparian-builder-a128',
    name: 'Riparian Builder',
    deck: 'occupationA',
    number: 128,
    type: 'occupation',
    players: '1+',
    text: 'Each time another player uses the "Reed Bank" accumulation space, you can build a room: if you build a clay/stone room, you get a discount of 1 clay/2 stone.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'take-reed' && actingPlayer.name !== cardOwner.name) {
        game.actions.offerRiparianBuilderRoom(cardOwner, this)
      }
    },
  },
  {
    id: 'swagman-a129',
    name: 'Swagman',
    deck: 'occupationA',
    number: 129,
    type: 'occupation',
    players: '1+',
    text: 'Immediately after each time you use the "Farm Expansion" or "Grain Seeds" action space, you can use the respective other space with the same person (even if it is occupied).',
    onAction(game, player, actionId) {
      if (actionId === 'farm-expansion') {
        game.actions.offerUseOtherSpace(player, this, 'take-grain', { allowOccupied: true })
      }
      else if (actionId === 'take-grain') {
        game.actions.offerUseOtherSpace(player, this, 'farm-expansion', { allowOccupied: true })
      }
    },
  },
  {
    id: 'mummys-boy-a130',
    name: "Mummy's Boy",
    deck: 'occupationA',
    number: 130,
    type: 'occupation',
    players: '1+',
    text: "Once per round, when placing a person after your first two, you can place it on the action space with your 2nd person and use that space again. (Mark the action space).",
    allowsDoubleAction: true,
  },
  {
    id: 'craft-teacher-a131',
    name: 'Craft Teacher',
    deck: 'occupationA',
    number: 131,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you build the major improvement "Joinery", "Pottery", and "Basketmaker\'s Workshop", you can play up to 2 occupations without paying an occupation cost.',
    onBuildMajor(game, player, majorId) {
      if (majorId === 'joinery' || majorId === 'pottery' || majorId === 'basketmakers-workshop') {
        game.actions.offerFreeOccupations(player, this, 2)
      }
    },
  },
  {
    id: 'publican-a132',
    name: 'Publican',
    deck: 'occupationA',
    number: 132,
    type: 'occupation',
    players: '1+',
    text: 'Each time before another player takes an unconditional "Sow" action, you can give them 1 grain from your supply to get 1 bonus point.',
    onAnyBeforeSow(game, actingPlayer, cardOwner) {
      if (actingPlayer.name !== cardOwner.name && cardOwner.grain >= 1) {
        game.actions.offerPublicanBonus(cardOwner, actingPlayer, this)
      }
    },
  },
  {
    id: 'braggart-a133',
    name: 'Braggart',
    deck: 'occupationA',
    number: 133,
    type: 'occupation',
    players: '3+',
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
    id: 'full-farmer-a134',
    name: 'Full Farmer',
    deck: 'occupationA',
    number: 134,
    type: 'occupation',
    players: '3+',
    text: 'When you play this card, you immediately get 1 wood and 1 clay. During scoring, you get 1 bonus point for each pasture you have holding the maximum number of animals.',
    onPlay(game, player) {
      player.addResource('wood', 1)
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 wood and 1 clay from Full Farmer',
        args: { player },
      })
    },
    getEndGamePoints(player) {
      return player.getFullPastureCount()
    },
  },
  {
    id: 'animal-reeve-a135',
    name: 'Animal Reeve',
    deck: 'occupationA',
    number: 135,
    type: 'occupation',
    players: '3+',
    text: 'If there are still 1/3/6/9 complete rounds left to play, you immediately get 1/2/3/4 wood. During scoring, each player with 2+/3+/4+ animals of each type gets 1/3/5 bonus points.',
    onPlay(game, player) {
      const roundsLeft = 14 - game.state.round
      let wood = 0
      if (roundsLeft >= 9) {
        wood = 4
      }
      else if (roundsLeft >= 6) {
        wood = 3
      }
      else if (roundsLeft >= 3) {
        wood = 2
      }
      else if (roundsLeft >= 1) {
        wood = 1
      }
      if (wood > 0) {
        player.addResource('wood', wood)
        game.log.add({
          template: '{player} gets {amount} wood from Animal Reeve',
          args: { player, amount: wood },
        })
      }
    },
    getEndGamePointsAllPlayers(game) {
      const bonuses = {}
      for (const player of game.players.all()) {
        const minAnimals = Math.min(
          player.getTotalAnimals('sheep'),
          player.getTotalAnimals('boar'),
          player.getTotalAnimals('cattle')
        )
        if (minAnimals >= 4) {
          bonuses[player.name] = 5
        }
        else if (minAnimals >= 3) {
          bonuses[player.name] = 3
        }
        else if (minAnimals >= 2) {
          bonuses[player.name] = 1
        }
      }
      return bonuses
    },
  },
  {
    id: 'drudgery-reeve-a136',
    name: 'Drudgery Reeve',
    deck: 'occupationA',
    number: 136,
    type: 'occupation',
    players: '3+',
    text: 'If there are still 3/6/9 complete rounds left to play, you immediately get 2/3/4 wood. During scoring, each player with 1+/2+/3+ building resources of each type gets 1/3/5 bonus points.',
    onPlay(game, player) {
      const roundsLeft = 14 - game.state.round
      let wood = 0
      if (roundsLeft >= 9) {
        wood = 4
      }
      else if (roundsLeft >= 6) {
        wood = 3
      }
      else if (roundsLeft >= 3) {
        wood = 2
      }
      if (wood > 0) {
        player.addResource('wood', wood)
        game.log.add({
          template: '{player} gets {amount} wood from Drudgery Reeve',
          args: { player, amount: wood },
        })
      }
    },
    getEndGamePointsAllPlayers(game) {
      const bonuses = {}
      for (const player of game.players.all()) {
        const minResources = Math.min(player.wood, player.clay, player.reed, player.stone)
        if (minResources >= 3) {
          bonuses[player.name] = 5
        }
        else if (minResources >= 2) {
          bonuses[player.name] = 3
        }
        else if (minResources >= 1) {
          bonuses[player.name] = 1
        }
      }
      return bonuses
    },
  },
  {
    id: 'riverine-shepherd-a137',
    name: 'Riverine Shepherd',
    deck: 'occupationA',
    number: 137,
    type: 'occupation',
    players: '3+',
    text: 'Each time you use the "Sheep Market" or "Reed Bank" accumulation space, you can also take 1 good from the respective other accumulation space, if possible.',
    onAction(game, player, actionId) {
      if (actionId === 'take-sheep') {
        const reedOnBank = game.getAccumulatedResources('take-reed').reed || 0
        if (reedOnBank > 0) {
          game.removeFromAccumulationSpace('take-reed', 'reed', 1)
          player.addResource('reed', 1)
          game.log.add({
            template: '{player} takes 1 reed from Reed Bank via Riverine Shepherd',
            args: { player },
          })
        }
      }
      else if (actionId === 'take-reed') {
        const sheepOnMarket = game.getAccumulatedResources('take-sheep').sheep || 0
        if (sheepOnMarket > 0) {
          game.removeFromAccumulationSpace('take-sheep', 'sheep', 1)
          player.addAnimals('sheep', 1)
          game.log.add({
            template: '{player} takes 1 sheep from Sheep Market via Riverine Shepherd',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'harpooner-a138',
    name: 'Harpooner',
    deck: 'occupationA',
    number: 138,
    type: 'occupation',
    players: '3+',
    text: 'Each time you use the "Fishing" accumulation space you can also pay 1 wood to get 1 food for each person you have, and 1 reed.',
    onAction(game, player, actionId) {
      if (actionId === 'fishing' && player.wood >= 1) {
        game.actions.offerHarpoonerBonus(player, this)
      }
    },
  },
  {
    id: 'hollow-warden-a139',
    name: 'Hollow Warden',
    deck: 'occupationA',
    number: 139,
    type: 'occupation',
    players: '3+',
    text: 'When you play this card, you immediately get a "Major Improvement" action to build a Fireplace. Each time you use the "Hollow" accumulation space, you also get 1 food.',
    onPlay(game, player) {
      game.actions.offerBuildFireplace(player, this)
    },
    onAction(game, player, actionId) {
      if (actionId === 'take-clay-2') {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Hollow Warden',
          args: { player },
        })
      }
    },
  },
  {
    id: 'shovel-bearer-a140',
    name: 'Shovel Bearer',
    deck: 'occupationA',
    number: 140,
    type: 'occupation',
    players: '3+',
    text: 'Each time you use the "Clay Pit" or "Hollow" accumulation space, you also get a number of food equal to the amount of clay on the respective other accumulation space.',
    onAction(game, player, actionId) {
      let otherSpace = null
      if (actionId === 'take-clay') {
        otherSpace = 'take-clay-2'
      }
      else if (actionId === 'take-clay-2') {
        otherSpace = 'take-clay'
      }
      if (otherSpace) {
        const clayOnOther = game.getAccumulatedResources(otherSpace).clay || 0
        if (clayOnOther > 0) {
          player.addResource('food', clayOnOther)
          game.log.add({
            template: '{player} gets {amount} food from Shovel Bearer',
            args: { player, amount: clayOnOther },
          })
        }
      }
    },
  },
  {
    id: 'turnip-farmer-a141',
    name: 'Turnip Farmer',
    deck: 'occupationA',
    number: 141,
    type: 'occupation',
    players: '3+',
    text: 'At the start of the returning home phase of each round, if both the "Day Laborer" and "Grain Seeds" action spaces are occupied, you get 1 vegetable.',
    onReturnHomeStart(game, player) {
      if (game.isActionOccupied('day-laborer') && game.isActionOccupied('take-grain')) {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from Turnip Farmer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'cordmaker-a142',
    name: 'Cordmaker',
    deck: 'occupationA',
    number: 142,
    type: 'occupation',
    players: '3+',
    text: 'Each time any player (including you) takes at least 2 reed from the "Reed Bank" accumulation space, you can choose to take 1 grain or buy 1 vegetable for 2 food.',
    onAnyAction(game, actingPlayer, actionId, cardOwner, resources) {
      if (actionId === 'take-reed' && resources && resources.reed >= 2) {
        game.actions.offerCordmakerChoice(cardOwner, this)
      }
    },
  },
  {
    id: 'stonecutter-a143',
    name: 'Stonecutter',
    deck: 'occupationA',
    number: 143,
    type: 'occupation',
    players: '3+',
    text: 'Every improvement, room, and renovation costs you 1 stone less.',
    modifyAnyCost(player, cost) {
      if (cost.stone && cost.stone > 0) {
        return { ...cost, stone: cost.stone - 1 }
      }
      return cost
    },
  },
  {
    id: 'sequestrator-a144',
    name: 'Sequestrator',
    deck: 'occupationA',
    number: 144,
    type: 'occupation',
    players: '3+',
    text: 'Place 3 reed and 4 clay on this card. The next player to have 3 pastures/5 field tiles get the 3 reed/4 clay (not retroactively).',
    onPlay(_game, _player) {
      this.reedAvailable = 3
      this.clayAvailable = 4
    },
    checkTriggers(game) {
      if (this.reedAvailable > 0 || this.clayAvailable > 0) {
        for (const player of game.players.all()) {
          if (this.reedAvailable > 0 && player.getPastureCount() >= 3) {
            player.addResource('reed', 3)
            this.reedAvailable = 0
            game.log.add({
              template: '{player} gets 3 reed from Sequestrator',
              args: { player },
            })
          }
          if (this.clayAvailable > 0 && player.getFieldCount() >= 5) {
            player.addResource('clay', 4)
            this.clayAvailable = 0
            game.log.add({
              template: '{player} gets 4 clay from Sequestrator',
              args: { player },
            })
          }
        }
      }
    },
  },
  {
    id: 'ropemaker-a145',
    name: 'Ropemaker',
    deck: 'occupationA',
    number: 145,
    type: 'occupation',
    players: '3+',
    text: 'At the end of each harvest, you get 1 reed from the general supply.',
    onHarvestEnd(game, player) {
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 reed from Ropemaker',
        args: { player },
      })
    },
  },
  {
    id: 'storehouse-steward-a146',
    name: 'Storehouse Steward',
    deck: 'occupationA',
    number: 146,
    type: 'occupation',
    players: '3+',
    text: 'Each time you take exactly 2/3/4/5 food from a food accumulation space, you also get 1 stone/reed/clay/wood. (If you take 6 or more food, you do not get a bonus good).',
    onAction(game, player, actionId, resources) {
      if (resources && resources.food > 0) {
        const bonuses = { 2: 'stone', 3: 'reed', 4: 'clay', 5: 'wood' }
        const bonus = bonuses[resources.food]
        if (bonus) {
          player.addResource(bonus, 1)
          game.log.add({
            template: '{player} gets 1 {resource} from Storehouse Steward',
            args: { player, resource: bonus },
          })
        }
      }
    },
  },
  {
    id: 'animal-dealer-a147',
    name: 'Animal Dealer',
    deck: 'occupationA',
    number: 147,
    type: 'occupation',
    players: '3+',
    text: 'Each time you use the "Sheep Market", "Pig Market", or "Cattle Market" accumulation space, you can buy 1 additional animal of the respective type for 1 food.',
    onAction(game, player, actionId) {
      const animalMarkets = {
        'take-sheep': 'sheep',
        'take-boar': 'boar',
        'take-cattle': 'cattle',
      }
      if (animalMarkets[actionId] && (player.food >= 1 || game.getAnytimeFoodConversionOptions(player).length > 0)) {
        game.actions.offerBuyAnimal(player, this, animalMarkets[actionId])
      }
    },
  },
  {
    id: 'woolgrower-a148',
    name: 'Woolgrower',
    deck: 'occupationA',
    number: 148,
    type: 'occupation',
    players: '3+',
    text: 'This card can hold a number of sheep equal to the number of completed feeding phases.',
    holdsAnimals: { sheep: true },
    getAnimalCapacity(game) {
      return game.getCompletedFeedingPhases()
    },
  },
  {
    id: 'house-artist-a149',
    name: 'House Artist',
    deck: 'occupationA',
    number: 149,
    type: 'occupation',
    players: '3+',
    text: 'Each time you use the "Traveling Players" accumulation space, you also get a "Build Rooms" action. Each room you build during the action costs you 1 reed less.',
    onAction(game, player, actionId) {
      if (actionId === 'traveling-players') {
        game.actions.offerBuildRoomsWithDiscount(player, this, { reed: 1 })
      }
    },
  },
  {
    id: 'stagehand-a150',
    name: 'Stagehand',
    deck: 'occupationA',
    number: 150,
    type: 'occupation',
    players: '3+',
    text: 'Each time another player uses the "Traveling Players" accumulation space, you can take your choice of a "Build Fences", "Build Stables", or "Build Rooms" action.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'traveling-players' && actingPlayer.name !== cardOwner.name) {
        game.actions.offerBuildChoice(cardOwner, this, ['fences', 'stables', 'rooms'])
      }
    },
  },
  {
    id: 'minstrel-a151',
    name: 'Minstrel',
    deck: 'occupationA',
    number: 151,
    type: 'occupation',
    players: '3+',
    text: 'At the start of each returning home phase, if only one action space card on round space 1 to 4 is unoccupied, you can use that action space.',
    onReturnHomeStart(game, player) {
      const unoccupiedRound1to4 = game.getUnoccupiedActionSpacesInRounds(1, 4)
      if (unoccupiedRound1to4.length === 1) {
        game.actions.offerUseActionSpace(player, this, unoccupiedRound1to4[0])
      }
    },
  },
  {
    id: 'night-school-student-a152',
    name: 'Night-School Student',
    deck: 'occupationA',
    number: 152,
    type: 'occupation',
    players: '3+',
    text: 'Each returning home phase in which no player returns a person from a "Lessons" action space, you can play an occupation for an occupation cost of 1 food.',
    onReturnHome(game, player) {
      if (!game.anyPlayerReturnedFromLessons()) {
        game.actions.offerPlayOccupation(player, this, { cost: { food: 1 } })
      }
    },
  },
  {
    id: 'pig-owner-a153',
    name: 'Pig Owner',
    deck: 'occupationA',
    number: 153,
    type: 'occupation',
    players: '3+',
    text: 'The first time after you play this card that you have 5 wild boars on your farm, you immediately get 3 bonus points.',
    checkTrigger(game, player) {
      if (!player.pigOwnerTriggered && player.getTotalAnimals('boar') >= 5) {
        player.pigOwnerTriggered = true
        player.bonusPoints = (player.bonusPoints || 0) + 3
        game.log.add({
          template: '{player} gets 3 bonus points from Pig Owner',
          args: { player },
        })
      }
    },
  },
  {
    id: 'paymaster-a154',
    name: 'Paymaster',
    deck: 'occupationA',
    number: 154,
    type: 'occupation',
    players: '3+',
    text: 'Each time another player uses a food accumulation space, you can give them 1 grain from your supply to get 1 bonus point.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (game.isFoodAccumulationSpace(actionId) && actingPlayer.name !== cardOwner.name && cardOwner.grain >= 1) {
        game.actions.offerPaymasterBonus(cardOwner, actingPlayer, this)
      }
    },
  },
  {
    id: 'conjurer-a155',
    name: 'Conjurer',
    deck: 'occupationA',
    number: 155,
    type: 'occupation',
    players: '4+',
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
    id: 'buyer-a156',
    name: 'Buyer',
    deck: 'occupationA',
    number: 156,
    type: 'occupation',
    players: '4+',
    text: 'Each time another player uses a reed, stone, sheep, or wild boar accumulation space, you can pay them 1 food to get 1 good of the respective type from the general supply.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      const typeMap = {
        'take-reed': 'reed',
        'take-stone-1': 'stone',
        'take-stone-2': 'stone',
        'take-sheep': 'sheep',
        'take-boar': 'boar',
      }
      if (typeMap[actionId] && actingPlayer.name !== cardOwner.name && cardOwner.food >= 1) {
        game.actions.offerBuyerPurchase(cardOwner, actingPlayer, this, typeMap[actionId])
      }
    },
  },
  {
    id: 'bohemian-a157',
    name: 'Bohemian',
    deck: 'occupationA',
    number: 157,
    type: 'occupation',
    players: '4+',
    text: 'At the start of each returning home phase, if at least one "Lessons" action space is unoccupied, you get 1 food.',
    onReturnHomeStart(game, player) {
      if (!game.isActionOccupied('lessons-1') || !game.isActionOccupied('lessons-2')) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Bohemian',
          args: { player },
        })
      }
    },
  },
  {
    id: 'culinary-artist-a158',
    name: 'Culinary Artist',
    deck: 'occupationA',
    number: 158,
    type: 'occupation',
    players: '4+',
    text: 'Each time another player uses the "Traveling Players" accumulation space, you can exchange your choice of 1 grain/sheep/vegetable for 4/5/7 food.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'traveling-players' && actingPlayer.name !== cardOwner.name) {
        game.actions.offerCulinaryArtistExchange(cardOwner, this)
      }
    },
  },
  {
    id: 'joiner-of-the-sea-a159',
    name: 'Joiner of the Sea',
    deck: 'occupationA',
    number: 159,
    type: 'occupation',
    players: '4+',
    text: 'Each time another player uses the "Fishing"/"Reed Bank" accumulation space, you can give them 1 wood to get 2 food/3 food from the general supply.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if ((actionId === 'fishing' || actionId === 'take-reed') && actingPlayer.name !== cardOwner.name && cardOwner.wood >= 1) {
        const food = actionId === 'fishing' ? 2 : 3
        game.actions.offerJoinerOfTheSeaTrade(cardOwner, actingPlayer, this, food)
      }
    },
  },
  {
    id: 'lutenist-a160',
    name: 'Lutenist',
    deck: 'occupationA',
    number: 160,
    type: 'occupation',
    players: '4+',
    text: 'Each time another player uses the "Traveling Players" accumulation space, you get 1 food and 1 wood. Immediately after, you can buy exactly 1 vegetable for 2 food.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'traveling-players' && actingPlayer.name !== cardOwner.name) {
        cardOwner.addResource('food', 1)
        cardOwner.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 food and 1 wood from Lutenist',
          args: { player: cardOwner },
        })
        if (cardOwner.food >= 2 || game.getAnytimeFoodConversionOptions(cardOwner).length > 0) {
          game.actions.offerBuyVegetable(cardOwner, this, 2)
        }
      }
    },
  },
  {
    id: 'patch-caretaker-a161',
    name: 'Patch Caretaker',
    deck: 'occupationA',
    number: 161,
    type: 'occupation',
    players: '4+',
    text: 'Each time you use an accumulation space while already having used another accumulation space for the same type of good that work phase, you also get 1 vegetable.',
    onAction(game, player, actionId) {
      if (game.isAccumulationSpace(actionId)) {
        const goodType = game.getAccumulationSpaceGoodType(actionId)
        if (player.usedAccumulationSpaceTypes && player.usedAccumulationSpaceTypes.includes(goodType)) {
          player.addResource('vegetables', 1)
          game.log.add({
            template: '{player} gets 1 vegetable from Patch Caretaker',
            args: { player },
          })
        }
        if (!player.usedAccumulationSpaceTypes) {
          player.usedAccumulationSpaceTypes = []
        }
        player.usedAccumulationSpaceTypes.push(goodType)
      }
    },
  },
  {
    id: 'forest-tallyman-a162',
    name: 'Forest Tallyman',
    deck: 'occupationA',
    number: 162,
    type: 'occupation',
    players: '4+',
    text: 'Each time both the "Forest" and "Clay Pit" accumulation spaces are occupied, you can use the gap between them as an action space to get 2 clay and 3 wood.',
    // This creates a special action space
    createsActionSpace: 'forest-tallyman-gap',
    actionSpaceAvailable(game) {
      return game.isActionOccupied('take-wood') && game.isActionOccupied('take-clay')
    },
    onUseCreatedSpace(game, player) {
      player.addResource('clay', 2)
      player.addResource('wood', 3)
      game.log.add({
        template: '{player} gets 2 clay and 3 wood from Forest Tallyman',
        args: { player },
      })
    },
  },
  {
    id: 'building-expert-a163',
    name: 'Building Expert',
    deck: 'occupationA',
    number: 163,
    type: 'occupation',
    players: '4+',
    text: 'Each time you use the "Resource Market" action space with the 1st/2nd/3rd/4th/5th person you place, you also get 1 wood/clay/reed/stone/stone.',
    onAction(game, player, actionId) {
      if (actionId === 'resource-market') {
        const personNumber = player.getPersonPlacedThisRound()
        const bonuses = { 1: 'wood', 2: 'clay', 3: 'reed', 4: 'stone', 5: 'stone' }
        const bonus = bonuses[personNumber]
        if (bonus) {
          player.addResource(bonus, 1)
          game.log.add({
            template: '{player} gets 1 {resource} from Building Expert',
            args: { player, resource: bonus },
          })
        }
      }
    },
  },
  {
    id: 'wood-worker-a164',
    name: 'Wood Worker',
    deck: 'occupationA',
    number: 164,
    type: 'occupation',
    players: '4+',
    text: 'Each time you take wood from an accumulation space, you can exchange 1 wood for 1 sheep. Place the wood on the accumulation space.',
    onAction(game, player, actionId) {
      const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
      if (woodActions.includes(actionId) && player.wood >= 1) {
        game.actions.offerWoodForSheepExchange(player, this, actionId)
      }
    },
  },
  {
    id: 'pig-breeder-a165',
    name: 'Pig Breeder',
    deck: 'occupationA',
    number: 165,
    type: 'occupation',
    players: '4+',
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
  {
    id: 'haydryer-a166',
    name: 'Haydryer',
    deck: 'occupationA',
    number: 166,
    type: 'occupation',
    players: '4+',
    text: 'Immediately before each harvest, you can buy 1 cattle for 4 food minus 1 food for each pasture you have. (The minimum cost is 0).',
    onBeforeHarvest(game, player) {
      const pastures = player.getPastureCount()
      const cost = Math.max(0, 4 - pastures)
      if (player.food >= cost && player.canPlaceAnimals('cattle', 1)) {
        game.actions.offerBuyCattle(player, this, cost)
      }
    },
  },
  {
    id: 'breeder-buyer-a167',
    name: 'Breeder Buyer',
    deck: 'occupationA',
    number: 167,
    type: 'occupation',
    players: '4+',
    text: 'Each time you build at least 1 wood/clay/stone room and at least 1 stable on the same turn, you also get 1 sheep/wild boar/cattle.',
    onBuildRoomAndStable(game, player, roomType) {
      const animalMap = { wood: 'sheep', clay: 'boar', stone: 'cattle' }
      const animal = animalMap[roomType]
      if (animal && player.canPlaceAnimals(animal, 1)) {
        player.addAnimals(animal, 1)
        game.log.add({
          template: '{player} gets 1 {animal} from Breeder Buyer',
          args: { player, animal },
        })
      }
    },
  },
  {
    id: 'animal-teacher-a168',
    name: 'Animal Teacher',
    deck: 'occupationA',
    number: 168,
    type: 'occupation',
    players: '4+',
    text: 'Immediately after each time you use a "Lessons" action space, you can also buy 1 sheep/wild boar/cattle for 0/1/2 food.',
    onAction(game, player, actionId) {
      if (actionId === 'lessons-1' || actionId === 'lessons-2') {
        game.actions.offerBuyAnimalTeacher(player, this)
      }
    },
  },
]

// Card lookup functions
function getCardById(id) {
  return occupations.find(c => c.id === id)
}

function getCardByName(name) {
  return occupations.find(c => c.name === name)
}

function getMinorImprovements() {
  return []
}

function getOccupations() {
  return occupations
}

function getAllCards() {
  return [...occupations]
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
  getCardById,
  getCardByName,
  getMinorImprovements,
  getOccupations,
  getAllCards,
  getCardsByPlayerCount,
}
