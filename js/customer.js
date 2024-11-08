// ABI and contract address from Remix deployment in Ganache
const kycListContractABI = [{"inputs":[{"internalType":"address","name":"_kycStorageAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"kycStorage","outputs":[{"internalType":"contract KYCStorage","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"listAllApprovedKYC","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"address","name":"registeredBy","type":"address"}],"internalType":"struct KYCStorage.KYCInfo[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"listAllPendingKYC","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"address","name":"registeredBy","type":"address"}],"internalType":"struct KYCStorage.KYCInfo[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"listAllRegisteredKYC","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"address","name":"registeredBy","type":"address"}],"internalType":"struct KYCStorage.KYCInfo[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"listAllRejectedKYC","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"address","name":"registeredBy","type":"address"}],"internalType":"struct KYCStorage.KYCInfo[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"}];
const kycListContractAddress = "0xD275F5De4Ca7c5DfED5175B7B8FDD38EB0244223"; // Replace with the actual deployed contract address in Ganache

// Initialize ethers.js and contract instance
let provider, signer, kycListContract;

async function initialize() {
    // Connect to Ganache using ethers.js
    provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"); // Ganache default URL
    signer = provider.getSigner(0);
    kycListContract = new ethers.Contract(kycListContractAddress, kycListContractABI, signer);
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
            tbody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.dob}</td>
                    <td>${user.registeredBy}</td>
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
