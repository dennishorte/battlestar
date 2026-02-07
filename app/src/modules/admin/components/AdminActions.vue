<template>
  <div class="admin-actions">
    <h3>Admin Actions</h3>

    <div v-if="status == 'success'" class="alert alert-success">{{ message }}</div>
    <div v-if="status == 'waiting'" class="alert alert-warning">{{ message }}</div>
    <div v-if="status == 'error'" class="alert alert-danger">{{ message }}</div>

    <div class="buttons">
      <BButton variant="secondary" @click="updateScryfall">Update Scryfall Data</BButton>
      <BButton variant="secondary" @click="gameLoaderVis = true">Load Game</BButton>
      <BButton variant="warning" @click="clearAllImpersonations">Clear All Impersonations</BButton>
    </div>

    <BModal v-model="gameLoaderVis" @ok="loadGame">
      <div class="game-loader-wrapper">
        <BFormTextarea v-model="gameLoaderText" rows="20" placeholder="paste in game data" />

        <BAlert :model-value="Boolean(gameLoaderAlertMessage)" variant="danger">
          {{ gameLoaderAlertMessage }}
        </BAlert>

        <div class="player-selector-section">
          <div v-for="(name, index) in gameLoaderPlayerNames" class="player-selector" :key="name">
            <div>{{ name }}</div>
            <BFormSelect v-model="gameLoaderPlayerMap[index]" :options="userNames" />
          </div>
        </div>
      </div>
    </BModal>
  </div>
</template>


<script>
import { util } from 'battlestar-common'

export default {
  name: 'AdminActions',

  props: {
    users: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      status: 'idle',
      message: '',

      gameLoaderVis: false,
      gameLoaderText: '',
      gameLoaderPlayerMap: Array(10).fill(''),
    }
  },

  computed: {
    gameLoaderAlertMessage() {
      return this.gameLoaderJson.error ? this.gameLoaderJson.error : ''
    },

    gameLoaderJson() {
      if (this.gameLoaderText.length === 0) {
        return {}
      }
      else {
        try {
          return JSON.parse(this.gameLoaderText)
        }
        catch {
          return { error: 'Unable to parse JSON' }
        }
      }
    },

    gameLoaderPlayerNames() {
      if (this.gameLoaderJson.settings) {
        return this.gameLoaderJson.settings.players.map(p => p.name)
      }
      else {
        return []
      }
    },

    userNames() {
      return this.users.map(u => u.name)
    },
  },

  watch: {
    gameLoaderPlayerNames(names) {
      // Auto-map players to matching user names
      this.gameLoaderPlayerMap = names.map(playerName => {
        const matchingUser = this.users.find(u => u.name === playerName)
        return matchingUser ? matchingUser.name : ''
      })
    },
  },

  methods: {
    async updateScryfall() {
      this.status = 'waiting'
      this.message = 'Updating Scryfall data.\nThis can take a minute or two.'

      try {
        await this.$post('/api/magic/scryfall/update', {})
        this.message = 'Scryfall data updated'
        this.status = 'success'
      }
      catch (e) {
        this.status = 'error'
        this.message = 'Check console for details'
        throw e
      }
    },

    async loadGame() {
      // Ensure players are selected.

      if (this.gameLoaderPlayerNames.length === 0) {
        alert('no players detected in game data')
        return
      }

      const selectedPlayers = this.gameLoaderPlayerMap.slice(0, this.gameLoaderPlayerNames.length)
      if (!selectedPlayers.includes('dennis')) {
        alert('dennis is not mapped to one of the players')
        return
      }
      if (selectedPlayers.some(x => !x)) {
        alert('not all players mapped to new player')
        return
      }
      if (util.array.distinct(selectedPlayers).length < selectedPlayers.length) {
        alert('same target player selected multiple times')
        return
      }

      // Update the game text to match the selected player mappings
      const originalPlayers = [...this.gameLoaderJson.settings.players]
      const newPlayers = selectedPlayers.map(name => {
        const _id = this.users.find(u => u.name === name)._id
        return { _id, name }
      })

      let text = this.gameLoaderText
      for (let i = 0; i < originalPlayers.length; i++) {
        const original = originalPlayers[i]
        const nameMarker = `__NAME_MARKER_${i}__`
        const idMarker = `__ID_MARKER_${i}__`

        // Replace with unique markers first
        const nameRegex = new RegExp(`\\b${original.name}\\b`, 'g')
        const idRegex = new RegExp(`\\b${original._id}\\b`, 'g')

        text = text.replace(nameRegex, nameMarker)
        text = text.replace(idRegex, idMarker)
      }

      // Now replace markers with final values
      for (let i = 0; i < originalPlayers.length; i++) {
        const nameMarker = `__NAME_MARKER_${i}__`
        const idMarker = `__ID_MARKER_${i}__`

        text = text.replace(new RegExp(nameMarker, 'g'), newPlayers[i].name)
        text = text.replace(new RegExp(idMarker, 'g'), newPlayers[i]._id)
      }


      // Insert the game into the database
      const data = JSON.parse(text)
      const { gameId } = await this.$post('/api/admin/insert_game', { data })

      // Redirect to the loaded game
      this.$router.push(`/game/${gameId}`)
    },

    async clearAllImpersonations() {
      if (confirm('Are you sure you want to clear all impersonations? This will clear impersonation state for all users.')) {
        this.status = 'waiting'
        this.message = 'Clearing all impersonations...'

        try {
          const result = await this.$post('/api/admin/clear-all-impersonations', {})
          this.message = `Cleared ${result.clearedCount} impersonation(s)`
          this.status = 'success'
        }
        catch (e) {
          this.status = 'error'
          this.message = e.response?.data?.message || 'Failed to clear impersonations. Check console for details.'
          throw e
        }
      }
    },
  },
}
</script>


<style scoped>
.buttons {
  display: flex;
  flex-direction: row;
  gap: .25em;
}

.game-loader-wrapper {
  display: flex;
  flex-direction: column;
  gap: .25em;
}

.player-selector {
  display: flex;
  flex-direction: row;
  gap: .5em;
}
</style>
