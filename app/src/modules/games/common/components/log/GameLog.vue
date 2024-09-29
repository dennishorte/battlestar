<template>
  <div class="gamelog" ref="gamelog" :class="nestedClasses">
    <ChatOffCanvas :colors="chatColors" v-if="!nested" />

    <template v-for="(line, index) in lines">

      <div v-if="line.type === 'nest'">
        <GameLog :entries="line.entries" :depth="line.depth" :funcs="funcs" />
      </div>

      <div v-else class="log-line" :class="line.classes">
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
          <div v-for="n in indentSpacers(line)" :key="n" class="indent-spacer" />
          <GameLogText :text="line.text" :class="classes(line)" :style="styles(line)" />
        </template>
      </div>

    </template>

    <RematchButton v-if="rematchButtonVisible" />

    <div class="bottom-space" v-if="!nested"></div>

    <ChatInput id="chat-input-main" :save-on-chat="saveOnChat" v-if="!nested" />
  </div>
</template>

<script>
import ChatInput from '@/modules/games/common/components/ChatInput'
import ChatOffCanvas from '@/modules/games/common/components/log/ChatOffCanvas'
import GameLogText from '@/modules/games/common/components/log/GameLogText'
import RematchButton from '@/modules/games/common/components/RematchButton'


export default {
  name: 'GameLog',

  components: {
    ChatInput,
    ChatOffCanvas,
    GameLogText,
    RematchButton,
  },

  props: {
    depth: {
      type: Number,
      default: 0,
    },

    entries: {
      type: Array,
      default: null,
    },

    funcs: {
      type: Object,
      default: {},
    },

    saveOnChat: {
      type: Boolean,
      default: true,
    },

    showRematchButton: {
      type: Boolean,
      default: true,
    },
  },

  inject: ['game'],

  provide() {
    return {
      funcs: this.funcs,
    }
  },

  computed: {
    chatColors() {
      if (this.funcs.chatColors) {
        return this.funcs.chatColors()
      }
      else {
        return {}
      }
    },

    lines() {
      if (this.entries) {
        return this.entries
      }
      else {
        const output = this.nestLog(this.game.getMergedLog()).output
        return output
      }
    },

    nested() {
      return this.depth > 0
    },

    nestedClasses() {
      return [
        'nested',
        `nested-${this.depth}`,
      ]
    },

    rematchButtonVisible() {
      return this.showRematchButton && this.game.gameOver && !this.nested
    },
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

        if (arg === 'card') {
          if (this.funcs.convertCard) {
            replacement = this.funcs.convertCard(value)
          }

          else if (!value.value.startsWith('*')) {
            replacement = `card(${value.value})`
          }
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

    nestLog(entries, depth=0) {
      const output = []
      let indent = 0
      let count = 0

      for (let i = 0; i < entries.length; i++) {
        count += 1

        const entry = entries[i]

        if (entry.type === 'response-received') {
          // do nothing
        }
        else if (entry.type === 'chat') {
          output.push(entry)
        }
        else {
          const text = this.convertLogMessage(entry)
          const line = {
            text,
            classes: entry.classes || [],
            args: entry.args,
            indent: entry.indent,
          }

          if (line.classes.includes('stack-push')) {
            const result = this.nestLog(entries.slice(i + 1), depth + 1)
            const nested = result.output

            i += result.consumed
            count += result.consumed
            nested.splice(0, 0, line)

            output.push({
              type: 'nest',
              depth: depth + 1,
              entries: nested
            })
          }
          else if (line.classes.includes('stack-pop')) {
            output.push(line)
            break
          }
          else {
            output.push(line)
          }
        }
      }
      return { output, consumed: count }
    },

    classes(line) {
      if (this.funcs.lineClasses) {
        return this.funcs.lineClasses(line)
      }
    },

    deleteChat(line) {
      this.game.deleteChatById(line.id)
      this.$store.dispatch('game/save')
    },

    indentSpacers(entry) {
      return 0
      if (this.funcs.lineIndent) {
        return this.funcs.lineIndent(entry)
      }
      else {
        return entry.indent
      }
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
  padding-left: 1em;
  width: 100%;
}

.indent-spacer::before {
  content: "…\00A0";
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
