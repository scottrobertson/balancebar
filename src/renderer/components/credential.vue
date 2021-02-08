<template>
  <li class="p-5 flex hover:bg-white dark:hover:bg-gray-900">
    <img class="h-10 w-10" :src="credential.provider.logo_uri" alt="" />
    <div class="ml-3">
      <p class="text-sm font-medium text-gray-900 dark:text-white">
        {{ credential.provider.display_name }}
      </p>
      <div v-if="credential.consent_created_at" class="text-xs dark:text-white">
        <div>Connected {{ credential.consent_created_at | moment("from") }}</div>
        <div>Expires {{ credential.consent_expires_at | moment("from") }}</div>
      </div>
      <a class="underline cursor-pointer text-xs text-gray-500 dark:text-gray-300" @click="disconnectCredential()"> Disconnect </a>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    credential: {
      type: Object,
      required: true,
    },
  },

  methods: {
    async disconnectCredential() {
      await this.$store.dispatch("deleteCredential", this.credential);
      await this.$store.dispatch("refreshAccounts");
    },
  },
};
</script>
