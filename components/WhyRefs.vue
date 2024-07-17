<script setup>
import {ref} from 'vue'

const saludo = ref("Hola")
console.log(saludo.value) // But why???

function greeting() {
  setTimeout(() => {
    saludo.value += " mundo!"
  }, 3000)
}
</script>

<template>
  <div class="grid grid-cols-2 gap-16 items-center">
    <button @click="greeting" class="btn">
      Saludar
    </button>
    <div>
      Greeting: {{ saludo }}
    </div>
  </div>
</template>
