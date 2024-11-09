const BANK_CONTRACT_ADDRESS = "0x23123496E06dCeE622721De0Ab5B3b76777E9C58"; // Replace with your actual contract address
const BANK_CONTRACT_ABI =[{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"moveToPendingKYC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"}],"name":"registerKYC","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_kycStorage","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"bankAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"}],"name":"findKYCId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"kycStorage","outputs":[{"internalType":"contract KYCStorage","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
;  // Replace with the ABI of your contract

async function connectToMetaMask() {
    if (window.ethereum) {
        console.log("MetaMask is available:", window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(BANK_CONTRACT_ADDRESS, BANK_CONTRACT_ABI, signer);

            console.log("Connected to MetaMask successfully!");
            return contract;
        } catch (error) {
            console.error("User denied account access or an error occurred:", error);
            alert("Error connecting to MetaMask: " + error.message);
        }
    } else {
        console.error("MetaMask is not installed. Please install MetaMask to use this application.");
        alert("MetaMask is not installed. Please install MetaMask.");
    }
}


// Register a new user
async function registerUser() {
    const name = document.getElementById("nameInput").value;
    const dob = document.getElementById("dobInput").value;

    try {
        const contract = await connectToMetaMask();
        const tx = await contract.registerKYC(name, dob);
        await tx.wait();

        console.log("KYC registered successfully with transaction:", tx);
        alert("User registered successfully!");
    } catch (error) {
        console.error("Error registering KYC:", error);
        alert("Failed to register user.");
    }
}

// Find KYC ID by name and DOB
async function findKycId() {
    const name = document.getElementById("findNameInput").value;
    const dob = document.getElementById("findDobInput").value;

    try {
        const contract = await connectToMetaMask();
        const userId = await contract.findKYCId(name, dob);

        console.log("KYC ID:", userId.toString());
        document.getElementById("kycIdDisplay").innerHTML = `KYC ID: ${userId.toString()}`;
    } catch (error) {
        console.error("Error finding KYC ID:", error);
        alert("Failed to retrieve KYC ID.");
    }
}

// Move user to pending KYC list
async function moveToPending() {
    const userId = document.getElementById("userIdToPending").value;

    try {
        const contract = await connectToMetaMask();
        const tx = await contract.moveToPendingKYC(userId);
        await tx.wait();

        console.log("User moved to pending successfully with transaction:", tx);
        document.getElementById("moveStatusDisplay").innerHTML = `User ID ${userId} moved to pending.`;
    } catch (error) {
        console.error("Error moving user to pending:", error);
        alert("Failed to move user to pending.");
    }
}

// Event listeners for buttons
document.getElementById("registerButton").addEventListener("click", registerUser);
document.getElementById("findKycIdButton").addEventListener("click", findKycId);
document.getElementById("moveToPendingButton").addEventListener("click", moveToPending);
