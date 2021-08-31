<template>
<div class='lobby'>
  <Header />

  <b-container>
    <b-row>
      <b-col>
        <h2>
          <EditableText @text-edited="updateName">{{ this.lobby.name }}</EditableText>
        </h2>
      </b-col>
    </b-row>


    <b-row>
      <b-col cols="6">
        <LobbySettings
          :lobby-id="id"
          :gameIn="lobby.game"
          :optionsIn="lobby.options"
          @settings-save="settingsSave"
          @settings-updated="settingsUpdated"
        />
      </b-col>

      <b-col cols="6">
        <LobbyPlayerList :lobby-id="id" :players="players" @users-updated="getLobbyInfo" />
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-button v-if="lobby.gameLaunched" block variant="primary" @click="goToGame">Go to Game</b-button>
        <b-button v-else block variant="success" @click="startGame">Start!</b-button>
      </b-col>
    </b-row>
  </b-container>

</div>
</template>

<script>
import axios from 'axios'

import EditableText from '../../../../src/components/EditableText'
import Header from '../../../../src/components/Header'
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
      error: false,
      errorMessage: '',
      lobby: {},
      players: [],
    }
  },
  methods: {
    processRequestResult(res) {
      if (res.data.status === 'error') {
        this.error = true
        this.errorMessage = res.data.message
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
        await this.getPlayerInfo()
      }
    },

    async getPlayerInfo() {
      const requestResult = await axios.post('/api/user/fetch_many', {
        userIds: this.lobby.userIds
      })

      const data = this.processRequestResult(requestResult)
      if (data) {
        this.players = data.users
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
      if (data.status === 'success') {
        this.$bvToast.toast('Settings saved', {
          autoHideDelay: 2000,
          noCloseButton: true,
          solid: true,
          variant: 'success',
        })
      }
      return data.status === 'success'
    },

    async settingsUpdated({ game, options }) {
      this.lobby.game = game
      this.lobby.options = options
    },

    async startGame() {
      const savedSuccessfully = await this.settingsSave()
      if (!savedSuccessfully) return

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
