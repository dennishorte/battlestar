import { provide, inject } from 'vue'

export const GAME_LOG_KEY = Symbol('gameLog')

export function useGameLogProvider(config) {
  provide(GAME_LOG_KEY, config)
}

export function useGameLog() {
  return inject(GAME_LOG_KEY, {})
}
