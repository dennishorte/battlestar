/**
 * Consolidated interface definitions for the game framework.
 *
 * This file provides a single source of truth for all interface types,
 * avoiding the fragmentation that occurs when each file declares its own
 * local interfaces. All base classes should import from this file using
 * `import type` to avoid circular dependencies.
 *
 * Design principles:
 * 1. Interfaces are structural (duck-typed) - they describe shape, not implementation
 * 2. Use `import type` when importing these interfaces to avoid runtime circular deps
 * 3. Generic parameters flow from IGame -> ICard/IZone/IPlayer -> Managers
 */

// ============================================================================
// Zone Kind Constants
// ============================================================================

const ZONE_KIND = {
  public: 'public',
  private: 'private',
  hidden: 'hidden'
} as const

type ZoneKind = typeof ZONE_KIND[keyof typeof ZONE_KIND]

// ============================================================================
// Core Entity Interfaces
// ============================================================================

/**
 * Base interface for all card types.
 * Cards are the fundamental game objects that move between zones.
 * This is a minimal interface - only includes what's needed for cross-file type checking.
 */
interface ICard {
  id: string | null
  zone: IZone | null

  // Core methods used across files
  setHome(zone: IZone): void
  setZone(zone: IZone): void
  hide(): void
  reveal(): void
  revealed(): boolean
  show(player: IPlayer): void
  visible(player: IPlayer): boolean
}

/**
 * Base interface for all zone types.
 * Zones are containers that hold cards.
 * This is a minimal interface - only includes what's needed for cross-file type checking.
 */
interface IZone {
  id: string

  // Core methods used across files
  cardlist(): unknown[]
  nextIndex(): number
  push(card: unknown, index: number): void
}

/**
 * Base interface for all player types.
 * Players represent participants in the game.
 * This is a minimal interface - only includes what's needed for cross-file type checking.
 */
interface IPlayer {
  name: string
  id?: string
  team?: string
  eliminated?: boolean
}

// ============================================================================
// Manager Interfaces
// ============================================================================

/**
 * Interface for the log manager.
 * Minimal interface for cross-file type checking.
 */
interface ILogManager {
  add(entry: { template: string; args?: Record<string, unknown>; classes?: string[] }): void
  addDoNothing(player: IPlayer): void
  addNoEffect(): void
  indent(count?: number): void
  outdent(count?: number): void

  // Allow additional properties/methods
  [key: string]: unknown
}

/**
 * Interface for the action manager.
 * Minimal interface for cross-file type checking.
 */
interface IActionManager {
  choose(player: IPlayer, choices: unknown[], opts?: IChooseOptions): unknown[]
  chooseCard(player: IPlayer, choices: unknown[], opts?: IChooseOptions): ICard | undefined
  chooseCards(player: IPlayer, choices: unknown[], opts?: IChooseOptions): ICard[]
  choosePlayer(player: IPlayer, choices: IPlayer[], opts?: IChooseOptions): IPlayer | undefined
  chooseYesNo(player: IPlayer, title: string): boolean

  // Allow additional properties/methods
  [key: string]: unknown
}

/**
 * Interface for the card manager.
 * Minimal interface for cross-file type checking.
 */
interface ICardManager {
  all(): ICard[]
  byId(id: string): ICard
  byPlayer(player: IPlayer, zoneName: string): ICard[]
  byZone(zoneId: string): ICard[]

  // Allow additional properties/methods
  [key: string]: unknown
}

/**
 * Interface for the zone manager.
 * Minimal interface for cross-file type checking.
 */
interface IZoneManager {
  all(): IZone[]
  byId(id: string): IZone
  byPlayer(player: IPlayer, zoneName: string): IZone

  // Allow additional properties/methods
  [key: string]: unknown
}

/**
 * Interface for the player manager.
 * Minimal interface for cross-file type checking.
 */
interface IPlayerManager {
  all(): IPlayer[]
  current(): IPlayer

  // Allow additional properties/methods
  [key: string]: unknown
}

// ============================================================================
// Game Interface
// ============================================================================

/**
 * Core game interface.
 * Minimal interface for cross-file type checking.
 */
interface IGame {
  // Managers
  log: ILogManager
  actions: IActionManager
  cards: ICardManager
  players: IPlayerManager
  zones: IZoneManager

  // State
  state: Record<string, unknown>
  util: Record<string, unknown>

  // Core methods
  random: () => number
  requestInputSingle: (...args: unknown[]) => unknown[]

  // Allow additional properties/methods
  [key: string]: unknown
}

// ============================================================================
// Data Interfaces (for construction/serialization)
// ============================================================================

/**
 * Data structure for initializing a card.
 */
interface CardData {
  id?: string | null
  [key: string]: unknown
}

/**
 * Data structure for initializing a player.
 */
interface PlayerData {
  _id: string
  name: string
  team?: string
  [key: string]: unknown
}

/**
 * Options for choose operations.
 */
interface IChooseOptions {
  title?: string
  min?: number
  max?: number
  count?: number
  guard?: (cards: ICard[]) => boolean
  [key: string]: unknown
}

/**
 * Result from beforeMoveTo hook.
 */
interface BeforeMoveResult {
  preventDefault?: boolean
  [key: string]: unknown
}

/**
 * Log message structure.
 */
interface LogMessage {
  template: string
  args?: Record<string, unknown>
  classes?: string[]
}

// ============================================================================
// Exports
// ============================================================================

export {
  // Constants
  ZONE_KIND,

  // Core entity interfaces
  ICard,
  IZone,
  IPlayer,

  // Manager interfaces
  ILogManager,
  IActionManager,
  ICardManager,
  IZoneManager,
  IPlayerManager,

  // Game interface
  IGame,

  // Data interfaces
  CardData,
  PlayerData,
  IChooseOptions,
  BeforeMoveResult,
  LogMessage,

  // Types
  ZoneKind,
}
