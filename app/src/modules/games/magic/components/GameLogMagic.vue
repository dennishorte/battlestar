<template>
  <GameLog id="gamelog" :funcs="propFuncs()" />
</template>

<script>
import CardMoveLog from './CardMoveLog'
import GameLog from '@/modules/games/common/components/log/GameLog'


export default {
  name: 'GameLogMagic',

  components: {
    GameLog
  },

  methods: {
    propFuncs() {
      return {
        cardClasses: this.cardClasses,
        cardMouseover: this.cardMouseover,
        cardMouseleave: this.cardMouseleave,
        cardMousemove: this.cardMousemove,
        convertCard: this.convertCard,
        lineComponent: this.lineComponent,
        lineClasses: this.lineClasses,
        lineIndent: this.lineIndent,
        saveOnChat: this.saveOnChat,
      }
    },

    cardClasses() {
      return 'card-name'
    },

    cardMouseover(card) {
      if (card) {
        this.$store.commit('magic/setMouseoverCard', card)
      }
    },

    cardMouseleave(card) {
      if (card) {
        this.$store.commit('magic/unsetMouseoverCard', card)
      }
    },

    cardMousemove(event) {
      this.$store.commit('magic/setMouseoverPosition', {
        x: event.clientX,
        y: event.clientY,
      })
    },

    lineComponent(line) {
      if (line.event === 'move-card') {
        return CardMoveLog
      }
      return null
    },

    convertCard(cardArg) {
      if (!cardArg.classes.includes('card-hidden')) {
        return `card(${cardArg.cardId})`
      }
      else {
        return cardArg.value
      }
    },

    lineClasses(line) {
      if (line.event === 'start-turn') {
        return 'player-turn-start'
      }
      if (line.event === 'set-phase') {
        return 'set-phase'
      }
      if (line.event === 'pass-priority') {
        return 'pass-priority'
      }
    },

    lineIndent(line) {
      if (
        line.event === 'set-phase'
        || line.event === 'pass-priority'
      ) {
        return 0
      }
      else {
        return Math.max(0, line.indent - 1)
      }
    },

    saveOnChat() {
      return false
    },
  },
}
</script>

<style scoped>
#gamelog:deep() .nested {
  margin: 2px .5em 0 0;
  border-radius: 0 .5em .5em 0;
  padding: .25em 0;
}

#gamelog:deep() .nested-1 {
  background-color: #DCEDC8;
}

#gamelog:deep() .nested-2 {
  background-color: #C5E1A5;
}

#gamelog:deep() .nested-3 {
  background-color: #AED581;
}

#gamelog:deep() .nested-4 {
  background-color: #9CCC65;
}

#gamelog:deep() .nested-5 {
  background-color: #8BC34A;
}

#gamelog:deep() .nested-6 {
  background-color: #7CB342;
}

#gamelog:deep() .nested-7 {
  background-color: #689F38;
}

#gamelog:deep() .nested-8 {
  background-color: #558B2F;
}

#gamelog:deep() .pass-priority {
  background-color: #dca;
  border-radius: 0 .25em .25em 0;
  width: 40%;
  padding-left: 1em;
}

#gamelog:deep() .set-phase {
  background-color: #C3B091;
  border-radius: 0 .25em .25em 0;
  width: 50%;
  padding-left: 1em;
}

#gamelog:deep() .log-line.player-turn-start {
  display: block;
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 1em;
  background-color: lightgreen;
  border-radius: .2em;
  text-align: center;
  width: auto;
  padding-left: 0;
  margin-left: 1em;
  margin-right: 1em;
}
#gamelog:deep() .player-turn-start::before {
  content: "—";
}
#gamelog:deep() .player-turn-start::after {
  content: "—";
}

#gamelog:deep() .card-name {
  display: inline-block;
  color: #2a1247;
  font-weight: bold;
  text-decoration: underline;
}
</style>
