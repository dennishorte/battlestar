<template>
  <MagicWrapper>
    <div class="card-editor-test">
      <CardEditor :card="card" />
    </div>
  </MagicWrapper>
</template>


<script>
import CardEditor from './CardEditor'
import MagicWrapper from './MagicWrapper'

export default {
  name: 'CardEditorTest',

  components: {
    CardEditor,
    MagicWrapper,
  },

  data() {
    return {
      name: this.$route.params.name,
    }
  },

  computed: {
    card() {
      return this.$store.getters['magic/cards/getLookupFunc']({ name: this.name })
    },
  },
}
</script>


<style scoped>
.card-editor-test {
  margin: 3em;
}
</style>
