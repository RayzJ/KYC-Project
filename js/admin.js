const ADMIN_CONTRACT_ADDRESS = "0xC724C8f70842EB1507f9C22aDb600bb7b1B4A89f"; // Replace with your actual contract address
const ADMIN_CONTRACT_ABI = [{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"approveKYC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"rejectKYC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_kycStorage","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"}],"name":"findKYCId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getKYCStatus","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"kycStorage","outputs":[{"internalType":"contract KYCStorage","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
;
let contract;
// Manually input bank account address
const adminAccountAddress = '0x1f848B6B5FCf3D418285228830EA170f65B48612'; // Replace this with the actual bank account address

async function connectToMetaMask() {
    if (window.ethereum) {
        console.log("MetaMask is available:", window.ethereum);
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const provider = new ethers.providers.Web3Provider(window.ethereum);

            // Manually set the bank account address as the signer
            const signer = provider.getSigner(adminAccountAddress); // Use the provided bank account address

            // Use the signer to create a contract instance
            contract = new ethers.Contract(ADMIN_CONTRACT_ADDRESS, ADMIN_CONTRACT_ABI, signer);

            // Print out the connected bank address
            const signerAddress = await signer.getAddress();
            console.log("Connected admin Address:", signerAddress);

            return contract;
        } catch (error) {
            console.error("Error connecting to MetaMask or the admin account:", error);
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
