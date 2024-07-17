<script setup>
import { ref } from "vue"

const count = ref(0)
const object = { id: ref(1) }

const reveal = ref(false)
</script>

<template>
  <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-10">
    <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
      <div class="rounded-t mb-0 px-4 py-3 border-0">
        <div class="flex flex-wrap items-center">
          <div class="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 class="font-semibold text-base text-blueGray-700">Demo</h3>
          </div>
          <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
            <button @click="reveal = !reveal" class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">Click to Reveal</button>
          </div>
        </div>
      </div>

      <div class="block w-full overflow-x-auto">
        <table class="items-center bg-transparent w-full border-collapse ">
          <thead>
            <tr>
              <th class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" v-text="'{{ count + 1 }}'">
              </th>
              <th class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" v-text="'{{ object.id + 1 }}'">
              </th>
            </tr>
          </thead>

          <tbody :class="{'blur': !reveal}">
            <tr>
              <th class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                {{ count + 1 }}
              </th>
              <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700">
                {{ object.id + 1 }}
              </td>
            </tr>
          </tbody>

        </table>
      </div>

    </div>
  </div>

</template>

<style lang="scss" scoped>
.blur {
  @apply blur-sm;
}
</style>
