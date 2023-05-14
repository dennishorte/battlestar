<template>
  <Modal id="debug-modal">
    <template #header>debug</template>
    <div style="white-space: pre; font-family: monospace;">
      {{ gameData }}
    </div>
  </Modal>
</template>


<script>
import Modal from '@/components/Modal'

export default {
  name: 'DebugModal',

  components: {
    Modal,
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
}
</script>
