<template>
  <div v-show="show" class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div
        class="text-center inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="mt-2">
          <p class="text-sm text-gray-500">You can download the latest version by heading over to GitHub.</p>
        </div>

        <div class="mt-3">
          <a
            target="blank"
            href="https://github.com/scottrobertson/balancebar/releases/latest"
            type="button"
            class="text-center block w-full rounded-md border border-transparent px-5 py-3 bg-black text-base font-medium text-white shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:px-10"
          >
            Download Now
          </a>
        </div>

        <div class="mt-4">
          <p class="text-sm text-gray-500 border-gray-300 border-t pt-4">Alternatively you can install via Homebrew</p>

          <p class="text-left overflow-clip whitespace-nowrap bg-gray-700 text-white text-sm p-3 select-all rounded-lg mt-3">brew install --cask scottrobertson/tap/balancebar</p>
        </div>

        <div class="mt-4">
          <a class="underline cursor-pointer text-xs text-gray-500" @click="$emit('closed')">Cancel</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
