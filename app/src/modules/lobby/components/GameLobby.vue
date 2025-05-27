<template>
  <div class='lobby'>
    <GameHeader />

    <div class="container">
      <div class="row">
        <div class="col">
          <h2>
            <EditableContent v-bind="titleEditor" />
          </h2>
        </div>
      </div>


      <div class="row">
        <div class="col" cols="6">
          <LobbySettings
            :lobby-id="id"
            :gameIn="lobby.game"
            :options="lobby.options"
          />
        </div>

        <div class="col" cols="6">
          <LobbyPlayerList :lobby-id="id" />
        </div>
      </div>

      <div class="row">
        <div class="col d-grid">
          <button class="btn btn-success" @click="startGame" :disabled="!lobby.valid">Start!</button>
        </div>
      </div>

    </div>

  </div>
</template>


<script setup>
import { ref, computed, provide, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'

import { useEditableContent } from '@/composables/useEditableContent.js'
import { useHttp } from '@/util/axiosWrapper.js'

import EditableContent from '@/components/EditableContent.vue'
import GameHeader from '@/components/GameHeader.vue'
import LobbyPlayerList from './PlayerList.vue'
import LobbySettings from './LobbySettings.vue'

const http = useHttp()
const route = useRoute()
const router = useRouter()

// Reactive data
const id = ref(route.params.id)
const lobby = ref({})
const errorMessage = ref('')

// EditableContent
const titleEditor = useEditableContent('lobby name', {
  allowEmpty: false,
  onUpdate: async (value) => {
    lobby.value.name = value
    await save()
  },
})

// Methods
const getLobbyInfo = async () => {
  const { lobby: lobbyData } = await http.post('/api/lobby/info', { lobbyId: id.value })
  lobby.value = lobbyData
  titleEditor.setValue(lobbyData.name)
}

const save = async () => {
  await http.post('/api/lobby/save', lobby.value)
}

const startGame = async () => {
  await save()
  if (errorMessage.value) {
    return
  }
  const { gameId } = await http.post('/api/game/create', {
    lobbyId: lobby.value._id,
  })
  router.push('/game/' + gameId)
}

// Provide values to child components
provide('lobby', computed(() => lobby.value))
provide('save', save)

// Route guard equivalent
onBeforeRouteUpdate(async (to, from, next) => {
  // This ensures that if a new lobby is loaded without navigating from another
  // view that the lobby data is updated.
  id.value = to.params.id
  await getLobbyInfo()
  next()
})

// Lifecycle
onMounted(async () => {
  await getLobbyInfo()
})
</script>
