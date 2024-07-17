<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })
</script>

<template>
  <button @click="state.count++" class="btn">
    state.counter:  {{ state.count }}
  </button>
</template>
