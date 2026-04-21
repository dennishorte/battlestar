'use strict'

const livingRules = [
  {
    "id": "01_setup",
    "number": 1,
    "title": "Setup",
    "content": "Setup for 2-4 players proceeds through the following steps:\n\n1. **Step A -- Place Game Board:** Place the game board in the play area (standard side face up), then place the following components on it:\n   - Place the Shield Wall token in the marked area below the Spice Refinery board space.\n   - Place the four Alliance tokens on the marked areas of the Faction Influence tracks (Emperor, Spacing Guild, Bene Gesserit, and Fremen).\n\n2. **Step B -- Create Conflict Deck:**\n   1. Separate the Conflict cards by their backs: Conflict I, Conflict II, and Conflict III.\n   2. Shuffle the four Conflict III cards and place all of them face down in the marked area of the game board.\n   3. Shuffle the nine Conflict II cards, then deal five face down on top of the Conflict III cards.\n   4. Shuffle the three Conflict I cards, then deal one face down on top of the Conflict II cards.\n   5. The resulting 10-card Conflict Deck has one Conflict I on top, five Conflict II below it, then four Conflict III on the bottom. Return unused Conflict cards to the game box without looking at them.\n\n3. **Step C -- Prepare Card Decks:** Place the following along the edge of the game board (omit cards marked with the CHOAM icon if not using the CHOAM module):\n   - Shuffle the Intrigue Deck and place it face down.\n   - Shuffle the Imperium Deck and place it face down. Deal five cards face up from it to form the Imperium Row.\n   - Next to the Imperium Row, place the Reserve cards in two stacks: one for Prepare the Way and one for The Spice Must Flow.\n\n4. **Step D -- Choose Leaders:** Each player takes a Leader and places it in front of them (choose or select at random). Do not use Shaddam Corrino IV unless using the CHOAM module. Leaders with more complexity icons after their names are more strategically complex.\n\n5. **Step E -- Starting Decks:** Each player takes a 10-card starting deck, shuffles it, and places it face down in their supply to the left of their Leader.\n\n6. **Step F -- Resources:**\n   - Each player takes 1 water and places it in their supply.\n   - Create a bank next to the game board containing Solari, spice, remaining water tokens, sandworms (wood, plastic, or both), and 4 Maker Hooks tokens. These are not meant to be limited; substitute if you run out.\n\n7. **Step G -- Player Components:** Each player chooses a color and takes all of its components:\n   - Place two Agents on your Leader. Place your third Agent (Swordmaster) next to the game board.\n   - Place one disc (Score marker) on the Score track: on the 1 space in a 4-player game, on the 0 space otherwise.\n   - Place your Combat marker (standard side face up) on the 0 space of the Combat track.\n   - Place four cubes, one each, on the bottom spaces of the four Faction Influence tracks.\n   - Place three cubes (troops) in one of the four circular garrisons on the game board (each player taking the one closest to them).\n   - Place remaining components (including 3 Spies, 3 Control markers, and remaining cubes) in your supply, in clear view of all players.\n\n8. **Step H -- Objective Cards:** Shuffle the Objective cards (omit any marked \"1-3P\" or \"4P\" that don't match your player count, returning them to the game box). Each player draws one Objective at random, then places it face up in their supply. The player whose Objective shows the First Player marker takes that marker.",
    "relatedTopics": ["Leaders", "Deck Building", "Agents", "Factions", "Objectives"]
  },
  {
    "id": "02_leaders",
    "number": 2,
    "title": "Leaders",
    "content": "- Each Leader has two different unique abilities.\n- The first ability (on the left) is used during play as described on the Leader.\n- The second ability (on the right) is marked by the Signet Ring icon. It is activated when you play your Signet Ring card on one of your Agent turns.\n- Leaders have from one to three complexity icons after their names. Leaders with more icons are more strategically complex. For a first game, it is recommended that each player chooses a Leader with just one icon.\n- Do not use Shaddam Corrino IV unless using the CHOAM module.\n- For the most authentic story experience, more than one leader from the same House should not be used in the same game. The game is also designed to allow nonstandard leader combinations and \"What If?\" scenarios.",
    "relatedTopics": ["Setup", "Agent Turns", "CHOAM Module"]
  },
  {
    "id": "03_deck_building",
    "number": 3,
    "title": "Deck Building",
    "content": "- You start the game with a 10-card deck containing the same cards as the other players:\n  - Convincing Argument (x2)\n  - Dagger (x2)\n  - Diplomacy (x1)\n  - Dune, the Desert Planet (x2)\n  - Reconnaissance (x1)\n  - Seek Allies (x1)\n  - Signet Ring (x1)\n- During each round, you may acquire new cards to add to your deck using Persuasion gained during your Reveal turn.\n- Whenever you acquire a new Imperium or Reserve card, it is first placed in your discard pile.\n- Any time you are unable to draw a card because your deck is empty, reshuffle your discard pile to form a new deck, then continue to draw as needed.\n- There are ways to \"trash\" cards, removing them from your deck altogether for the rest of the game. Strategically removing weaker cards increases the chances of drawing stronger cards more often.\n- The effects of each card in your deck are divided into two parts: an Agent box and a Reveal box. On any given turn, you may use the effects contained in only one of those boxes: the Agent box during an Agent turn, or the Reveal box during a Reveal turn.",
    "relatedTopics": ["Reveal Turns", "Agent Turns", "Setup"]
  },
  {
    "id": "04_agents",
    "number": 4,
    "title": "Agents",
    "content": "- You start the game with two Agents placed on your Leader. Your third Agent (the Swordmaster) is placed next to the game board and can be gained during play.\n- You send Agents to spaces on the game board to gather resources or advance your strategy.\n- Agents and cards are tightly linked: you cannot send an Agent to a board space without first playing a card that allows it. The card must have an Agent icon matching the icon in the upper left corner of the board space.\n- You must choose only one Agent icon on your card; one card cannot send multiple Agents.\n- You cannot send an Agent to a board space that already has one (though Spies can provide a way around this via Infiltrate).\n- There is no Mentat Agent in Uprising.",
    "relatedTopics": ["Agent Turns", "Board Spaces", "Spies", "Leaders"]
  },
  {
    "id": "05_board_spaces",
    "number": 5,
    "title": "Board Spaces",
    "content": "### Costs\n\n- Some board spaces require you to pay a cost to send an Agent there.\n- If you cannot pay the cost immediately (before resolving any effects of the space or the card you played), you cannot send your Agent there.\n- Arrows on cards and on the board indicate a cost (left of the arrow, or above it) that you must pay to get the effect (right of the arrow, or below it). You are never forced to pay such a cost. However, if you don't, you won't gain the effect. You may only pay the cost and gain the effect once during your turn.\n\n### Influence Requirements\n\n- Certain board spaces require a minimum Influence with a particular Faction:\n  - Imperial Privilege requires 2 or more Influence with the Emperor.\n  - Shipping requires 2 or more Influence with the Spacing Guild.\n  - Sietch Tabr requires 2 or more Influence with the Fremen.\n\n### Faction Board Spaces\n\n- When you send an Agent to a board space belonging to one of the four Factions, you gain one Influence with that Faction by advancing your cube one space on its Influence track.\n- You gain the effects of the board space as well as the effects in the Agent box of the card you played. You may carry out all these effects in any order.\n\n### Combat Spaces\n\n- Combat spaces are board spaces that feature a desert illustration and crossed swords.\n- Most appear on the planet Dune itself, but three appear with Factions: one with the Spacing Guild (Heighliner) and two with the Fremen (Desert Tactics and Fremkit).\n- When you send an Agent to a Combat space, you may deploy units to the Conflict area.",
    "relatedTopics": ["Agent Turns", "Factions", "Units and Deployment", "Critical Locations"]
  },
  {
    "id": "06_factions",
    "number": 6,
    "title": "Factions",
    "content": "- There are four Factions: Emperor, Spacing Guild, Bene Gesserit, and Fremen.\n- Your Faction cubes begin at the bottom of each Faction's Influence track.\n- When you send an Agent to a Faction's board space, gain one Influence with that Faction by advancing your cube one space on its Influence track. Other game effects can also move your cube up (and occasionally down) the track.\n\n### Victory Points at 2 Influence\n\n- When you reach 2 Influence with a Faction, you gain a Victory Point.\n- If you drop back below 2 Influence, you lose that Victory Point.\n\n### Bonus at 4 Influence\n\n- When you reach 4 Influence, you earn the bonus shown on that space of the track.\n- If you drop back below 4 Influence, you do not give back the bonus.\n- It is possible (though unusual) to earn the same bonus more than once, if you move back then advance again.\n\n### Alliance at 4 Influence\n\n- The first player to reach 4 Influence with a Faction earns an Alliance with that Faction.\n- Take the Alliance token from the track, put it in your supply, and gain the Victory Point shown on the Alliance token.\n- If you are ever passed by an opponent rising to a higher space on the track, you must give the Alliance token to that opponent. You lose that Victory Point and the opponent gains it.",
    "relatedTopics": ["Board Spaces", "Setup", "Agent Turns"]
  },
  {
    "id": "07_intrigue_cards",
    "number": 7,
    "title": "Intrigue Cards",
    "content": "- Intrigue cards represent subterfuge, backroom dealings, and surprise twists. They can provide resources like water or spice, increase your Influence with a Faction, or score Victory Points.\n- Each Intrigue card indicates when it can be played, what effect it has, and whether there are costs or conditions to playing it.\n- You receive Intrigue cards primarily from board spaces such as Secrets, Sardaukar, and Assembly Hall, as well as from other effects showing the Intrigue card icon.\n- Intrigue cards are kept face down, separate from your deck. You may look at them at any time. Reveal them to your opponents only when you play them.\n- Once an Intrigue card is played and resolved, place it face up in a discard pile next to the Intrigue Deck.\n\n### Types\n\nThere are three types of Intrigue cards:\n\n- **Plot:** You may play a Plot Intrigue card any time during one of your Agent or Reveal turns.\n- **Combat:** You may play a Combat Intrigue card only during Combat (Phase 3).\n- **Endgame:** You may play an Endgame Intrigue card only at the end of the game.",
    "relatedTopics": ["Agent Turns", "Reveal Turns", "Combat", "Recall and Endgame"]
  },
  {
    "id": "08_round_start",
    "number": 8,
    "title": "Round Start (Phase 1)",
    "content": "1. Reveal a new Conflict card from the top of the Conflict Deck. Place it face up in the space next to the Conflict Deck (on top of any Conflict cards that might remain from previous rounds).\n2. Each player draws five cards from their own deck, forming their hand for the round.",
    "relatedTopics": ["Agent Turns", "Combat", "Deck Building"]
  },
  {
    "id": "09_agent_turns",
    "number": 9,
    "title": "Agent Turns",
    "content": "Starting with the player who has the First Player marker and continuing clockwise, players take one turn at a time. On your turn, you take either an Agent turn or a Reveal turn.\n\n### Agent Turn Procedure\n\n1. Play one card from your hand face up in front of you.\n2. Use that card to send an Agent from your Leader to an unoccupied space on the game board. The board space must have an icon in its upper left corner matching one of the Agent icons on the card.\n3. You must pay any costs and meet any requirements of the board space you choose.\n4. Gain the effects of the board space as well as the effects in the Agent box of the card you played. If the board space belongs to one of the Factions, also gain one Influence with that Faction. You may carry out all these effects in any order.\n\n### Restrictions\n\n- You must choose only one Agent icon on your card; one card cannot send multiple Agents.\n- You cannot send an Agent to a board space that already has one (though Spies can provide a way around this via Infiltrate).\n- If a card does not have any Agent icons on it, you may not play it during an Agent turn. It may only be revealed during a Reveal turn.\n- You ignore the Reveal box of the card during Agent turns.\n\n### Optional Agent Turns\n\n- Agent turns are optional. You may take a Reveal turn while you still have Agents instead of taking an Agent turn.\n- Once you have taken a Reveal turn, your turns are skipped for the rest of the phase.\n- Once all players have taken a Reveal turn, Phase 2 ends.\n\n### Plot Intrigue Cards\n\n- You may play any Plot Intrigue cards you have at any point during one of your own Agent or Reveal turns.",
    "relatedTopics": ["Agents", "Board Spaces", "Reveal Turns", "Spies", "Intrigue Cards"]
  },
  {
    "id": "10_reveal_turns",
    "number": 10,
    "title": "Reveal Turns",
    "content": "When a player has no more Agents for Agent turns (or chooses not to use any Agents they have remaining), that player takes a Reveal turn. This consists of the following steps in order:\n\n### Step 1: Reveal Cards\n\n- Reveal all cards remaining in your hand, placing them face up in play in front of you.\n- Keep them separate from other cards you played previously on Agent turns.\n\n### Step 2: Resolve Reveal Effects\n\n- Gain the effects in the Reveal boxes of all the cards you just revealed (but not those of any cards you played during Agent turns earlier in the round).\n- You may resolve Reveal effects in any order you like.\n- You may use Persuasion that you have gained to acquire new cards for your deck before, between, or after your Reveal effects.\n\n### Setting Your Strength\n\n- After you Reveal Cards, but before you Clean Up, total your strength for Combat this round.\n- Each troop you have in the Conflict is worth 2 strength. Each sandworm is worth 3 strength.\n- Each sword you revealed during your Reveal turn is worth 1 strength.\n- You must have at least one unit in the Conflict to have any strength. If your last unit is ever removed, your strength becomes 0.\n- Announce your strength to opponents and move your Combat marker to the corresponding space on the Combat track. If your strength is over 20, flip the marker to the +20 side and start again from the beginning of the track.\n\n### Acquiring Cards\n\n- Persuasion gained during a round is used during your Reveal turn to acquire new cards.\n- You may acquire any of the five cards in the Imperium Row, or Prepare the Way or The Spice Must Flow from the Reserve.\n- The cost to acquire a card is shown at the top right of that card.\n- You may acquire as many cards as you like, as long as you have enough Persuasion to spend. You may pool Persuasion from multiple sources to acquire one card, and may split Persuasion from a single source to pay for different cards.\n- Persuasion is not represented by any tokens because you can never save it; any Persuasion you don't use during your Reveal turn is lost.\n- When you acquire a card, place it in your discard pile. You don't get to use it right away; it will be shuffled along with the rest of your discard pile when you run out of cards to draw.\n- The Imperium Row must always have five cards; whenever it does not, replace missing cards from the top of the Imperium Deck. After you acquire one card, you may then acquire the card that replaces it (if you have enough Persuasion).\n\n### Step 3: Clean Up\n\n- Remove all cards from in front of you (from your Agent and Reveal turns) and put them in your discard pile.",
    "relatedTopics": ["Agent Turns", "Deck Building", "Combat"]
  },
  {
    "id": "11_units_and_deployment",
    "number": 11,
    "title": "Units and Deployment",
    "content": "There are two types of units: troops and sandworms.\n\n### Troops\n\n- Whenever the cube icon appears on a card or board space, you recruit one troop. Take a troop from your supply and place it in your garrison on the game board.\n- If you run out of troops in your supply, you cannot recruit more until some return there.\n- Units in your garrison do not contribute to combat.\n\n### Deployment\n\n- You may deploy units to the Conflict area when you send an Agent to a Combat space.\n- When deploying, you may deploy any or all units recruited during your current turn (including from the board space and from the card you played), plus up to two more units from your garrison.\n- The Conflict area is divided into quadrants. Keep your deployed units in the quadrant nearest to your garrison.\n\n### Sandworms\n\n- Whenever the sandworm icon appears on a card or board space, you summon and immediately deploy a sandworm to the Conflict. A sandworm can never be placed in a garrison.\n- Two restrictions limit the summoning of sandworms:\n  - The sandworm icon is usually prefaced by a requirement to have a Maker Hooks token on your garrison (obtainable at Sietch Tabr).\n  - A sandworm cannot be summoned to a Conflict protected by the Shield Wall.\n\n### Combat Spaces\n\n- Combat spaces are board spaces that feature a desert illustration and crossed swords.\n- Most appear on the planet Dune itself; three appear with Factions: Heighliner (Spacing Guild), Desert Tactics (Fremen), and Fremkit (Fremen).",
    "relatedTopics": ["Combat", "Board Spaces", "Critical Locations", "Makers"]
  },
  {
    "id": "12_combat",
    "number": 12,
    "title": "Combat (Phase 3)",
    "content": "Combat is resolved during Phase 3. Before resolving, players have the chance to play Combat Intrigue cards.\n\n### Combat Intrigue Cards\n\n1. Starting with the player who has the First Player marker and continuing clockwise, each player with at least one unit in the Conflict may play any number of Combat Intrigue cards, or may pass.\n2. You are not required to pass just because you passed earlier in the Combat phase. Once all players involved in Combat pass consecutively, you then resolve the Combat.\n3. If a card changes the number of units a player has in the Conflict (or otherwise alters their strength), they adjust their Combat marker accordingly on the Combat track. If you have no units in the Conflict, your strength is 0.\n\n### Strength Calculation\n\n- Each troop in the Conflict is worth 2 strength.\n- Each sandworm in the Conflict is worth 3 strength.\n- Each sword revealed during the Reveal turn is worth 1 strength.\n- You must have at least one unit in the Conflict to have any strength. If your last unit is ever removed, your strength becomes 0.\n\n### Resolve Combat\n\n- Rewards from the Conflict card are given to players based on their strength as shown on the Combat track.\n- The player with the highest strength wins the Conflict and gains the first reward.\n- The player with the second highest strength gains the second reward.\n- In a 4-player game, the player with the third highest strength gains the third reward.\n- With three or fewer players, the third reward is used only in a tie for second place.\n- A player with 0 strength does not receive any reward.\n- The winner takes the Conflict card, places it in their supply face up, then checks for a battle icon match.\n\n### After Combat\n\n- Each player takes their troops from the Conflict and puts them in their supply (not their garrison).\n- Reset all Combat markers to 0 on the Combat track.\n- Return any sandworms from the Conflict to the bank.",
    "relatedTopics": ["Combat Rewards", "Intrigue Cards", "Units and Deployment", "Reveal Turns"]
  },
  {
    "id": "13_combat_rewards",
    "number": 13,
    "title": "Combat Rewards",
    "content": "### Reward Distribution\n\n- The player with the highest strength wins the Conflict and gains the first reward on the Conflict card.\n- The player with the second highest strength gains the second reward.\n- In a 4-player game, the player with the third highest strength gains the third reward. With three or fewer players, the third reward is used only in a tie for second place.\n- A player with 0 strength does not receive any reward.\n- The winner takes the Conflict card into their supply face up, then checks for a battle icon match.\n\n### Battle Icons\n\n- There are three battle icons: Crysknife, Desert Mouse, and Ornithopter.\n- When you win a Conflict and take that card into your supply, check if you have another face-up Conflict or Objective card in your supply with the same battle icon. If you do, you must flip the matching pair of cards face down and gain 1 Victory Point.\n\n### Sandworm Reward Doubling\n\n- When taking rewards, if you have one or more sandworms in the Conflict, double the rewards you take.\n- Most rewards can be doubled, but taking control of a location cannot be doubled, nor can battle icons on Conflict cards you win.\n- When a reward offers the option to pay a cost to gain something, you may pay the cost a second time to gain it a second time.\n\n### Ties\n\n**Tie for first place:**\n- Each tied player gains the second reward. No one wins the Conflict or takes the Conflict card into their supply.\n- If there are three or fewer players, no other rewards are given.\n- In a 4-player game: if three or more players tied for first, no other rewards are given. If exactly two players tied for first, the remaining players compete to gain the third reward.\n\n**Tie for second place:**\n- Each tied player gains the third reward. The winner keeps their rewards and takes the Conflict card into their supply, but no further rewards are given.\n\n**Tie for third place:**\n- Tied players receive nothing.",
    "relatedTopics": ["Combat", "Units and Deployment", "Objectives", "Critical Locations"]
  },
  {
    "id": "14_spies",
    "number": 14,
    "title": "Spies",
    "content": "### Observation Posts\n\n- Across the board are various observation posts where players may place Spies. Each observation post is connected to one or more board spaces.\n\n### Placing Spies\n\n- Whenever the Spy icon appears on a card or board space, you may place a Spy from your supply on an unoccupied observation post on the board.\n- If you have no Spies in your supply when you need to place one, you may first recall one of your Spies for no effect.\n- Some effects allowing you to place a Spy specify a particular Agent icon that must be connected to the observation post, or you cannot place the Spy.\n\n### Recalling Spies\n\n- When the Recall Spy icon appears on a card, you may return one of your Spies from an observation post to your supply. This is usually a cost to get a powerful effect.\n\n### Infiltrate\n\n- If you wish to send an Agent to a board space occupied by another player, you may recall your own Spy from a connected observation post to ignore the other player's Agent and send your Agent to that same board space.\n\n### Gather Intelligence\n\n- Whenever you send an Agent to a board space, you may recall your own Spy from a connected observation post to draw a card.\n- You must choose whether to do this immediately after placing your Agent (before receiving any effects of the board space or card you played).\n\n### Restrictions\n\n- You cannot recall the same Spy to both Infiltrate and Gather Intelligence. On certain spaces (like the Research Station), you may be able to recall one Spy to Infiltrate and another Spy to Gather Intelligence.\n\n### Spy Agent Icon\n\n- The Spy Agent icon allows you to send an Agent to a board space connected to an observation post where you currently have a Spy. You do not recall the Spy for this purpose.",
    "relatedTopics": ["Agents", "Agent Turns", "Board Spaces"]
  },
  {
    "id": "15_critical_locations",
    "number": 15,
    "title": "Critical Locations and the Shield Wall",
    "content": "### Control Markers\n\n- Some Conflict cards represent a struggle at one of three locations on Dune: Arrakeen, Spice Refinery, or Imperial Basin (based on the card's title).\n- If you win such a Conflict, your rewards include control of the board space: take a Control marker from your supply and place it on the flag below the appropriate space.\n\n### Control Bonuses\n\n- While your Control marker is on one of these spaces, you receive the bonus shown whenever any player (yourself included) sends an Agent there:\n  - Arrakeen: 1 Solari\n  - Spice Refinery: 1 Solari\n  - Imperial Basin: 1 spice\n\n### Defensive Bonus\n\n- When a Conflict card is revealed for a space that you already control, you receive a defensive bonus: you may deploy one troop from your supply to the Conflict.\n\n### Shield Wall\n\n- The three critical locations are protected from storms and sandworms by the Shield Wall, a token placed on the board during setup.\n- While the Shield Wall token remains in place, no sandworms can be summoned to a Conflict at one of these three protected locations.\n- When the Shield Wall detonation icon appears on a card or board space, you may remove the Shield Wall token from the board (returning it to the box). Once removed, sandworms may be summoned to any Conflict.",
    "relatedTopics": ["Combat Rewards", "Units and Deployment", "Setup", "Board Spaces"]
  },
  {
    "id": "16_makers",
    "number": 16,
    "title": "Makers (Phase 4)",
    "content": "- In this phase, spice accumulates on Maker board spaces.\n- Check each board space with a Maker icon: Deep Desert, Hagga Basin, and Imperial Basin.\n- If a Maker space does not have an Agent on it, place 1 spice from the bank on that space (in the spot designated for bonus spice).\n- This spice is added to any bonus spice that may already be there from previous rounds.",
    "relatedTopics": ["Board Spaces", "Recall and Endgame"]
  },
  {
    "id": "17_recall_and_endgame",
    "number": 17,
    "title": "Recall and Endgame (Phase 5)",
    "content": "### Endgame Check\n\n- If any player is at 10 or more Victory Points on the Score track, or if the Conflict Deck is empty, the Endgame is triggered.\n\n### Recall (If No One Has Won)\n\n1. Players recall their Agents, returning them to their Leaders.\n2. Pass the First Player marker clockwise to the next player.\n3. Begin a new round with Phase 1.\n\n### Endgame\n\n1. Each player may play and resolve any Endgame Intrigue cards they have.\n2. Whoever has the most Victory Points is declared the winner.\n\n### Tiebreakers\n\nIn the case of a tie, tiebreakers are applied in this order:\n\n1. Most spice\n2. Most Solari\n3. Most water\n4. Most garrisoned troops",
    "relatedTopics": ["Round Start", "Intrigue Cards", "Combat"]
  },
  {
    "id": "18_choam_module",
    "number": 18,
    "title": "CHOAM Module",
    "content": "The CHOAM Module is a mini-expansion included with Dune: Imperium -- Uprising. It is recommended to play without it at least once to familiarize yourself with the game.\n\n### Setup\n\nAdd or modify the following steps of standard setup:\n\n1. **Step A3:** Shuffle the 20 contracts face down, then flip two of them face up and place them on the marked spaces on the board beneath the Landsraad Council. Place the remaining 18 face down in the bank.\n2. **Step C1:** Shuffle the four additional Intrigue cards into your Intrigue Deck.\n3. **Step C2:** Shuffle the four additional Imperium cards into your Imperium Deck.\n4. **Step D:** A player has the option to choose Shaddam Corrino IV as their Leader (though this is not required).\n\n### Taking Contracts\n\n- When playing without the CHOAM Module, the contract icon simply grants 2 Solari (as indicated on the board).\n- When playing with the CHOAM Module, the contract icon means you take one of the two face-up contracts on the board and place it in your supply.\n- When you take one, replace it with another contract from the bank, flipped face up.\n- If all contracts have been taken by players, the icon reverts to giving you 2 Solari.\n\n### Completing Contracts\n\nA contract represents your promise to fulfill a service for the CHOAM Corporation. You receive payment only when you complete it.\n\n- **Board Space contracts:** Most contracts name a specific board space and are completed by sending an Agent to that space.\n- **Harvest contracts:** Completed by sending an Agent to a Maker board space and gaining the amount of spice shown during that turn (in total, including from sources other than the space itself).\n- **Immediate contracts:** Completed as soon as you take them.\n- **Acquire The Spice Must Flow contracts:** Completed when you next acquire that card.\n\nWhen you complete a contract:\n1. Announce that you have done so.\n2. Gain the rewards it shows.\n3. Flip it face down. Leave it in your supply, as certain cards refer to \"completed contracts.\"\n\n- If you take a contract involving the board space where you have already sent your Agent this turn, you must wait until a future turn to complete the contract. You must have had the contract at the time you sent your Agent.",
    "relatedTopics": ["Setup", "Leaders", "Board Spaces"]
  },
  {
    "id": "19_objectives",
    "number": 19,
    "title": "Objectives",
    "content": "### Objective Cards\n\n- There are 5 Objective cards. Some are marked \"1-3P\" or \"4P\" for specific player counts. Omit any that don't match your player count.\n- During setup, shuffle the applicable Objective cards. Each player draws one at random and places it face up in their supply.\n- The player whose Objective shows the First Player marker takes that marker.\n\n### Battle Icon Matching\n\n- Each Objective card has a battle icon (Crysknife, Desert Mouse, or Ornithopter).\n- Objective cards participate in the battle icon matching system: when you win a Conflict and take the Conflict card into your supply, check if you have another face-up Conflict or Objective card with the same battle icon. If you do, flip the matching pair face down and gain 1 Victory Point.\n\n### First Player Determination\n\n- The first player is determined by Objective cards during setup. The player whose Objective shows the First Player marker takes it.",
    "relatedTopics": ["Setup", "Combat Rewards", "Recall and Endgame"]
  }
]

function getAllLivingRules() {
  return livingRules
}

function searchLivingRules(query) {
  if (!query || !query.trim()) {
    return livingRules
  }
  const q = query.toLowerCase().trim()
  return livingRules.filter(rule =>
    rule.title.toLowerCase().includes(q)
    || rule.content.toLowerCase().includes(q)
  )
}

module.exports = {
  getAllLivingRules,
  searchLivingRules,
}
