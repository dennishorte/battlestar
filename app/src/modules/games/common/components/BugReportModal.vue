<template>
  <ModalBase id="bug-report-modal" @ok="submit" @cancel="reset">
    <template #header>Report a Bug</template>

    <p>Describe the issue you're experiencing:</p>
    <textarea
      v-model="description"
      class="form-control"
      rows="5"
      placeholder="What went wrong?"
      ref="textarea"
    />

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal" @click="reset">cancel</button>
      <button
        class="btn btn-danger"
        data-bs-dismiss="modal"
        @click="submit"
        :disabled="!description.trim()"
      >
        submit bug report
      </button>
    </template>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'

export default {
  name: 'BugReportModal',

  components: {
    ModalBase,
  },

  inject: ['game', 'actor'],

  data() {
    return {
      description: '',
    }
  },

  methods: {
    async submit() {
      const text = this.description.trim()
      if (!text) {
        return
      }

      try {
        await this.$post('/api/game/bug_report', {
          gameId: this.game._id,
          gameType: this.game.settings.game,
          gameName: this.game.settings.name,
          description: text,
        })
      }
      catch (err) {
        const message = err.response?.data?.message || 'Bug report callback failed'
        alert(message)
        return
      }

      const systemText = `Bug Report from ${this.actor.name}: ${text}`
      const position = this.game.log.getLog().length
      this.game.log.systemMessage(systemText)

      try {
        await this.$post('/api/game/system_message', {
          gameId: this.game._id,
          text: systemText,
          position,
        })
      }
      catch (err) {
        console.error('Failed to save system message:', err)
      }

      this.reset()
    },

    reset() {
      this.description = ''
    },
  },
}
</script>
