<template>
  <div class="gamelog" ref="gamelog" :class="nestedClasses">
    <template v-for="(line, index) in lines" :key="index">

      <div v-if="line.type === 'nest'">
        <GameLog :entries="line.entries" :depth="line.depth" />
      </div>

      <div v-else class="log-line" :class="line.classes">
        <template v-if="line.type === 'chat'">
          <div class="chat-container">
            <div class="chat-message">
              <span class="chat-author">{{ line.author }}:</span>
              {{ line.text }}
            </div>
          </div>
        </template>

        <template v-else>
          <div v-for="n in indentSpacers(line)" :key="n" class="indent-spacer" />
          <GameLogText :text="line.text" :class="classes(line)" />
        </template>
      </div>

    </template>

    <RematchButton v-if="game.gameOver" />

    <div class="bottom-space" v-if="!nested"></div>
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
    entries: Array,
    depth: {
      type: Number,
      default: 0,
    },
  },

  inject: ['game'],

  computed: {
    lines() {
      if (this.nested) {
        return this.entries
      }
      else {
        const output = _nestLog(this.entries).output
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
    classes(line) {
      if (line.indent === 0) {
        return 'log-header'
      }
      else {
        return ''
      }
    },

    indentSpacers(entry) {
      if (
        entry.classes.includes('set-phase')
        || entry.classes.includes('pass-priority')
      ) {
        return 0
      }
      else {
        return Math.max(0, entry.indent - 1)
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

function _convertLogMessage(entry) {
  let msg = entry.template
  for (const [arg, value] of Object.entries(entry.args)) {
    let replacement = value.value

    if (arg === 'card' && !value.classes.includes('card-hidden')) {
      replacement = `card(${value.cardId})`
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
}

function _nestLog(entries, depth=0) {
  const output = []
  let indent = 0
  let count = 0

  for (let i = 0; i < entries.length; i++) {
    count += 1

    const entry = entries[i]

    if (entry.type === 'response-received') {
      // do nothing
    }
    else if (entry === '__INDENT__') {
    }
    else if (entry === '__OUTDENT__') {
    }
    else if (entry.type === 'chat') {
      output.push(entry)
    }
    else {
      const text = _convertLogMessage(entry)
      const line = {
        text,
        classes: entry.classes || [],
        args: entry.args,
        indent: entry.indent === 0 ? 0 : 1,
//        indent: entry.indent,
      }

      if (line.classes.includes('stack-push')) {
        const result = _nestLog(entries.slice(i + 1), depth + 1)
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
}
</script>

<style scoped>
.gamelog {
  position: relative;
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
}
.chat-author {
  font-size: .8em;
  line-height: .5em;
  margin-top: -.5em;;
}

.log-line {
  display: flex;
  flex-direction: row;
  margin-top: 1px;
  padding-left: 1em;
}

.indent-spacer::before {
  content: "|\00A0";
}

.log-header {
  font-weight: bold;
  width: 100%;
  text-align: center;
  border-radius: .5em .5em 0 0;
  line-height: 2em;

  margin: 2em 1em 0 1em;

  color: white;
  background-color: #7db881;
}

.nested {
  margin: 2px .5em 0 0;
  border-radius: 0 .5em .5em 0;
  padding: .25em 0;
}

.nested-1 {
  background-color: #DCEDC8;
}

.nested-2 {
  background-color: #C5E1A5;
}

.nested-3 {
  background-color: #AED581;
}

.nested-4 {
  background-color: #9CCC65;
}

.nested-5 {
  background-color: #8BC34A;
}

.nested-6 {
  background-color: #7CB342;
}

.nested-7 {
  background-color: #689F38;
}

.nested-8 {
  background-color: #558B2F;
}

.pass-priority {
  background-color: #dca;
  border-radius: 0 .25em .25em 0;
  width: 40%;
  padding-left: 1em;
}

.set-phase {
  background-color: #C3B091;
  border-radius: 0 .25em .25em 0;
  width: 50%;
  padding-left: 1em;
}

.player-turn-start {
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 1em;
  background-color: lightgreen;
  border-radius: .2em;
}
.player-turn-start::before {
  content: "—";
}
.player-turn-start::after {
  content: "—";
}
</style>
