<template>
  <div class='lobby'>
    <Header />

    <div class="container">
      <div class="row">
        <div class="col">
          <h2>
            <EditableText @text-edited="updateName">{{ this.lobby.name }}</EditableText>
          </h2>
        </div>
      </div>


      <div class="row">
        <div class="col" cols="6">
          <LobbySettings
            :lobby-id="id"
            :gameIn="lobby.game"
            :options="lobby.options"
            @settings-updated="settingsUpdated"
          />
        </div>

        <div class="col" cols="6">
          <LobbyPlayerList :lobby-id="id" :players="players" @users-updated="getLobbyInfo" />
        </div>
      </div>

      <div class="row">
        <div class="col d-grid">
          <button class="btn btn-primary" v-if="lobby.gameLaunched" @click="goToGame">Go to Game</button>
          <button class="btn btn-success" v-else @click="startGame" :disabled="!settingsValid">Start!</button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import axios from 'axios'

import EditableText from '@/components/EditableText'
import Header from '@/components/Header'
import LobbyPlayerList from '../components/PlayerList'
import LobbySettings from '../components/Settings'

export default {
  name: 'Lobby',
  components: {
    EditableText,
    Header,
    LobbyPlayerList,
    LobbySettings,
  },

  data() {
    return {
      id: this.$route.params.id,
      lobby: {},
      players: [],
      settingsValid: false,
    }
  },

  /* computed: {
   *   ready() {
   *     if (this.lobby.game === 'Tyrants of the Underdark') {
   *       const correctNumberOfExpansions = this.lobby.options.expansions.length === 2
   *       const correctNumberOfPlayers = (
   *         this.lobby.options.map
   *         && this.lobby.options.map.includes(this.players.length)
   *       )

   *       return correctNumberOfExpansions && correctNumberOfPlayers
   *     }

   *     else {
   *       return true
   *     }
   *   },
   * }, */

  methods: {
    processRequestResult(res) {
      if (res.data.status === 'error') {
        alert(this.errorMessage)
        return null
      }
      else {
        return res.data
      }
    },

    async getLobbyInfo() {
      const requestResult = await axios.post('/api/lobby/info', {
        id: this.id,
      })

      const data = this.processRequestResult(requestResult)
      if (data) {
        this.lobby = data.lobby
        this.players = this.lobby.users
      }
    },

    async goToGame() {
      console.log('go to game')
    },

    async settingsSave() {
      const requestResult = await axios.post('/api/lobby/settings_update', {
        lobbyId: this.lobby._id,
        game: this.lobby.game,
        options: this.lobby.options,
      })

      const data = this.processRequestResult(requestResult)
      return data.status === 'success'
    },

    async settingsUpdated({ game, options, valid }) {
      this.settingsValid = valid
      this.lobby.game = game
      this.lobby.options = options
      await this.settingsSave()
    },

    async startGame() {
      const savedSuccessfully = await this.settingsSave()
      if (!savedSuccessfully) {
        alert('Error saving game')
        return
      }

      const requestResult = await axios.post('/api/game/create', {
        lobbyId: this.lobby._id,
      })
      const data = this.processRequestResult(requestResult)
      if (data) {
        this.$router.push('/game/' + data.gameId)
      }
    },

    async updateName({ to }) {
      const requestResult = await axios.post('/api/lobby/name_update', {
        lobbyId: this.lobby._id,
        name: to,
      })

      const data = this.processRequestResult(requestResult)
      if (!data) return

      await this.getLobbyInfo()
    },
  },

  async beforeRouteUpdate(to, from, next) {
    // This ensures that if a new lobby is loaded without navigating from another
    // view that the lobby data is updated.
    this.id = to.params.id
    await this.getLobbyInfo()
    next()
  },

  async mounted() {
    await this.getLobbyInfo()
  },
}
</script>
