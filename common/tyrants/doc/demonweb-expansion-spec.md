# Tyrants of the Underdark: Demonweb Expansion v2.2
## Complete Specification for Implementation

**Expansion Created By: Tahsin Shamma**

This is a modular hex-based map expansion for Tyrants of the Underdark. It replaces the standard game board with a configurable set of hexagonal tiles.

---

## 1. HEX TILE OVERVIEW

All hex tiles use **pointy-top orientation** (vertex at top and bottom, flat edges on left and right sides).

### Hex Edge and Vertex Labeling Convention

For a pointy-top hex, label the 6 vertices (clockwise from top):
- **N** (top point)
- **NE** (upper-right)
- **SE** (lower-right)
- **S** (bottom point)
- **SW** (lower-left)
- **NW** (upper-left)

Label the 6 edges (clockwise from upper-right):
- **Edge-NE**: between vertex N and vertex NE
- **Edge-E**: between vertex NE and vertex SE
- **Edge-SE**: between vertex SE and vertex S
- **Edge-SW**: between vertex S and vertex SW
- **Edge-W**: between vertex SW and vertex NW
- **Edge-NW**: between vertex NW and vertex N

### Edge Connection Points

Each hex has **black dots** on its border. These are edge connection points where tunnels from adjacent hexes link together. They can appear:
- At a **vertex** (shared by up to 3 hexes)
- At a **mid-edge** position (shared by 2 hexes)

When two hexes are placed adjacent, any connection points that align on their shared edge/vertices become linked, creating a tunnel path between the hexes.

### Site Banners

Each named location (site) on a hex has a banner showing:
- **Name** of the site
- **Crossed-sword icons** (⚔): Enemy troop slots (pre-populated with white enemy pawns during setup)
- **Open circles** (○): Empty troop slots available for player troops
- **VP number**: Victory point value for controlling the site

Some sites have **dark/inverted banners** (black background with filled circles ●). These represent a distinct site type — likely indicating sites that start unoccupied or have special deployment rules. Their filled circles function as troop capacity slots.

### Tunnel Spaces

Open circles (○) along tunnel paths inside hexes (not part of a site banner) are **tunnel spaces** where troops can be placed for movement and presence purposes.

---

## 2. TILE CATEGORIES

| Category | Tiles | Role |
|----------|-------|------|
| **A hexes** | A1–A9 | Center tiles (choose 1 per game) |
| **B hexes** | B1–B6 | Border/player-start tiles |
| **C hexes** | C1–C8 | Surrounding tiles (placed around center) |
| **X hexes** | X1–X4 | Experimental tiles (replace C hexes, use at own risk) |

---

## 3. MAP CONSTRUCTION RULES

1. Place one A hex in the center of the table.
2. Surround the A hex with C hexes 1–6.
3. Place B hexes as indicated by the player-count layout (see Section 4).
4. Place C7 and C8 only for 4-player games.
5. All hexes should be reachable by at least 1 path.
6. Each hex should be rotated to maximize connections with adjacent hexes. Disputes: game owner decides first hex, then clockwise around the table.
7. Dead ends (tunnels that don't lead to another site) can be: given gems (if using gemstone rules), blocked off with tokens, or treated as nonexistent.
8. X hexes replace any C hex with the same or fewer connections.

---

## 4. PLAYER-COUNT LAYOUTS

### 4-Player Setup (largest board)
```
Layout forms a tall diamond/rhombus shape:

            [C7/8]
        [B1]      [B3/4]
      [C1-6]  [C1-6]  [C1-6]
   [B5/6] [C1-6] [A] [C1-6] [B5/6]
      [C1-6]  [C1-6]  [C1-6]
        [B3/4]      [B2]
            [C7/8]

Specifics:
- A hex in center
- 6 C hexes (C1-C6) surrounding the A hex
- B1 and B2 at opposite ends (top-left and bottom-right)
- Two B3/4 hexes on opposite corners
- Two B5/6 hexes on left and right flanks
- Two C7/8 hexes at the top and bottom tips
- Total: 1A + 6C + 2C(7/8) + 2B(1,2) + 2B(3/4) + 2B(5/6) = 15 hexes
```

### 3-Player Setup
```
Truncated layout:

        [B1]
      [C1-6]
   [C1-6] [C1-6]
  [B3] [A] [B2]
   [C1-6] [C1-6]
      [C1-6]

- A hex in center
- 6 C hexes (C1-C6) surrounding the A hex
- B1 at top, B2 at right, B3 at left
- Total: 1A + 6C + 3B = 10 hexes
```

### 2-Player Setup
```
Vertical column layout:

      [B1]
     [C1-6]
   [C1-6] [C1-6]
     [A]
   [C1-6] [C1-6]
     [C1-6]
      [B2]

- A hex in center
- 6 C hexes (C1-C6) surrounding
- B1 at top, B2 at bottom
- Total: 1A + 6C + 2B = 9 hexes
```

---

## 5. A HEXES (CENTER TILES) — Detailed Descriptions

### A1 — Araumycos / The Great Web

**Region label:** ARAUMYCOS

**Sites:**
| Site | Swords (⚔) | Open (○) | VP |
|------|-----------|---------|-----|
| The Great Web | 6 | 0 | 8 |

**Internal topology:**
- A large circular ring path around the "Araumycos" label dominates the hex interior.
- The ring has approximately 6–8 tunnel connection nodes evenly spaced around it.
- THE GREAT WEB site sits at the center of the ring, connected to it by a short path.
- From the ring, tunnel paths extend outward to edge connection points on all 6 sides of the hex.

**Edge connection points (black dots):**
- 6 vertex dots: N, NE, SE, S, SW, NW
- Additional mid-edge connection at Edge-NW (approximately)
- Total approximately 7 edge connection points

**Description:** A high-value, heavily defended central site. The ring structure creates a chokepoint — players must navigate the ring to reach The Great Web. Good for games favoring a single dominant center.

---

### A2 — Zelatar / Fogtown-Gallenghast-Darkflame Triad

**Region label:** ZELATAR (visible on lower-right of hex interior, no site banner — just a region name)

**Sites:**
| Site | Swords (⚔) | Open (○) | VP |
|------|-----------|---------|-----|
| Fogtown | 2 | 1 | 4 |
| Gallenghast | 2 | 1 | 4 |
| Darkflame | 2 | 1 | 4 |

**Special Rule (printed on hex):**
- **Troops in all 3 sites:** Gain 1 Power per turn
- **Control all 3 sites:** Gain 1 Power, 1 Trophy, 1 VP per turn
- **Total Control of all 3 sites:** Gain 2 Power, 2 Trophies, 4 VP per turn

("Troops in" = have at least 1 troop present. "Control" = have the most troops. "Total Control" = only your troops present.)

**Internal topology:**
- Three sites arranged in a triangle: Fogtown at top, Gallenghast at upper-right, Darkflame at bottom-center.
- The three sites are connected by tunnel paths forming a triangle.
- Additional tunnel paths extend from each site outward toward edge connection points.
- The special rule text box is positioned in the center-left of the hex.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points at vertices

**Description:** A troop-deployment-heavy center tile. Three medium-value sites reward players who can spread forces across all three. Good for aggressive, multi-front games.

---

### A3 — Araumycos / Web Sites Ring

**Region label:** ARAUMYCOS

**Sites:**
| Site | Swords (⚔) | Open (○) | VP |
|------|-----------|---------|-----|
| Great Web (center) | 0 | 2 | 2 |
| Web (top) | 1 | 0 | 2 |
| Web (upper-right) | 1 | 0 | 2 |
| Web (lower-right) | 1 | 0 | 2 |
| Web (lower-left) | 1 | 0 | 2 |
| Web (upper-left) | 1 | 0 | 2 |

**Internal topology:**
- A circular ring path around "Araumycos" label.
- 5 "Web" sites positioned around the ring at roughly evenly spaced intervals (top, upper-right, lower-right, lower-left, upper-left).
- 1 "Great Web" site at the center of the ring, connected to the ring path.
- Each Web site is on the ring itself.
- Tunnel paths extend from the ring outward to edge connection points.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points at vertices

**Description:** Many small sites — rewards spreading thin. Each Web site is lightly defended (1 sword each), and the center Great Web is undefended. High total VP if you capture everything.

---

### A4 — Pure Tunnel Hex (Webbed Network)

**Sites:** None

**Internal topology:**
- A dense web-like network of tunnel paths connecting 7–8 tunnel spaces (open circles).
- Paths branch and intersect, creating multiple routes through the hex.
- The layout resembles an organic, asymmetric network with nodes of varying connectivity.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Additional mid-edge connections on Edge-NE and possibly Edge-E
- Total approximately 6–8 edge connection points

**Description:** A pure routing tile with no sites. All paths through this hex are undefended tunnels. Provides maximum connectivity between surrounding hexes.

---

### A5 — Pure Tunnel Hex (Branching)

**Sites:** None

**Internal topology:**
- A branching tunnel network with approximately 6–7 tunnel spaces (open circles).
- Paths form a rough tree structure with some loops.
- Slightly less connected than A4.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points at vertices

**Description:** Another pure routing tile. Fewer internal paths than A4, creating slightly more constrained movement.

---

### A6 — Pure Tunnel Hex (Sparse Network)

**Sites:** None

**Internal topology:**
- A tunnel network with approximately 7–8 tunnel spaces.
- Paths form an irregular web with multiple branch points.
- Some paths are longer (more spaces between intersections) than A4/A5.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Additional mid-edge connection(s)
- Total approximately 7 edge connection points

**Description:** Routing tile with a slightly sparser network. Longer paths between connection points create more strategic distance.

---

### A7 — Hub/Star Hex (Blocking)

**Sites:** None

**Internal topology:**
- A single central tunnel space (open circle) at the hub.
- 5–6 tunnel paths radiate outward from the center hub to edge connection points, forming a star/spoke pattern.
- No ring or network — just straight paths from center to edges.
- This creates a chokepoint: all routes through the hex pass through the central node.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points at vertices

**Description:** A blocking tile. The single central chokepoint means one troop at the center can observe or threaten all routes. Good for defensive/positional play.

---

### A8 — Pure Tunnel Hex (Moderate Network)

**Sites:** None

**Internal topology:**
- A tunnel network with approximately 6–7 tunnel spaces.
- Layout similar to A6 but with different branching pattern.
- Some paths loop, others dead-end near edges.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Additional mid-edge connection(s) possible
- Total approximately 6–7 edge connection points

**Description:** Another routing tile variant with moderate connectivity.

---

### A9 — Wells of Darkness

**Sites:**
| Site | Swords (⚔) | Open (○) | VP |
|------|-----------|---------|-----|
| Wells of Darkness | 0 | 9 | 9 |

(The 9 open circles are arranged in a 3×3 grid on the site banner.)

**Internal topology:**
- The Wells of Darkness site sits at the center of the hex.
- 5–6 tunnel paths radiate outward from the site to edge connection points, similar to A7's spoke pattern.
- No ring structure — direct paths from center to edges.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points

**Description:** A massive, undefended site worth 9 VP with room for 9 troops. The highest single-site VP value in the expansion. Zero enemy troops means it's easy to take but hard to hold with its enormous capacity.

---

## 6. B HEXES (BORDER/START TILES) — Detailed Descriptions

B hexes serve as the outer boundary of the map. In 2-player games, B1 and B2 are at opposite ends. In 3-player games, B1, B2, and B3 are used. In 4-player games, B1–B6 are used (with some hexes potentially shared/doubled per the layout diagram positions labeled "B3/4" and "B5/6").

### B1 — Menzoberranzan / Council Chamber

**Region label:** MENZOBERRANZAN

**Sites:**
| Site | Swords (⚔) | Open (○) | VP |
|------|-----------|---------|-----|
| Council Chamber | 2 | 1 | 4 |

**Internal topology:**
- A circular ring path around "Menzoberranzan" label.
- The Council Chamber site is at the bottom-center of the ring.
- Several tunnel spaces (open circles) on the ring, approximately 4–5.
- Tunnel paths from the ring extend to edge connection points.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points

---

### B2 — Tsenviilyq / Vrith & Lolth Shrine

**Region label:** TSENVIILYQ

**Sites:**
| Site | Swords (⚔) | Open (○) | VP |
|------|-----------|---------|-----|
| Vrith | 1 | 0 | 2 |
| Lolth Shrine | 2 | 2 | 3 |

**Internal topology:**
- A circular ring path around "Tsenviilyq" label.
- Vrith is at the top of the ring.
- Lolth Shrine is at the bottom of the ring.
- Several tunnel spaces on the ring, approximately 3–4.
- Tunnel paths extend from the ring outward to edge connections.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points

---

### B3 — Gauntlgrym / Xith Idrana

**Region label:** GAUNTLGRYM

**Sites:**
| Site | Swords (⚔) | Open (○) | VP |
|------|-----------|---------|-----|
| Xith Idrana | 2 | 1 | 2 |

**Internal topology:**
- A circular ring path around "Gauntlgrym" label.
- Xith Idrana at the bottom-center of the ring.
- Several tunnel spaces on the ring, approximately 3–4.
- Tunnel paths extend outward to edge connections.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points

---

### B4 — Ch'Chitl / Faerholme

**Region label:** CH'CHITL

**Sites:**
| Site | Swords (⚔) | Open (○) | VP |
|------|-----------|---------|-----|
| Faerholme | 2 | 1 | 2 |

**Internal topology:**
- A circular ring path around "Ch'Chitl" label.
- Faerholme at the bottom-center.
- Several tunnel spaces on the ring, approximately 2–3.
- Tunnel paths extend outward.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points

---

### B5 — Ss'Zuraass'Nee / Darklight Realm

**Region label:** SS'ZURAASS'NEE

**Sites:**
| Site | Swords (⚔) | Open (○) | VP |
|------|-----------|---------|-----|
| Darklight Realm | 2 | 1 | 2 |

**Internal topology:**
- A circular ring path around "Ss'Zuraass'Nee" label.
- Darklight Realm at the bottom-center.
- Several tunnel spaces on the ring, approximately 3–4.
- Tunnel paths extend outward.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points

---

### B6 — The Phaerlin / Shedaklah

**Region label:** THE PHAERLIN

**Sites:**
| Site | Swords (⚔) | Open (○) | VP |
|------|-----------|---------|-----|
| Shedaklah | 2 | 1 | 2 |

**Internal topology:**
- A circular ring path around "The Phaerlin" label.
- Shedaklah at the bottom-center.
- Several tunnel spaces on the ring, approximately 3–4.
- Tunnel paths extend outward.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points

---

## 7. C HEXES (SURROUNDING TILES) — Detailed Descriptions

### C1 — The Twilight, Spiral Desert, Magma Gate

**Sites:**
| Site | Type | Swords (⚔) | Open (○) | Filled (●) | VP |
|------|------|-----------|---------|-----------|-----|
| The Twilight | Light banner | 0 | 3 | 0 | 3 |
| Spiral Desert | Light banner | 0 | 3 | 0 | 3 |
| Magma Gate | **Dark banner** | 0 | 0 | 2 | 2 |

**Internal topology:**
- The Twilight is in the upper portion of the hex.
- Magma Gate is in the upper-right area.
- Spiral Desert is in the left-center area.
- Tunnel paths connect the three sites with 2–3 intermediate tunnel spaces.
- A tunnel path from the lower portion of the hex extends to edge connections at the bottom.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points

---

### C2 — Araumycos & Menzoberranzan

**Sites:**
| Site | Type | Swords (⚔) | Open (○) | Filled (●) | VP |
|------|------|-----------|---------|-----------|-----|
| Araumycos | Light banner | 2 | 2 | 0 | 3 |
| Menzoberranzan | **Dark banner** | 2 | 0 | 4 | 5 |

**Internal topology:**
- Araumycos at the upper-right.
- Menzoberranzan at the lower-right (large site).
- A single tunnel space connecting them, positioned center-left.
- Tunnel paths extend from each site and the connecting space to edge connection points.
- The hex has a relatively open layout with few internal tunnel spaces.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Additional mid-edge connections possible on some edges
- Total approximately 6–7 edge connection points

---

### C3 — Red Forest, Xal Veldrin, Iron Wastes

**Sites:**
| Site | Type | Swords (⚔) | Open (○) | Filled (●) | VP |
|------|------|-----------|---------|-----------|-----|
| Red Forest | Light banner | 1 | 2 | 0 | 4 |
| Xal Veldrin | **Dark banner** | 0 | 0 | 4 | 3 |
| Iron Wastes | Light banner | 1 | 2 | 0 | 3 |

**Internal topology:**
- Red Forest at the top.
- Xal Veldrin in the center.
- Iron Wastes at the bottom.
- Sites are arranged vertically, connected by short tunnel paths.
- A tunnel space between Red Forest and Xal Veldrin connects to the right edge.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points

---

### C4 — Kulggen, Red Gate, Iblith, Caer Sidi

**Sites:**
| Site | Type | Swords (⚔) | Open (○) | Filled (●) | VP |
|------|------|-----------|---------|-----------|-----|
| Kulggen | Light banner | 2 | 0 | 0 | 4 |
| Red Gate | Light banner | 2 | 0 | 0 | 4 |
| Iblith | Light banner | 0 | 1 | 0 | 1 |
| Caer Sidi | **Dark banner** | 0 | 0 | 3 | 3 |

**Internal topology:**
- Kulggen at the upper-right.
- Red Gate at the upper-left.
- Iblith in the center.
- Caer Sidi at the bottom.
- Red Gate connects to Iblith. Iblith connects to Kulggen. Caer Sidi connects downward.
- Several tunnel spaces between sites, with paths extending to edges.
- Some tunnel paths loop around the lower portion of the hex.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Additional connections possible on some edges
- Total approximately 6–8 edge connection points

---

### C5 — Erelhei-Cinlu & Ath-Qua

**Sites:**
| Site | Type | Swords (⚔) | Open (○) | Filled (●) | VP |
|------|------|-----------|---------|-----------|-----|
| Erelhei-Cinlu | Light banner | 2 | 4 | 0 | 4 |
| Ath-Qua | **Dark banner** | 0 | 0 | 4 | 3 |

**Internal topology:**
- Erelhei-Cinlu at the upper-left (large site, 6 total slots).
- Ath-Qua at the center-right.
- A tunnel space between them near the upper-center.
- Paths extend from each site outward to edge connection points.
- Some tunnel paths in the lower portion of the hex.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points

---

### C6 — Zi'Xzolca & Black Gate

**Sites:**
| Site | Type | Swords (⚔) | Open (○) | Filled (●) | VP |
|------|------|-----------|---------|-----------|-----|
| Zi'Xzolca | **Dark banner** | 0 | 0 | 2 | 2 |
| Black Gate | Light banner | 2 | 0 | 0 | 4 |

**Internal topology:**
- Zi'Xzolca at the upper-right.
- Black Gate at the lower-left.
- Connected by tunnel paths with 2–3 intermediate tunnel spaces.
- A branching path extends from the tunnel spaces to additional edge connections.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Additional mid-edge connection on some edges
- Total approximately 6–7 edge connection points

---

### C7 — Spiderhome & Thanatos Gate

**Sites:**
| Site | Type | Swords (⚔) | Open (○) | VP |
|------|------|-----------|---------|-----|
| Spiderhome | Light banner | 2 | 4 | 5 |
| Thanatos Gate | Light banner | 2 | 4 | 5 |

**Internal topology:**
- Spiderhome at the top.
- Thanatos Gate at the bottom.
- Connected by a vertical tunnel path with 1–2 tunnel spaces between them.
- Additional tunnel paths extend to edges from each site.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Additional mid-edge connections on Edge-E and Edge-W
- Total approximately 8 edge connection points

**Note:** Only used in 4-player games.

---

### C8 — Enzithir, Xelathir, Venathir

**Sites:**
| Site | Type | Swords (⚔) | Open (○) | VP |
|------|------|-----------|---------|-----|
| Enzithir | Light banner | 1 | 1 | 3 |
| Xelathir | Light banner | 1 | 1 | 3 |
| Venathir | Light banner | 1 | 1 | 3 |

**Internal topology:**
- Enzithir at the top.
- Xelathir at the right.
- Venathir at the bottom-center.
- All three connected by tunnel paths forming a rough triangle, with a central junction tunnel space.
- Some tunnel paths extend to edges.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Additional mid-edge connections possible
- Total approximately 6–7 edge connection points

**Note:** Only used in 4-player games.

---

## 8. X HEXES (EXPERIMENTAL) — Detailed Descriptions

These replace any C hex with the same or fewer edge connections. May cause balance issues.

### X1 — The Barrens, Heaving Hills, Rotting Plain

**Sites:**
| Site | Type | Swords (⚔) | Open (○) | VP |
|------|------|-----------|---------|-----|
| The Barrens | Light banner | 0 | 5 | 3 |
| Heaving Hills | Light banner | 2 | 1 | 3 |
| Rotting Plain | Light banner | 2 | 1 | 3 |

**Internal topology:**
- The Barrens at the top (large site with 5 open slots).
- Heaving Hills at the right.
- Rotting Plain at the left.
- Connected in a triangle with tunnel paths.
- One additional tunnel space along the bottom connecting the lower path to the bottom edge.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points

---

### X2 — Indifference

**Sites:**
| Site | Type | Swords (⚔) | Open (○) | VP |
|------|------|-----------|---------|-----|
| Indifference | Light banner | 0 | 6 | 4 |

**Internal topology:**
- Single site (Indifference) positioned center-right.
- Very sparse internal paths — only 2–3 tunnel paths extending from the site to edge connections.
- Large open areas of the hex are unused (no tunnel spaces).

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points (but fewer internal paths reach them)

**Note:** The sparse connectivity may isolate parts of the map — this is likely the "game-breaking" element warned about.

---

### X3 — Pure Tunnel Hex (Sparse, Dark)

**Sites:** None

**Internal topology:**
- A sparse network of tunnel paths with only 1–2 tunnel spaces.
- Paths meander through the hex creating indirect routes.
- Fewer connection paths than A-series pure tunnel hexes.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points

---

### X4 — Fountain of Screams

**Sites:**
| Site | Type | Swords (⚔) | Open (○) | VP |
|------|------|-----------|---------|-----|
| Fountain of Screams | Light banner | 0 | 4 | 5 |

**Internal topology:**
- Fountain of Screams positioned in the upper-center of the hex.
- 2 tunnel spaces below and to the sides of the site.
- Tunnel paths extend to edge connections.
- Relatively sparse connectivity.

**Edge connection points:**
- N vertex, NE vertex, SE vertex, S vertex, SW vertex, NW vertex
- Total: 6 edge connection points

---

## 9. GEMSTONE RULES (OPTIONAL)

**Additional components needed:** ~20 gem-like tokens.

### Setup
- Place 1 Gem of Power in each tunnel space that is a dead end (a tunnel space connected to only one other space/site with no onward path to another hex).

### During a Player Turn

**Acquiring a Gem:**
- A **troop** (not a spy) with presence in a space containing a gem may acquire it.
- Cost: 1 Power.
- The gem moves to the player's supply.
- Limit: 1 gem acquired per player per turn.

**Spending a Gem:**
- A gem in a player's supply may be spent for either **3 Power** or **3 Influence**.
- A gem **cannot** be spent on the same turn it was acquired.

---

## 10. COMPLETE SITE REFERENCE TABLE

| Hex | Site Name | ⚔ | ○ | ● | VP | Banner Type | Notes |
|-----|-----------|---|---|---|-----|-------------|-------|
| A1 | The Great Web | 6 | 0 | 0 | 8 | Light | Single massive site |
| A2 | Fogtown | 2 | 1 | 0 | 4 | Light | Triad bonus |
| A2 | Gallenghast | 2 | 1 | 0 | 4 | Light | Triad bonus |
| A2 | Darkflame | 2 | 1 | 0 | 4 | Light | Triad bonus |
| A3 | Great Web | 0 | 2 | 0 | 2 | Light | Center of ring |
| A3 | Web ×5 | 1 | 0 | 0 | 2 | Light | On ring |
| A9 | Wells of Darkness | 0 | 9 | 0 | 9 | Light | Largest capacity |
| B1 | Council Chamber | 2 | 1 | 0 | 4 | Light | |
| B2 | Vrith | 1 | 0 | 0 | 2 | Light | |
| B2 | Lolth Shrine | 2 | 2 | 0 | 3 | Light | |
| B3 | Xith Idrana | 2 | 1 | 0 | 2 | Light | |
| B4 | Faerholme | 2 | 1 | 0 | 2 | Light | |
| B5 | Darklight Realm | 2 | 1 | 0 | 2 | Light | |
| B6 | Shedaklah | 2 | 1 | 0 | 2 | Light | |
| C1 | The Twilight | 0 | 3 | 0 | 3 | Light | |
| C1 | Spiral Desert | 0 | 3 | 0 | 3 | Light | |
| C1 | Magma Gate | 0 | 0 | 2 | 2 | Dark | |
| C2 | Araumycos | 2 | 2 | 0 | 3 | Light | |
| C2 | Menzoberranzan | 2 | 0 | 4 | 5 | Dark | |
| C3 | Red Forest | 1 | 2 | 0 | 4 | Light | |
| C3 | Xal Veldrin | 0 | 0 | 4 | 3 | Dark | |
| C3 | Iron Wastes | 1 | 2 | 0 | 3 | Light | |
| C4 | Kulggen | 2 | 0 | 0 | 4 | Light | |
| C4 | Red Gate | 2 | 0 | 0 | 4 | Light | |
| C4 | Iblith | 0 | 1 | 0 | 1 | Light | |
| C4 | Caer Sidi | 0 | 0 | 3 | 3 | Dark | |
| C5 | Erelhei-Cinlu | 2 | 4 | 0 | 4 | Light | |
| C5 | Ath-Qua | 0 | 0 | 4 | 3 | Dark | |
| C6 | Zi'Xzolca | 0 | 0 | 2 | 2 | Dark | |
| C6 | Black Gate | 2 | 0 | 0 | 4 | Light | |
| C7 | Spiderhome | 2 | 4 | 0 | 5 | Light | 4P only |
| C7 | Thanatos Gate | 2 | 4 | 0 | 5 | Light | 4P only |
| C8 | Enzithir | 1 | 1 | 0 | 3 | Light | 4P only |
| C8 | Xelathir | 1 | 1 | 0 | 3 | Light | 4P only |
| C8 | Venathir | 1 | 1 | 0 | 3 | Light | 4P only |
| X1 | The Barrens | 0 | 5 | 0 | 3 | Light | Experimental |
| X1 | Heaving Hills | 2 | 1 | 0 | 3 | Light | Experimental |
| X1 | Rotting Plain | 2 | 1 | 0 | 3 | Light | Experimental |
| X2 | Indifference | 0 | 6 | 0 | 4 | Light | Experimental |
| X4 | Fountain of Screams | 0 | 4 | 0 | 5 | Light | Experimental |

**Hexes with no sites (pure tunnel):** A4, A5, A6, A7, A8, X3

---

## 11. IMPLEMENTATION NOTES

### Dark Banner Sites (● filled circles)
Sites with dark/inverted banners and filled circles (●) appear on: C1 (Magma Gate), C2 (Menzoberranzan), C3 (Xal Veldrin), C4 (Caer Sidi), C5 (Ath-Qua), C6 (Zi'Xzolca). The filled circles likely represent a different starting condition or troop type compared to open circles and crossed swords. An implementer should verify the intended mechanic with the expansion creator or playtest community.

### Hex Rotation
Hexes should be rotatable in 60° increments during setup. The rule is to maximize connections — when a hex is placed adjacent to another, rotate it so the most edge connection points align with connection points on neighboring hexes.

### Graph Representation Recommendation
Model each hex as a subgraph:
- **Nodes:** Sites, tunnel spaces, and edge connection points
- **Edges:** Tunnel paths between nodes
- When hexes are placed adjacent, merge matching edge connection point nodes to form the complete board graph.

### A2 Triad Bonus Implementation
The A2 bonus requires tracking per-turn state:
- Check if any player has troops in all 3 sites → award 1 Power
- Check if any player controls all 3 sites → award 1 Power, 1 Trophy, 1 VP
- Check if any player has total control of all 3 sites → award 2 Power, 2 Trophies, 4 VP
- These are mutually exclusive tiers (highest qualifying tier applies).
