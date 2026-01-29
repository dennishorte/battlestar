<template>
  <component :is="processedText"/>
</template>

<script>
import CardBiscuit from './CardBiscuit.vue'
import CardNameFull from './CardNameFull.vue'
import CardSquareDetails from './CardSquareDetails.vue'
import PlayerName from './PlayerName.vue'

const biscuitMatcher = /[{](.)[}]/g
const cardMatcher = /[*]([^-]+)-([0-9]+)[*]/g
const cardNameMatcher = /card[(]([^()]+)[)]/g
const playerMatcher = /player[(]([^()]+)[)]/g

export default {
  name: 'CardText',

  props: {
    text: {
      type: String,
      default: '',
    },
  },

  computed: {
    html() {
      if (!this.text) {
        return ''
      }

      return this
        .text
        .replaceAll(biscuitMatcher, (match, biscuit) => {
          return `<CardBiscuit biscuit="${biscuit}" :inline="true" />`
        })
        .replaceAll(cardNameMatcher, (match, name) => {
          return `<CardNameFull name="${name}" />`
        })
        .replaceAll(cardMatcher, (match, expansion, age) => {
          return `<CardSquareDetails name="${age}" expansion="${expansion}" />`
        })
        .replaceAll(playerMatcher, (match, name) => {
          return `<PlayerName name="${name}" />`
        })
    },

    processedText() {
      return {
        template: '<div style="display:inline-block;">' + this.html + '</div>',
        components: {
          CardBiscuit,
          CardNameFull,
          CardSquareDetails,
          PlayerName,
        },
      }
    },
  },
}
</script>
