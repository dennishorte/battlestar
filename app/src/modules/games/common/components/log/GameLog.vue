<template>
  <div class="gamelog" ref="gamelog">
    <div v-for="(line, index) in lines" :key="index" :class="line.classes" class="log-line">

      <template v-if="line.type === 'chat'">
        <div class="chat-container">
          <div class="chat-message">
            <div>
              <span class="chat-author">{{ line.author }}:</span>
              {{ line.text }}
            </div>
            <div class="chat-delete" @click="deleteChat(line)" v-if="line.id">
              <i class="bi bi-x-circle"></i>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="n in line.indent" :key="n" class="indent-spacer" />
        <GameLogText :text="line.text" :class="classes(line)" :style="styles(line)" />
      </template>

    </div>

    <RematchButton v-if="showRematchButton && game.gameOver" />

    <div class="bottom-space"></div>
  </div>
</template>

<script>
import GameLogText from './GameLogText'
import RematchButton from '@/modules/games/common/components/RematchButton'

export default {
  name: 'GameLog',

  components: {
    GameLogText,
    RematchButton,
  },

  props: {
    funcs: {
      type: Object,
      default: {},
    },

    showRematchButton: {
      type: Boolean,
      default: true,
    },
  },

  inject: ['game', 'save', 'ui'],

  provide() {
    return {
      funcs: this.funcs,
    }
  },

  computed: {
    lines() {
      const output = []
      let indent = 0

      const entries = this.game.getMergedLog()
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]

        if (entry.type === 'response-received') {
          // do nothing
        }
        else if (entry.type === 'chat') {
          output.push(entry)
        }
        else {
          const text = this.convertLogMessage(entry)
          const classes = entry.classes || []

          output.push({
            text,
            classes,
            args: entry.args,
            indent: entry.indent,
          })
        }
      }
      return output
    }
  },

  watch: {
    lines: {
      handler() {
        this.scrollToBottom()
        window.scrollTo(0,0)
      },
      flush: 'post',
      deep: true,
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

        else if (arg === 'loc') {
          replacement = `loc(${value.value})`
        }

        msg = msg.replace(`{${arg}}`, replacement)
      }
      return msg
    },

    classes(line) {
      if (this.funcs.lineClasses) {
        return this.funcs.lineClasses(line)
      }
    },

    deleteChat(line) {
      this.game.deleteChatById(line.id)
      this.save(this.game)
    },

    // This is convenient when you need dynamic selection of styles that can't easily be handled
    // by static CSS code. eg. When a user can select their player color, and you want to inject
    // that color into the log.
    styles(line) {
      if (this.funcs.lineStyles) {
        return this.funcs.lineStyles(line)
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const elem = this.$refs.gamelog
        elem.scrollTo({
          top: 99999,
          behavior: 'smooth',
        })
      })
    },
  },

  mounted() {
    this.scrollToBottom()
  },
}
</script>

<style scoped>
.gamelog {
  font-size: .8rem;
  overflow-y: scroll;
}

.bottom-space {
  height: 2em;
}

.chat-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: .25em;
  width: 100%;
}

.chat-message {
  color: #eee;
  background-color: blue;
  padding: .25em .5em;
  border-radius: .25em;
  margin-left: 1em;
  text-align: right;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.chat-author {
  font-size: .8em;
  line-height: .5em;
  margin-top: -.5em;
}
.chat-delete {
  margin-left: .5em;
}

.log-line {
  display: flex;
  flex-direction: row;
  margin-top: 1px;
}

.indent-spacer::before {
  content: "|\00A0";
}

.indent-0 {
  font-weight: bold;
  width: 100%;
  text-align: center;
  border-radius: .5em;
  margin-top: 2em;
  line-height: 2em;
}
</style>
