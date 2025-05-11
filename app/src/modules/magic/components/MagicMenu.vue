<template>
  <DropdownMenu class="game-menu">
    <template #title>{{ title }}</template>

    <DropdownRouterLink to="/">game center</DropdownRouterLink>
    <DropdownDivider />
    <DropdownRouterLink to="/magic">magic</DropdownRouterLink>
    <DropdownDivider />
    <DropdownButton @click="updateDatabase">update database</DropdownButton>
  </DropdownMenu>

</template>


<script>
import DropdownMenu from '@/components/DropdownMenu'
import DropdownButton from '@/components/DropdownButton'
import DropdownDivider from '@/components/DropdownDivider'
import DropdownRouterLink from '@/components/DropdownRouterLink'

export default {
  name: 'MagicMenu',

  components: {
    DropdownMenu,
    DropdownButton,
    DropdownDivider,
    DropdownRouterLink,
  },

  props: {
    title: {
      type: String,
      default: 'Menu',
    },
  },

  methods: {
    updateDatabase() {
      this.$store.dispatch('magic/cards/updateCards')
    },
  },
}
</script>


<style scoped>
.game-menu {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;

  height: 3em;
  padding: 0 .25em;
  text-align: center;
}
</style>
