# Balance Bar

View your bank balances and transactions in your Menu Bar using Open Banking.

<div align="center">
  <img
    max-width="400"
    width="45%"
    src="images/balance-menubar-light.png"
    alt="Balance Bar in light mode"
  >
  <img
    max-width="400"
    width="45%"
    src="images/balance-menubar-dark.png"
    alt="Balance Bar in dark mode"
  >
</div>

- Uses Open Banking (via TrueLayer)
- All data is stored and processed locally, no third party servers involved (other than TrueLayer, obviously)
- Secrets stored in Keychain
- Supports all TrueLayer supported banks in the UK, France, Germany, Spain and more.
- Automatic Dark Mode
- Refresh balances on-demand, or every hour automatically
- Multiple accounts per bank
- Easily copy your balance
- View your latest 7 days of transactions

## Install

### Homebrew

You can install Balance Bar via Homebrew by running:

```bash
brew install --cask scottrobertson/tap/balancebar
```

### Download

If you want to install it manually, head over to [Releases](https://github.com/scottrobertson/balancebar/releases) to download the application.

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
