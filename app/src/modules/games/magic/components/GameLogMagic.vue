<template>
  <GameLog id="gamelog" :funcs="propFuncs()" />
</template>

<script>
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
        lineClasses: this.lineClasses,
        lineIndent: this.lineIndent,
      }
    },

    cardClasses(card) {
      return 'card-name'
    },

    cardMouseover(card) {
      if (card && card.data) {
        this.$store.commit('magic/setMouseoverCard', card.data)
      }
    },

    cardMouseleave(card) {
      if (card && card.data) {
        this.$store.commit('magic/unsetMouseoverCard', card.data)
      }
    },

    cardMousemove(event) {
      this.$store.commit('magic/setMouseoverPosition', {
        x: event.clientX,
        y: event.clientY,
      })
    },

    convertCard(card) {
      if (!card.classes.includes('card-hidden')) {
        return `card(${card.cardId})`
      }
      else {
        return card.value
      }
    },

    lineClasses(line) {
      if (line.indent === 0 && line.text.endsWith(' turn')) {
        return 'player-turn-start'
      }
    },

    lineIndent(line) {
      if (
        line.classes.includes('set-phase')
        || line.classes.includes('pass-priority')
      ) {
        return 0
      }
      else {
        return Math.max(0, line.indent - 1)
      }
    },
  },
}
</script>

<style scoped>
#gamelog >>> .nested {
  margin: 2px .5em 0 0;
  border-radius: 0 .5em .5em 0;
  padding: .25em 0;
}

#gamelog >>> .nested-1 {
  background-color: #DCEDC8;
}

#gamelog >>> .nested-2 {
  background-color: #C5E1A5;
}

#gamelog >>> .nested-3 {
  background-color: #AED581;
}

#gamelog >>> .nested-4 {
  background-color: #9CCC65;
}

#gamelog >>> .nested-5 {
  background-color: #8BC34A;
}

#gamelog >>> .nested-6 {
  background-color: #7CB342;
}

#gamelog >>> .nested-7 {
  background-color: #689F38;
}

#gamelog >>> .nested-8 {
  background-color: #558B2F;
}

#gamelog >>> .pass-priority {
  background-color: #dca;
  border-radius: 0 .25em .25em 0;
  width: 40%;
  padding-left: 1em;
}

#gamelog >>> .set-phase {
  background-color: #C3B091;
  border-radius: 0 .25em .25em 0;
  width: 50%;
  padding-left: 1em;
}

#gamelog >>> .player-turn-start {
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 1em;
  background-color: lightgreen;
  border-radius: .2em;
  width: 100%;
  text-align: center;
}
#gamelog >>> .player-turn-start::before {
  content: "—";
}
#gamelog >>> .player-turn-start::after {
  content: "—";
}

#gamelog >>> .card-name {
  display: inline-block;
  color: #2a1247;
  font-weight: bold;
  text-decoration: underline;
}
</style>
