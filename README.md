# PumpSwap Volume Bot

A TypeScript-based volume bot for generating trading volume on PumpSwap DEX. This bot automatically executes buy and sell trades with configurable parameters to generate volume.

## Features

- 🔄 Automated buy/sell cycles
- ⚡ Concurrent trade execution
- 🎲 Random trade amounts and delays
- 📊 Configurable parameters
- 🔒 MEV protection through Jito bundles
- 📝 Comprehensive logging
- ⚠️ Error handling and recovery

## Prerequisites

- Node.js v16 or higher
- npm or yarn
- Solana wallet with SOL for trading
- Helius RPC key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pumpswap-sdk
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PRIVATE_KEY=your_private_key
HELIUS_RPC_KEY=your_helius_rpc_key
```

## Configuration

The bot can be configured with the following parameters:

```typescript
const config: VolumeBotConfig = {
    tokenMint: "YOUR_TOKEN_MINT_ADDRESS",  // The token you want to trade
    minSolAmount: 0.1,                     // Minimum SOL per trade
    maxSolAmount: 0.5,                     // Maximum SOL per trade
    minDelayMs: 1000,                      // Minimum delay between trades (1 second)
    maxDelayMs: 5000,                      // Maximum delay between trades (5 seconds)
    maxConcurrentTrades: 3,                // Number of concurrent trades
    slippage: 0.3                          // Slippage tolerance (30%)
};
```

## Usage

1. Import and initialize the bot:
```typescript
import { VolumeBot } from './src/volume-bot';

const config: VolumeBotConfig = {
    tokenMint: "YOUR_TOKEN_MINT_ADDRESS",
    minSolAmount: 0.1,
    maxSolAmount: 0.5,
    minDelayMs: 1000,
    maxDelayMs: 5000,
    maxConcurrentTrades: 3,
    slippage: 0.3
};

const bot = new VolumeBot(config);
```

2. Start the bot:
```typescript
await bot.start();
```

3. Stop the bot:
```typescript
bot.stop();
```

## How It Works

1. The bot creates multiple concurrent trade loops
2. Each loop:
   - Buys tokens with a random SOL amount
   - Waits for a random delay
   - Sells the tokens back
   - Repeats the process

## Safety Features

- Balance verification before selling
- Error handling for failed transactions
- Configurable slippage protection
- Concurrent trade limiting
- Automatic error recovery

## Logging

The bot logs all activities including:
- Trade execution
- Buy/sell amounts
- Errors and exceptions
- Start/stop events

## Important Notes

1. Make sure you have enough SOL in your wallet for trading
2. The bot uses Jito bundles for MEV protection
3. Monitor your wallet balance and adjust parameters accordingly
4. Use appropriate delays to avoid rate limiting
5. Consider network congestion when setting parameters

## Disclaimer

This bot is for educational purposes only. Trading bots can result in financial losses. Use at your own risk.

## License

MIT License

# PumpSwap SDK
# To Get Start
1. `npm i`

2. Paste your private key and Helius RPC key in .env.copy

3. rename it to .env

# Usage

### buy/sell on PumpSwap
```typescript
import {wallet_1} from "./constants";
import {PumpSwapSDK} from './pumpswap';
async function main() {
    const mint = "your-pumpfun-token-address";
    const sol_amt = 0.99; // buy 1 SOL worth of token using WSOL
    const sell_percentage = 0.5; // sell 50% of the token
    const pumpswap_sdk = new PumpSwapSDK();
    await pumpswap_sdk.buy(new PublicKey(mint), wallet_1.publicKey, sol_amt); // 0.99 sol
    await pumpswap_sdk.sell_percentage(new PublicKey(mint), wallet_1.publicKey, sell_percentage);
    await pumpswap_sdk.sell_exactAmount(new PublicKey(mint), wallet_1.publicKey, 1000); // 1000 token
}
```

### Fetch the price
```typescript
import {getPrice} from './pool';
async function main() {
    const mint = new PublicKey("your-pumpfun-token-address");   
    console.log(await getPrice(mint));
}
```

### Fetch the pool
```typescript
import {getPumpSwapPool} from './pool';
async function main() {
    const mint = new PublicKey("your-pumpfun-token-address");   
    console.log(await getPumpSwapPool(mint));
}
```

## Telegram Contact [@g0drlc](https://t.me/g0drlc)

