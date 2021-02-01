<template>
  <div class="flex flex-col h-screen justify-between">
    <div class="h-10">
      <div class="bg-white px-4 py-3 border-b border-gray-200">
        <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap">
          <div class="ml-4 mt-2">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Balances
            </h3>
          </div>
          <div class="ml-4 mt-2 flex-shrink-0">
            <button type="button" class="relative inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="h-10 mb-auto mt-5">
      <ul class="divide-y divide-gray-200">
        <li class="p-5 flex">
          <img class="h-10 w-10 rounded-full" src="https://truelayer-provider-assets.s3.amazonaws.com/global/icons/barclays.svg" alt="">
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Barclays - Current Account</p>
            <p class="text-sm text-gray-500">£41.40</p>
          </div>
        </li>

        <li class="p-5 flex">
          <img class="h-10 w-10 rounded-full" src="https://truelayer-provider-assets.s3.amazonaws.com/global/icons/monzo.svg" alt="">
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Monzo - Current Account</p>
            <p class="text-sm text-gray-500">£41.40</p>
          </div>
        </li>

        <li class="p-5 flex">
          <img class="h-10 w-10 rounded-full" src="https://truelayer-provider-assets.s3.amazonaws.com/global/icons/starling.svg" alt="">
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Starling - Joint Account</p>
            <p class="text-sm text-gray-500">£41.40</p>
          </div>
        </li>

        <li class="p-5 flex">
          <img class="h-10 w-10 rounded-full" src="https://truelayer-provider-assets.s3.amazonaws.com/global/icons/revolut.svg" alt="">
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Revolut - Joint Account</p>
            <p class="text-sm text-gray-500">£41.40</p>
          </div>
        </li>
      </ul>
    </div>

    <div class="h-10 text-center">
      <span class=" text-xs text-gray-300">Updated 5 minutes ago</span> <a href="#" class="text-center text-xs text-gray-300 underline">Refresh</a>
    </div>
  </div>


</template>

<script>
  export default {
    name: 'landing-page',
    components: { },

    data () {
      return {
      }
    }

  }
</script>
