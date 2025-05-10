<template>
  <li>
    <router-link class="dropdown-item" :to="to">
      <slot/>
    </router-link>
  </li>
</template>


<script>
export default {
  name: 'DropdownRouterLink',

  props: {
    to: String,
  },
}
</script>
