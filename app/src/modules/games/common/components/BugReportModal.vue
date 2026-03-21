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

      this.game.log.systemMessage(`Bug Report from ${this.actor.name}: ${text}`)
      await this.$store.dispatch('game/save')

      try {
        await this.$post('/api/game/bug_report', {
          gameId: this.game._id,
          description: text,
        })
      }
      catch (err) {
        const message = err.response?.data?.message || 'Bug report callback failed'
        alert(message)
      }

      this.reset()
    },

    reset() {
      this.description = ''
    },
  },
}
</script>
