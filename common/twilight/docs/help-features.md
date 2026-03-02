# Help Features for New Players

Ideas for making Twilight Imperium more accessible and helping players learn.

## In-Context Rules Reference

### 1. Rules Lookup Panel [DONE]
Searchable Rules Reference modal with 102 rule entries, 69 FAQ, and 11 errata. Tabs for Rules/FAQ/Errata, accordion expand/collapse, related topic links. "Rules" button in toolbar. Data module at `res/livingRules.js`.

### 2. Context-Sensitive Rules [DONE]
"?" button on PhaseInfo opens Rules Reference pre-filtered to current phase/step (Strategy Phase, Action Phase, Tactical Action, Movement, Space Combat, Invasion, Production, Status Phase, Agenda Phase).

### 3. Glossary Tooltips
Terms like "AFB", "PDS", "SCD", "sustain damage", "production capacity" get hover-tooltips explaining the mechanic anywhere they appear in the UI and game log.

## Decision Helpers

### 4. "Why Can't I...?" Explanations
When an action or option is unavailable, explain *why*. Examples:
- "You can't produce here because this system is blockaded"
- "You need 1 more blue prerequisite for this tech"
- "You don't have enough resources to build this unit"
- "This system already has your command token"

### 5. Tech Tree Visualizer
Show the full tech tree with your progress highlighted, what you can research next, and what each tech leads to. Could be a standalone panel or an enhanced version of the ResearchTech UI.

### 6. Objective Tracker / Advisor
Show which public objectives you're close to scoring, what you still need, and flag objectives that are impossible for you. For example: "Control 6 planets — you have 4, need 2 more."

### 7. Combat Odds Preview
Before committing to combat, show rough odds based on unit counts and combat values, accounting for faction modifiers, tech upgrades, and action cards (where known).

## Faction-Specific Help

### 8. Faction Quick-Reference Card
A persistent, collapsible panel showing your faction's abilities, unique units, leaders, faction techs, and promissory note — all in one glance without clicking through multiple modals.

### 9. Faction Ability Reminders
Contextual prompts at the moment they're relevant:
- "Remember: as Naalu, you always act first in initiative order"
- "Your mech ability triggers when this planet is invaded"
- "Your commander lets you reroll dice in this combat"

### 10. Opponent Faction Lookup
Quick way to pull up another player's faction sheet — what their abilities do, what their promissory note offers, what their unique units are. Helps new players understand what opponents are capable of.

## New Player Guidance

### 11. First-Turn Walkthrough
Optional guided overlay for the first round explaining each phase as it happens:
- "This is the Strategy Phase. You'll pick one of these cards..."
- "This is a Tactical Action. You'll activate a system, move ships, then produce..."

### 12. Action Type Explainers [DONE]
Action choice selector has subtitles on each option and help text explaining the requirement to use strategy card before passing. Pass clarified as irreversible. Strategy phase shows memo explaining 2-card snake draft in 3-4 player games.

### 13. Terminology Glossary
Persistent reference for TI4 jargon: "exhausted", "ready", "command tokens", "influence vs resources", "capacity", "fleet limit", etc.

## Visual / UX Improvements as Help

### 14. Planet Highlight on Objective Hover
Hovering over an objective like "Control 6 planets" highlights the relevant planets you control on the map.

### 15. Movement Range Preview
When activating a system, dim/highlight which systems your ships can actually reach based on move values, wormholes, and gravity rifts.

### 16. Production Capacity Calculator
During production, clearly show remaining capacity, cost running total, and supply limits in real-time.

### 17. Scoring Breakdown
A "score audit" view showing where each VP came from: "2 VP from Diversify Research, 1 VP from Custodians Token, 1 VP from Imperial..."

## Log and History Help

### 18. Annotated Game Log
Key log entries get expandable "what happened here" explanations. For example, clicking "Dennis scored Imperial Point" explains what the Imperial strategy card does.

### 19. Round Summary
End-of-round recap: who scored, who passed first, what objectives were revealed, major board state changes.

## Reference Tools

### 20. Strategy Card Reference
Always-visible summary of all 8 strategy cards' primary and secondary abilities — not just the one you picked. Helps new players understand what secondaries they can take.

### 21. Unit Stat Reference [DONE]
ShipOverviewModal shows all unit types with stats, generic upgrades, faction variants, and flagship/mech for in-game factions. "Units" button in toolbar.

### 22. Agenda Voting Guide
During agenda phase, explain what each outcome means in practical terms and flag which outcome benefits or hurts you.

## Priority Assessment

**Completed:** #1, #2, #12, #21.

**Highest impact remaining:** "Why can't I" explanations (#4), tech tree (#5), faction reference (#8), first-turn walkthrough (#11).

**Lowest effort / highest payoff remaining:** Glossary tooltips (#3), "why can't I" explanations (#4, engine already knows the reasons).
