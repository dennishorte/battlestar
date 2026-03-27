# 1. Rules Documentation

Before writing any code, convert the game's rulebook into a structured, searchable reference. This pays off in three ways:

1. **LLM context** -- Structured rules files can be loaded as context when implementing game logic or writing tests, giving precise answers to "what should happen when X?"
2. **Dispute resolution** -- When a test fails or a player reports a bug, the rules doc is the source of truth.
3. **Test case derivation** -- Each rule naturally maps to one or more test cases. Structured rules make it easy to verify complete coverage.

---

## The Living Rules Format

The gold standard is Twilight Imperium's `living_rules/` directory: 102 files, one per concept, with an alphabetical index. Each file covers a single game concept exhaustively.

```
common/<game>/docs/living_rules/
├── index.md              Alphabetical index with links to all entries
├── 00_setup.md           Game setup procedure
├── 01_abilities.md       How abilities work
├── 02_action_cards.md    Action card rules
├── ...                   One file per concept
├── errata.md             Official errata and corrections
└── faq.md                Frequently asked questions
```

### File Structure

Each file should follow this template:

```markdown
# Concept Name

Brief definition or summary (1-2 sentences).

## Rules

The complete rules for this concept, organized by sub-topic. Use numbered
lists for sequential procedures, bullet lists for unordered rules.

## Related

- [Other Concept](other_concept.md) -- how they interact
- [Phase Name](phase_name.md) -- when this concept applies
```

### Naming Conventions

- Filename: `NN_concept_name.md` where NN is a two-digit number for sort order
- Number assignment: use the rulebook's own ordering or alphabetical order
- Use underscores, not hyphens, to match existing convention
- Keep names short but unambiguous

### The Index File

`index.md` is an alphabetical listing of all concepts with one-line descriptions and links:

```markdown
# Living Rules Index

| # | Concept | Description |
|---|---------|-------------|
| 01 | [Abilities](01_abilities.md) | How card and unit abilities work |
| 02 | [Action Cards](02_action_cards.md) | Playing and resolving action cards |
| ... | ... | ... |
```

---

## How to Break Down a Rulebook

1. **Read the full rulebook once** without taking notes. Get the big picture.
2. **Identify atomic concepts.** Each concept that could be independently referenced gets its own file. A good heuristic: if the rulebook has a glossary, each glossary entry is a concept. If not, each bolded term or sidebar is a candidate.
3. **Group related rules.** Some concepts are tightly coupled (e.g., "movement" and "move" might be one file, not two). Merge when splitting would require constant cross-referencing.
4. **Assign numbers.** Match the rulebook's own section ordering if it has one. Otherwise, use alphabetical order.
5. **Write each file.** Transcribe the rules precisely. Use the rulebook's language where possible -- don't paraphrase in ways that might introduce ambiguity.
6. **Build the index.** Write `index.md` last, once all concept files exist.
7. **Add errata and FAQ.** These are separate files, not mixed into the main rules.

### Concept Granularity

Too fine-grained (one file per sentence) makes navigation painful. Too coarse (one file per chapter) defeats the purpose. Aim for **one file per concept that a player might look up during a game**. Examples:

| Good granularity | Too fine | Too coarse |
|-----------------|----------|------------|
| `space_combat.md` | `space_combat_hits.md`, `space_combat_retreats.md` | `combat.md` (covering space, ground, and bombardment) |
| `production.md` | `production_capacity.md`, `production_cost.md` | `actions.md` (covering all action types) |

---

## Handling Expansions

If the game has expansions with their own rulebooks, create a separate folder for each:

```
common/<game>/docs/
├── living_rules/           Base game rules
│   ├── index.md
│   ├── 00_setup.md
│   └── ...
├── expansion_a_rules/      First expansion
│   ├── index.md
│   ├── 00_new_setup.md     New/modified setup rules
│   └── ...
└── expansion_b_rules/      Second expansion
    ├── index.md
    └── ...
```

Expansion files should only cover **new or modified** rules. For concepts that are unchanged from the base game, don't duplicate -- reference the base rules file instead.

---

## Simpler Alternatives

Not every game needs 100+ rules files. For simpler games, a single well-structured rules file may suffice:

```
common/<game>/docs/
├── rules/
│   ├── <game>-rules.md     Complete rules in one file with sections
│   └── <game>-errata.md    Errata
```

This is the approach Agricola uses (see `common/agricola/docs/rules/agricola-rules.md`). Use the living_rules format when the game has enough independent concepts to warrant it; use a single file when the rules are compact enough to scan in one read.

---

## References

- **Twilight Imperium living rules**: `common/twilight/docs/living_rules/` (102 files, the reference implementation)
- **Agricola rules**: `common/agricola/docs/rules/agricola-rules.md` (single-file approach)
