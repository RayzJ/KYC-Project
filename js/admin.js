const ADMIN_CONTRACT_ADDRESS = "0x9cC590156d39519657e117EfB3B6ace801633878"; // Replace with your actual contract address
const ADMIN_CONTRACT_ABI = [{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"approveKYC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"rejectKYC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_kycStorage","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"}],"name":"findKYCId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getKYCStatus","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"kycStorage","outputs":[{"internalType":"contract KYCStorage","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
;

let contract;

// Connect to MetaMask and get contract instance
async function connectToMetaMask() {
    if (window.ethereum) {
        console.log("MetaMask is available:", window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            contract = new ethers.Contract(ADMIN_CONTRACT_ADDRESS, ADMIN_CONTRACT_ABI, signer);

            console.log("Connected to MetaMask successfully!");

            // Get the signer address and admin address
            const signerAddress = await signer.getAddress();
            console.log("Signer address:", signerAddress);

            const adminAddress = await contract.admin();
            console.log("Admin address from the contract:", adminAddress);

        } catch (error) {
            console.error("User denied account access or an error occurred:", error);
            alert("Error connecting to MetaMask: " + error.message);
        }
    } else {
        console.error("MetaMask is not installed. Please install MetaMask to use this application.");
        alert("MetaMask is not installed. Please install MetaMask.");
    }
}

// Approve KYC function
async function approveKYC() {
    const userId = document.getElementById("userIdToApproveReject").value;
    if (userId && contract) { // Ensure contract is initialized
        try {
            const tx = await contract.approveKYC(userId);
            console.log(`KYC approved for user ID: ${userId}`, tx);
            alert(`KYC approved for user ID: ${userId}`);
        } catch (error) {
            console.error("Error in approving KYC:", error);
            alert("Error in approving KYC. Check the console for details.");
        }
    } else {
        alert("Please enter a valid User ID and make sure the contract is connected.");
    }
}

// Reject KYC function
async function rejectKYC() {
    const userId = document.getElementById("userIdToApproveReject").value;
    if (userId && contract) { // Ensure contract is initialized
        try {
            const tx = await contract.rejectKYC(userId);
            console.log(`KYC rejected for user ID: ${userId}`, tx);
            alert(`KYC rejected for user ID: ${userId}`);
        } catch (error) {
            console.error("Error in rejecting KYC:", error);
            alert("Error in rejecting KYC. Check the console for details.");
        }
    } else {
        alert("Please enter a valid User ID and make sure the contract is connected.");
    }
}


// Get KYC status function
async function getKYCStatus() {
    const userId = document.getElementById("userIdForStatus").value;
    if (userId) {
        try {
            await connectToMetaMask();
            const status = await contract.getKYCStatus(userId);
            console.log(`KYC status for user ID: ${userId}: ${status}`);
            document.getElementById("statusDisplay").innerText = `KYC Status: ${status}`;
        } catch (error) {
            console.error("Error in getting KYC status:", error);
            alert("Error in getting KYC status. Check the console for details.");
        }
    } else {
        alert("Please enter a valid User ID.");
    }
}

// Initialize contract when buttons are clicked
document.getElementById("approveButton").addEventListener("click", approveKYC);
document.getElementById("rejectButton").addEventListener("click", rejectKYC);
document.getElementById("getStatusButton").addEventListener("click", getKYCStatus);
