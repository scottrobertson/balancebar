<template>
  <div class="flex flex-col h-screen justify-between dark:bg-black">
    <div class="h-10">
      <div class="bg-white px-4 py-3 border-b border-gray-200 dark:bg-black dark:border-gray-800 ">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Setup TrueLayer
        </h3>
      </div>

      <div class="p-5 bg-white dark:bg-black dark:text-white">
        <p class="">We need your TrueLayer Client ID/Secret. Head over there, and create an application</p>

        <p class="mt-5">
          <a class="cursor-pointer underline" @click="openLink('https://console.truelayer.com')">https://console.truelayer.com</a>
        </p>

        <p class="mt-5">
          And then enter the details below
          </p>

        <form @submit="saveCredentials">
          <div class="mt-5">
            <label for="client_id" class="block text-sm font-medium text-gray-700 dark:text-white">TrueLayer Client ID</label>
            <div class="mt-1">
              <input v-model="clientId" type="text" name="client_id" id="client_id" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:text-black" placeholder="TrueLayer Client ID">
            </div>
          </div>

          <div class="mt-5">
            <label for="client_secret" class="block text-sm font-medium text-gray-700 dark:text-white">TrueLayer Client Secret</label>
            <div class="mt-1">
              <input v-model="clientSecret" type="password" name="client_secret" id="client_secret" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:text-black" placeholder="TrueLayer Client Secret">
            </div>
          </div>

          <div class="mt-5">
            <button @click="saveCredentials" type="button" class="w-full text-center py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save Credentials
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="mx-auto mt-5 text-xs text-gray-900 dark:text-gray-400 p-5">
      Your secret will be encrypted in your system's keychain.
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      clientId: undefined,
      clientSecret: undefined
    }
  },

  mounted () {
    if (this.hasTruelayerCredentials) {
      this.$router.push('/')
    }
  },

  computed: {
    hasTruelayerCredentials () {
      return this.$store.getters.hasTruelayerCredentials
    }
  },

  methods: {
    openLink (link) {
      this.$electron.shell.openExternal(link)
    },
    saveCredentials () {
      this.$store.dispatch('setTrueLayer', {
        clientId: this.clientId,
        clientSecret: this.clientSecret
      })
      this.$router.push('/')
    }
  }
}
</script>
