<template>
  <GameLog id="gamelog" :funcs="propFuncs()" />
</template>

<script>
import GameLog from '@/modules/games/common/components/log/GameLog'

export default {
  name: 'GameLogTyrants',

  components: {
    GameLog
  },

  inject: ['game', 'ui'],

  methods: {
    propFuncs() {
      return {
        cardClick: this.cardClick,
        cardStyles: this.cardStyles,
        lineClasses: this.lineClasses,
        lineStyles: this.lineStyles,
        playerStyles: this.playerStyles,
      }
    },

    cardClick(card) {
      this.ui.modals.cardViewer.cardId = card.id
      this.$modal('card-viewer-modal').show()
    },

    cardStyles(card) {
      const output = {}

      if (this.cardOwner(card)) {
        output['background-color'] = this.cardOwner(card).color
      }

      return output
    },

    cardOwner(card) {
      if (card) {
        const nameBits = card.name.split('-')
        if (nameBits.length > 1 && (nameBits[0] === 'troop' || nameBits[0] === 'spy')) {
          return this.game.getPlayerByName(nameBits[1])
        }
      }
    },

    lineClasses(line) {
      const classes = [`indent-${line.indent}`]

      if (line.text.includes(' plays ')) {
        classes.push('player-action')
        classes.push('play-a-card')
      }
      else if (line.text.endsWith(' recruit')) {
        classes.push('player-action')
        classes.push('recruit-action')
      }
      else if (line.text.includes(' power: ')) {
        classes.push('player-action')
        classes.push('power-action')
      }
      else if (line.text.endsWith(' passes')) {
        classes.push('player-action')
        classes.push('pass-action')
      }
      else if (line.text.includes(' turn ')) {
        // do nothing
      }
      else {
        classes.push('generic')
      }

      return classes
    },

    lineStyles(line) {
      if (line.classes && line.classes.includes('player-turn')) {
        const playerName = line.args.player.value
        const player = this.game.getPlayerByName(playerName)
        return {
          'background-color': player.color,
        }
      }
    },

    playerStyles(player) {
      const output = {}
      output['background-color'] = player.color
      return output
    },
  },
}
</script>

<style scoped>
#gamelog >>> .indent-0 {
  color: black;
}

#gamelog >>> .indent-0.generic {
  color: #eee;
  background-color: purple;
}

#gamelog >>> .player-action {
  padding: 5px 10px;
  border-radius: 3px;
}

#gamelog >>> .player-action.recruit-action {
  background-color: #e8b687;
}

#gamelog >>> .player-action.play-a-card {
  background-color: #e8d987;
}

#gamelog >>> .player-action.power-action {
  background-color: #e8c887;
}

#gamelog >>> .player-action.pass-action {
  background-color: #c96d2c;
}

#gamelog >>> .player-turn-start {
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 1em;
  background-color: lightgreen;
  border-radius: .2em;
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

#gamelog >>> .loc-name {
  display: inline-block;
  background-color: var(--tyr-location-background);
  border-radius: .1em;
  padding: 0 .4em;
}

#gamelog >>> .player-name {
  display: inline-block;
  padding: 0 .4em;
  border-radius: .1em;
}
</style>
