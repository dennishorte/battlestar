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
          @settings-updated="getLobbyInfo"
          />
      </b-col>

      <b-col cols="6">
        <LobbyPlayerList :lobby-id="id" :players="players" @users-updated="getLobbyInfo" />
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-button block variant="success" @click="startGame">Start!</b-button>
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
    async getLobbyInfo() {
      const infoRequestResult = await axios.post('/api/lobby/info', {
        id: this.id,
      })

      if (infoRequestResult.status === 'error') {
        this.error = true
        this.errorMessage = infoRequestResult.message
      }
      else {
        this.lobby = infoRequestResult.data.lobby

        await this.getPlayerInfo()
      }
    },

    async getPlayerInfo() {
      const playerRequestResult = await axios.post('/api/user/fetch_many', {
        userIds: this.lobby.userIds
      })

      if (playerRequestResult.status === 'error') {
        this.error = true
        this.errorMessage = playerRequestResult.message
      }
      else {
        this.players = playerRequestResult.data.users
      }
    },

    async startGame() {
      console.log('start game')
    },

    async updateName({ to }) {
      const data = {
        lobbyId: this.lobby._id,
        name: to,
      }
      await axios.post('/api/lobby/name_update', data)
      await this.getLobbyInfo()
    },
  },

  async beforeRouteUpdate(to, from, next) {
    this.id = to.params.id
    await this.getLobbyInfo()
    next()
  },

  async mounted() {
    await this.getLobbyInfo()
  },
}
</script>
