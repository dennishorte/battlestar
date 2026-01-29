<template>
  <ModalBase id="debug-modal">
    <template #header>debug</template>
    <div style="white-space: pre; font-family: monospace;">
      {{ gameData }}
    </div>

    <template #footer>
      <button class="btn btn-outline-danger" @click="editResponses" data-bs-dismiss="modal">edit</button>
      <button class="btn btn-secondary" data-bs-dismiss="modal">cancel</button>
      <button class="btn btn-primary" data-bs-dismiss="modal">ok</button>
    </template>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'

export default {
  name: 'DebugModal',

  components: {
    ModalBase,
  },

  inject: ['game'],

  computed: {
    gameData() {
      if (this.game) {
        return JSON.stringify({
          _id: this.game._id,
          settings: this.game.settings,
          responses: this.game.responses,
        }, null, 2)
      }
      else {
        return 'Game data not loaded'
      }
    }
  },

  methods: {
    editResponses() {
      this.$router.push('/game/editor/' + this.game._id)
    },
  },
}
</script>
