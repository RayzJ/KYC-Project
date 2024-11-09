// ABI and contract address from Remix deployment
const kycListContractABI = [];  // existing ABI
const kycListContractAddress = "0xD275F5De4Ca7c5DfED5175B7B8FDD38EB0244223"; // Replace with the actual deployed contract address

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
