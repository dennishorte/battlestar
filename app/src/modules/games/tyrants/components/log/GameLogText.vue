<template>
  <component :is="processedText"></component>
</template>

<script>
import CardName from './CardName'
import LocName from './LocName'
import PlayerName from './PlayerName'

const cardNameMatcher = /card[(]([^()]+)[)]/g
const locNameMatcher = /loc[(]([^()]+)[)]/g
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
        .replaceAll(cardNameMatcher, (match, name) => {
          return `<CardName name="${name}" />`
        })
        .replaceAll(locNameMatcher, (match, name) => {
          return `<LocName name="${name}" />`
        })
        .replaceAll(playerMatcher, (match, name) => {
          return `<PlayerName name="${name}" />`
        })
    },

    processedText() {
      const style = [
        'display:inline-block',
      ].join(';')

      return {
        template: `<div style="${style};">` + this.html + '</div>',
        components: {
          CardName,
          LocName,
          PlayerName,
        },
      }
    },
  },
}
</script>


<style scoped>
.log-text {
  padding-left: 2em;
  text-indent: -2em;
}
</style>
