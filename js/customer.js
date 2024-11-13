// ABI and contract address from Remix deployment
const kycListContractABI = [{"inputs":[{"internalType":"address","name":"_kycStorageAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"kycStorage","outputs":[{"internalType":"contract KYCStorage","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"listAllApprovedKYC","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"address","name":"registeredBy","type":"address"}],"internalType":"struct KYCStorage.KYCInfo[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"listAllPendingKYC","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"address","name":"registeredBy","type":"address"}],"internalType":"struct KYCStorage.KYCInfo[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"listAllRegisteredKYC","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"address","name":"registeredBy","type":"address"}],"internalType":"struct KYCStorage.KYCInfo[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"listAllRejectedKYC","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"address","name":"registeredBy","type":"address"}],"internalType":"struct KYCStorage.KYCInfo[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"}];
const kycListContractAddress = "0xA1ec5e77a2069CB300aC3444AAA34948c50e3ca1"; // Replace with the actual deployed contract address

// Mapping of bank addresses to bank names
const bankNameMapping = {
    "0x1f848B6B5FCf3D418285228830EA170f65B48612": "Bank 1", // Replace with actual Ethereum address and bank name
    "0xBa9dB73224b3e3194Eb5109144a012B8F1722efc": "Bank 2", // Replace with actual Ethereum address and bank name
    // Add more mappings as needed
};

// Initialize ethers.js and contract instance
let provider, signer, kycListContract;

async function initialize() {
    if (window.ethereum) {
        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            kycListContract = new ethers.Contract(kycListContractAddress, kycListContractABI, signer);
            console.log("Connected to MetaMask successfully!");
        } catch (error) {
            console.error("User denied account access or an error occurred:", error);
        }
    } else {
        console.error("MetaMask is not installed. Please install MetaMask to use this application.");
    }
}

// Fetch and display KYC data based on the function name
async function fetchAndDisplayData(fetchFunctionName, statusLabel) {
    const tbody = document.querySelector('#userStatus tbody');
    tbody.innerHTML = ''; // Clear the table

    try {
        const kycData = await kycListContract[fetchFunctionName]();

        if (kycData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5">No ${statusLabel} users found</td></tr>`;
            return;
        }

        kycData.forEach(user => {
            // Get bank name from mapping, or show address if not found
            const bankName = bankNameMapping[user.registeredBy] || user.registeredBy;

            tbody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.dob}</td>
                    <td>${bankName}</td>
                    <td>${statusLabel}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error(`Error fetching ${statusLabel} KYC data:`, error);
        tbody.innerHTML = `<tr><td colspan="5">Error fetching ${statusLabel} data</td></tr>`;
    }
}

// Event listeners for each button
document.getElementById('showRegistered').addEventListener('click', () => fetchAndDisplayData('listAllRegisteredKYC', 'Registered'));
document.getElementById('showPending').addEventListener('click', () => fetchAndDisplayData('listAllPendingKYC', 'Pending'));
document.getElementById('showApproved').addEventListener('click', () => fetchAndDisplayData('listAllApprovedKYC', 'Approved'));
document.getElementById('showRejected').addEventListener('click', () => fetchAndDisplayData('listAllRejectedKYC', 'Rejected'));

// Initialize the contract connection on page load
initialize();
