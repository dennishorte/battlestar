<template>
  <component :is="processedText"></component>
</template>

<script>
import CardBiscuit from './CardBiscuit'
import CardSquareDetails from './CardSquareDetails'

const biscuitMatcher = /[{](.)[}]/g
const cardMatcher = /[*]([^-]+)-([0-9]+)[*]/g

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
        .replaceAll(cardMatcher, (match, expansion, age) => {
          return `<CardSquareDetails name="${age}" expansion="${expansion}" />`
        })
    },

    processedText() {
      return {
        template: '<div style="display:inline-block;">' + this.html + '</div>',
        components: {
          CardBiscuit,
          CardSquareDetails,
        },
      }
    },
  },
}
</script>
