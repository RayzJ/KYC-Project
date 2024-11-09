const ADMIN_CONTRACT_ADDRESS = "0xFe87d9e1121c371dEBd5C1B5b3D9A92391628A7F"; // Replace with your actual contract address
const ADMIN_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_kycStorage","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"approveKYC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"}],"name":"findKYCId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getKYCStatus","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"kycStorage","outputs":[{"internalType":"contract KYCStorage","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"rejectKYC","outputs":[],"stateMutability":"nonpayable","type":"function"}]
; // Replace with the ABI of your contract

async function connectToMetaMask() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(ADMIN_CONTRACT_ADDRESS, ADMIN_CONTRACT_ABI, signer);
            console.log("Connected to MetaMask successfully!");
            return contract;
        } catch (error) {
            console.error("User denied account access or an error occurred:", error);
        }
    } else {
        console.error("MetaMask is not installed. Please install MetaMask to use this application.");
    }
}

// Fetch and display pending users from local storage
function displayPendingUsers() {
    const tbody = document.querySelector('#pendingUsers tbody');
    tbody.innerHTML = ''; // Clear existing rows

    // Get pending users from localStorage
    const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers')) || [];

    // Populate the table with pending users
    pendingUsers.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.dob}</td>
                <td>${user.bankName}</td>
                <td>
                    <button onclick="acceptUser(${user.id})">Accept</button>
                    <button onclick="rejectUser(${user.id})">Reject</button>
                </td>
            </tr>
        `;
    });
}

// Accept user function
async function acceptUser(id) {
    let pendingUsers = JSON.parse(localStorage.getItem('pendingUsers')) || [];
    const user = pendingUsers.find(user => user.id === id);
    if (user) {
        let acceptedUsers = JSON.parse(localStorage.getItem('acceptedUsers')) || [];
        acceptedUsers.push(user);
        localStorage.setItem('acceptedUsers', JSON.stringify(acceptedUsers));
        pendingUsers = pendingUsers.filter(user => user.id !== id);
        localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
        alert(`User with ID ${id} has been accepted.`);
        displayPendingUsers();
    }
}

// Reject user function
async function rejectUser(id) {
    let pendingUsers = JSON.parse(localStorage.getItem('pendingUsers')) || [];
    const user = pendingUsers.find(user => user.id === id);
    if (user) {
        let rejectedUsers = JSON.parse(localStorage.getItem('rejectedUsers')) || [];
        rejectedUsers.push(user);
        localStorage.setItem('rejectedUsers', JSON.stringify(rejectedUsers));
        pendingUsers = pendingUsers.filter(user => user.id !== id);
        localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
        alert(`User with ID ${id} has been rejected.`);
        displayPendingUsers();
    }
}

// Initialize the contract connection on page load
document.addEventListener('DOMContentLoaded', displayPendingUsers);
