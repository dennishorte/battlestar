<template>
  <component :is="processedText"></component>
</template>

<script>
import CardBiscuit from './CardBiscuit'

const biscuitMatcher = /[{](.)[}]/g

export default {
  name: 'CardText',

  props: {
    text: String,
  },

  computed: {
    html() {
      return this.text.replaceAll(biscuitMatcher, (match, biscuit) => {
        return `<CardBiscuit biscuit="${biscuit}" :inline="true" />`
      })
    },

    processedText() {
      return {
        template: '<div>' + this.html + '</div>',
        components: {
          CardBiscuit
        },
      }
    },
  },
}
</script>
