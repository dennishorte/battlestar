<template>
  <div class="history">
    <div v-for="(line, index) in lines" :key="index" :class="line.classes" class="log-line">
      <div v-for="n in line.indent" :key="n" class="indent-spacer" />
      <CardText :text="line.text" />
    </div>
    <div class="bottom-space" ref="bottom"></div>
  </div>
</template>

<script>
import CardText from './CardText'

export default {
  name: 'History',

  components: {
    CardText,
  },

  inject: ['game'],

  props: {
    game: Object
  },

  computed: {
    lines() {
      const output = []
      let indent = 0
      for (const entry of this.game.getLog()) {
        if (entry.type === 'response-received') {
          continue
        }
        if (entry === '__INDENT__') {
          indent += 1
          continue
        }
        if (entry === '__OUTDENT__') {
          indent -= 1
          continue
        }

        const text = this.convertLogMessage(entry)
        const classes = entry.classes || []

        if (
          text.includes(' chooses ')
          || text.startsWith('Demands will be made of')
          || text.startsWith('Effects will share with')
        ) {
          classes.push('faded-text')
        }

        output.push({
          text,
          classes,
          indent: Math.max(0, indent - 1),
        })
      }
      return output
    }
  },

  watch: {
    lines: {
      handler() { this.scrollToBottom() },
      flush: 'post',
    },
  },

  methods: {
    convertLogMessage(entry) {
      let msg = entry.template
      for (const [arg, value] of Object.entries(entry.args)) {
        let replacement = value.value

        if (arg === 'card' && !value.value.startsWith('*')) {
          replacement = `card(${value.value})`
        }

        else if (arg === 'player') {
          replacement = `player(${value.value})`
        }

        msg = msg.replace(`{${arg}}`, replacement)
      }
      return msg
    },

    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.bottom.scrollIntoView({ behavior: 'smooth' })
      })
    },
  },

  mounted() {
    this.scrollToBottom()
  },
}
</script>

<style scoped>
.history {
  font-size: .8rem;
}

.bottom-space {
  height: 2em;
}

.log-line {
  display: flex;
  flex-direction: row;
}

.indent-spacer::before {
  content: "…\00A0";
}

.player-turn-start {
  font-weight: bold;
  margin-top: 1em;
}
.player-turn-start::before {
  content: "—";
}
.player-turn-start::after {
  content: "—";
}

.action-header {
  font-weight: bold;
  margin-top: .5em;
}

.faded-text {
  font-weight: 200;
  color: lightgray;
}

.card-effect {
  background-color: lightgray;
  border-radius: .5em;
}
</style>
