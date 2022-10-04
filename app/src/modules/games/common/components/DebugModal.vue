<template>
  <b-modal id="debug-modal" scrollable title="debug">
    <div style="white-space: pre; font-family: monospace;">
      {{ gameData }}
    </div>
  </b-modal>
</template>


<script>
export default {
  name: 'DebugModal',

  inject: ['game'],

  computed: {
    gameData() {
      return JSON.stringify({
        _id: this.game._id,
        settings: this.game.settings,
        responses: this.game.responses,
      }, null, 2)
    }
  },
}
</script>
