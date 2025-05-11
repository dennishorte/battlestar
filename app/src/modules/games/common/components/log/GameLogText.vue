<template>
  <component :is="processedText"/>
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
    text: {
      type: String,
      default: ''
    },
  },

  inject: ['funcs'],

  computed: {
    html() {
      if (this.funcs.componentMatchers) {
        return this.funcs.componentMatchers(this.text)
      }

      // A set of default matchers that will be good enough for many games.
      else {
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
      }
    },

    processedText() {
      const style = [
        'display:inline-block',
      ].join(';')


      const defaultComponents = {
        CardName,
        LocName,
        PlayerName,
      }
      const components = this.funcs.components ? this.funcs.components : defaultComponents

      return {
        template: `<div style="${style};">` + this.html + '</div>',
        components,
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
