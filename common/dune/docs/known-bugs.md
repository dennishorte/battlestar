# Dune Engine — Known Bugs

Tracking engine-level limitations exposed during card audits. Tests for the
affected cards are `it.skip`ped and reference this file.

## Distraction (Uprising intrigue) — no per-turn deploy tracker

The card text reads: "When you deploy 3+ units to the Conflict in a single
turn: +1 Spy. You may place this Spy on the same observation post as another
player's Spy."

The card is armed as a Plot intrigue. It needs (a) a per-turn deploy counter
that resets each turn (`game.state.turnTracking.unitsDeployedThisTurn`),
incremented from `deploy-to-conflict` and from manual deploy paths
(Detonation, Strike Fleet, etc.), (b) a consumer that checks the flag plus
the threshold to grant +1 Spy, and (c) `placeSpy` support for an
`allowSameOccupiedAsOpponent` option since the card lets you co-locate with
another player's Spy.

`distraction.js` currently sets a flag `turnTracking.distraction = true` that
nothing reads.

## Impress (Uprising intrigue) — no combat-time acquire path

Card text: "+2 Swords and Acquire a card that costs 3 Persuasion or less."

Combat resolves after Reveal/Acquire. The current implementation grants +3
persuasion at combat time, which is dead — persuasion is reset before the
next player's reveal and there is no acquire phase between combat-card play
and combat resolution.

Needs an inline acquire branch inside the combat-intrigue handler (similar
to `acquireCardsPhase` but bounded to one card with cost <= 3, not gated on
the persuasion counter). The same pattern would be useful for any future
combat-time acquire cards.

The combat-time +2 swords portion works; only the acquire is skipped in
tests.
