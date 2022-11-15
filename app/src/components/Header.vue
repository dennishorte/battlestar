<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="header text-left">

          <Dropdown class="float-end">
            <DropdownRouterLink to="/">home</DropdownRouterLink>
            <DropdownRouterLink to="/lobby/create">lobby</DropdownRouterLink>
            <DropdownRouterLink to="/data">data</DropdownRouterLink>
            <DropdownRouterLink to="/magic">magic</DropdownRouterLink>
            <DropdownRouterLink to="/magic/decks">magic deck</DropdownRouterLink>
            <DropdownDivider></DropdownDivider>
            <DropdownRouterLink to="/admin">admin</DropdownRouterLink>
            <DropdownRouterLink to="/logout">logout</DropdownRouterLink>
          </Dropdown>

          <a href="/" class="link-unstyled">
            <h1>Game Center</h1>
          </a>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from '@/components/Dropdown'
import DropdownDivider from '@/components/DropdownDivider'
import DropdownItem from '@/components/DropdownItem'
import DropdownRouterLink from '@/components/DropdownRouterLink'

export default {
  name: 'Header',

  components: {
    Dropdown,
    DropdownDivider,
    DropdownItem,
    DropdownRouterLink,
  },
}
</script>

<style scoped>
.header {
  text-align: center;
}

#header-dropdown {
  float: right;
  margin: .5em;
}
</style>
