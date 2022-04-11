<template>
  <component :is="processedText"></component>
</template>

<script>
import CardBiscuit from './CardBiscuit'
import CardNameFull from './CardNameFull'
import CardSquareDetails from './CardSquareDetails'
import PlayerName from './PlayerName'

const biscuitMatcher = /[{](.)[}]/g
const cardMatcher = /[*]([^-]+)-([0-9]+)[*]/g
const cardNameMatcher = /card[(]([^()]+)[)]/g
const playerMatcher = /player[(]([^()]+)[)]/g

export default {
  name: 'CardText',

  props: {
    text: String,
  },

  computed: {
    html() {
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
