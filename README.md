# Balance Bar App

View your bank balances in your Menu Bar using Open Banking.

<div align="center">
  <img
    max-width="400"
    width="45%"
    src="images/balance-menubar-light.png"
    alt="Balance Menu Bar in light mode"
  >
  <img
    max-width="400"
    width="45%"
    src="images/balance-menubar-dark.png"
    alt="Balance Menu Bar in dark mode"
  >
</div>

- Uses Open Banking (via TrueLayer)
- All data is stored and processed locally, no third party servers involved (other than TrueLayer, obviously)
- Secrets stored in Keychain
- Supports all TrueLayer supported banks
- Dark mode
- Refresh balances on-demand, or every hour automatically
- Multiple accounts per bank
- Click account to copy balance

## Download

Head over to [Releases](https://github.com/scottrobertson/balancebar/releases) to download the application.

#### Security Warning on MacOS

If you get the following warning on MacOS, then please head to Settings -> Security & Privacy and click "Open Anyway" next to Balance Bar.

```
“Balance Bar” cannot be opened because the developer cannot be verified.
```

This error will be resolved at a future date when we start signing the MacOS app.

## Development

```bash
# Clone this repo

# Install dependencies
yarn install

# Start the app
yarn dev

# build electron application for production
yarn build

# lint all JS/Vue component files in `src/`
yarn lint

```
