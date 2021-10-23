<template>
  <b-modal
    id="game-log-modal"
    title="game-log"
    ok-only>

    <div class="game-log">

      <div>
        <div style="float: right;">
          <b-form-checkbox v-model="doLogNavigation" size="sm" switch>
            navigate
          </b-form-checkbox>
        </div>

        <span class="heading">
          Log
        </span>
      </div>

      <div id="log-entries" class="log-entries">

        <div v-for="entry in log" :key="entry.id" :class="classes(entry)">
          {{ indent(entry) }}
          <span
            v-for="(token, index) in templateSubstitute(entry)"
            :key="index"
            :class="token.classes">

            {{ token.value }}
          </span>
        </div>

      </div>

    </div>
  </b-modal>
</template>


<script>
import { log } from 'battlestar-common'

export default {
  name: 'GameLog',

  data() {
    return {
      doLogNavigation: false,
    }
  },

  computed: {
    log() {
      return this.$game.getLog()
    },
  },

  methods: {
    classes(entry) {
      const output = entry.classes ? [...entry.classes] : []
      output.push('log-entry')
      // output.push(`log-indent-${entry.indent}`)
      return output
    },

    indent(entry) {
      let output = ''
      for (let i = 0; i < entry.indent; i++) {
        output += '… ' // U+2026
      }
      return output
    },

    templateSubstitute(entry) {
      return log.apply(entry)
    },
  },

  mounted() {
    this.$root.$on('bv::modal::shown', (bvEvent, modalId) => {
      if (modalId === 'game-log-modal') {
        const container = document.getElementById('log-entries')
        container.scrollTop = container.scrollHeight
      }
    })
  },
}
</script>


<style scoped>
.log-entries {
  height: 67vh;
  overflow-y: auto;
}

.log-entry {
  font-size: .7em;
}
</style>
