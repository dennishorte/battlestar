<template>
  <Dropdown text="Menu" class="game-menu">
    <DropdownRouterLink to="/">game center</DropdownRouterLink>
    <DropdownDivider />
    <DropdownRouterLink to="/magic/decks">decks</DropdownRouterLink>
    <DropdownRouterLink to="/magic">profile</DropdownRouterLink>
  </Dropdown>

</template>


<script>
import Dropdown from '@/components/Dropdown'
import DropdownDivider from '@/components/DropdownDivider'
import DropdownRouterLink from '@/components/DropdownRouterLink'

export default {
  name: 'MagicMenu',

  components: {
    Dropdown,
    DropdownDivider,
    DropdownRouterLink,
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
