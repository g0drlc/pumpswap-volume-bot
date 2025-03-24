import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { connection, wallet_1 } from './constants';
import { PumpSwapSDK } from './pumpswap';
import { getSPLBalance } from './utils';
import { logger } from './utils';

interface VolumeBotConfig {
    tokenMint: string;
    minSolAmount: number;
    maxSolAmount: number;
    minDelayMs: number;
    maxDelayMs: number;
    maxConcurrentTrades: number;
    slippage: number;
}

export class VolumeBot {
    private sdk: PumpSwapSDK;
    private config: VolumeBotConfig;
    private isRunning: boolean = false;
    private activeTrades: number = 0;

    constructor(config: VolumeBotConfig) {
        this.sdk = new PumpSwapSDK();
        this.config = config;
    }

    private async executeTrade() {
        try {
            const tokenMint = new PublicKey(this.config.tokenMint);
            const solAmount = this.getRandomAmount(
                this.config.minSolAmount,
                this.config.maxSolAmount
            );

            // Buy tokens
            logger.info({
                status: 'Executing buy trade',
                solAmount,
                tokenMint: tokenMint.toBase58()
            });
            await this.sdk.buy(tokenMint, wallet_1.publicKey, solAmount);

            // Wait random delay
            await this.randomDelay();

            // Sell tokens
            const tokenBalance = await getSPLBalance(connection, tokenMint, wallet_1.publicKey);
            if (tokenBalance > 0) {
                logger.info({
                    status: 'Executing sell trade',
                    tokenAmount: tokenBalance,
                    tokenMint: tokenMint.toBase58()
                });
                await this.sdk.sell_exactAmount(tokenMint, wallet_1.publicKey, tokenBalance);
            }

            this.activeTrades--;
        } catch (error) {
            logger.error(`Trade execution error: ${error}`);
            this.activeTrades--;
        }
    }

    private getRandomAmount(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    private async randomDelay() {
        const delay = this.getRandomAmount(
            this.config.minDelayMs,
            this.config.maxDelayMs
        );
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    private async startTradeLoop() {
        while (this.isRunning && this.activeTrades < this.config.maxConcurrentTrades) {
            this.activeTrades++;
            this.executeTrade().catch(error => {
                logger.error(`Trade loop error: ${error}`);
                this.activeTrades--;
            });
        }
    }

    public async start() {
        if (this.isRunning) {
            logger.warn('Bot is already running');
            return;
        }

        this.isRunning = true;
        logger.info({
            status: 'Starting volume bot',
            config: this.config
        });

        // Start multiple trade loops
        const tradeLoops = Array(this.config.maxConcurrentTrades)
            .fill(null)
            .map(() => this.startTradeLoop());

        await Promise.all(tradeLoops);
    }

    public stop() {
        this.isRunning = false;
        logger.info('Stopping volume bot');
    }
}

// Example usage
async function main() {
    const config: VolumeBotConfig = {
        tokenMint: "YOUR_TOKEN_MINT_ADDRESS",
        minSolAmount: 0.1,
        maxSolAmount: 0.5,
        minDelayMs: 1000,  // 1 second
        maxDelayMs: 5000,  // 5 seconds
        maxConcurrentTrades: 3,
        slippage: 0.3  // 30% slippage
    };

    const bot = new VolumeBot(config);
    await bot.start();
}

if (require.main === module) {
    main().catch(console.error);
} 