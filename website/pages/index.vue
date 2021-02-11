<template>
  <div>
    <div class="bg-white pb-8 sm:pb-12 lg:pb-12">
      <div class="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
        <div class="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
          <div>
            <div class="mt-20">
              <div class="mt-6 sm:max-w-xl">
                <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Balance Bar</h1>
                <p class="mt-6 text-xl text-gray-500">View your bank balances in your menu bar. Powered by Open Banking.</p>
              </div>
              <div class="mt-12">
                <a
                  href="https://github.com/scottrobertson/balancebar/releases/latest"
                  class="text-center block w-full rounded-md border border-transparent px-5 py-3 bg-black text-base font-medium text-white shadow hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:px-10"
                  >Download Now</a
                >
              </div>
            </div>
          </div>
        </div>

        <div class="sm:mx-auto sm:max-w-3xl sm:px-6">
          <div class="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div class="hidden sm:block">
              <div class="absolute inset-y-0 left-1/3 w-screen bg-gray-50 rounded-l-3xl lg:left-10 lg:right-0 lg:w-full"></div>
              <svg class="absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0" width="404" height="392" fill="none" viewBox="0 0 404 392">
                <defs>
                  <pattern id="837c3e70-6c3a-44e6-8854-cc48c737b659" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="404" height="392" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
              </svg>
            </div>
            <div class="relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12 flex">
              <div
                class="flex relative rounded-md shadow-xl ring-1 ring-black ring-opacity-5"
                <img
                class="w-full lg:h-full lg:w-auto lg:max-w-none"
                src="~/assets/balance-menubar-light.png?raw=true"
                alt=""
              >
                <img class="w-full lg:h-full lg:w-auto lg:max-w-none" src="~/assets/balance-menubar-dark.png?raw=true" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-5 sm:px-0">
        <dl class="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
          <div class="flex">
            <svg class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="ml-3">
              <dt class="text-lg leading-6 font-medium text-gray-900">Menu Bar</dt>
              <dd class="mt-2 text-base text-gray-500">Balance Bar sits in your menu bar, so your balance are always 1 click away.</dd>
            </div>
          </div>

          <div class="flex">
            <svg class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="ml-3">
              <dt class="text-lg leading-6 font-medium text-gray-900">Secure</dt>
              <dd class="mt-2 text-base text-gray-500">Your access tokens are encrypted in your local keychain.</dd>
            </div>
          </div>

          <div class="flex">
            <svg class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="ml-3">
              <dt class="text-lg leading-6 font-medium text-gray-900">Private</dt>
              <dd class="mt-2 text-base text-gray-500">We do not see or store your data (we don't even have any servers!).</dd>
            </div>
          </div>

          <div class="flex">
            <svg class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="ml-3">
              <dt class="text-lg leading-6 font-medium text-gray-900">Open Source</dt>
              <dd class="mt-2 text-base text-gray-500">Balance Bar is an open source project, so anyone can review the code.</dd>
            </div>
          </div>

          <div class="flex">
            <svg class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="ml-3">
              <dt class="text-lg leading-6 font-medium text-gray-900">Supported Banks</dt>
              <dd class="mt-2 text-base text-gray-500">Works with all TrueLayer supported banks across Europe.</dd>
            </div>
          </div>

          <div class="flex">
            <svg class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="ml-3">
              <dt class="text-lg leading-6 font-medium text-gray-900">Powered by TrueLayer</dt>
              <dd class="mt-2 text-base text-gray-500">The app is powered by TrueLayer, an FCA approved company providing a secure way to access Open Banking data.</dd>
            </div>
          </div>

          <div class="flex">
            <svg class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="ml-3">
              <dt class="text-lg leading-6 font-medium text-gray-900">Unlimited Accounts</dt>
              <dd class="mt-2 text-base text-gray-500">You can connect as many accounts as you like, even from the same bank.</dd>
            </div>
          </div>

          <div class="flex">
            <svg class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div class="ml-3">
              <dt class="text-lg leading-6 font-medium text-gray-900">Dark Mode</dt>
              <dd class="mt-2 text-base text-gray-500">The app will automatically switch to dark mode when your computer does.</dd>
            </div>
          </div>
        </dl>
      </div>
      <footer class="bg-white">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div class="flex justify-center space-x-6 md:order-2">
            <a href="https://twitter.com/scottymeuk" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                />
              </svg>
            </a>

            <a href="https://github.com/scottrobertson/balancebar" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">GitHub</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </div>
          <div class="mt-8 md:mt-0 md:order-1">
            <p class="text-center text-base text-gray-400">Built by <a class="cursor-pointer underline" href="https://scottrobertson.me">Scott Robertson</a></p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "Balance Bar - View your bank balances in your menu bar",
    };
  },
};
</script>
