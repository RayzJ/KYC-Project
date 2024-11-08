const ADMIN_CONTRACT_ADDRESS = "0x12cB3156Cb787253622e895549D7EDa4Ad518b73"; // Replace with your deployed contract address
const ADMIN_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_kycStorage","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"approveKYC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"}],"name":"findKYCId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getKYCStatus","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"kycStorage","outputs":[{"internalType":"contract KYCStorage","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"rejectKYC","outputs":[],"stateMutability":"nonpayable","type":"function"}]
;
async function connectToContract() {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"); // Ganache URL
    const signer = provider.getSigner(0);
    const contract = new ethers.Contract(ADMIN_CONTRACT_ADDRESS, ADMIN_CONTRACT_ABI, signer);
    console.log("Connected to RemixVM successfully!");
    return contract;
  }
  
  // Find User ID by Name and DOB
  document.getElementById("findUserIdButton").addEventListener("click", async () => {
    const name = document.getElementById("findNameInput").value;
    const dob = document.getElementById("findDobInput").value;
  
    if (!name || !dob) {
      alert("Please enter both username and DOB.");
      return;
    }
    console.log("Searching for user with Name: ", name, "DOB: ", dob);
  
    try {
      const contract = await connectToContract();
      const userId = await contract.findKYCId(name, dob);
      console.log("Searching for user with Name: ", name, "DOB: ", dob);
      document.getElementById("userIdDisplay").innerText = `User ID: ${userId.toString()}`;
    } catch (error) {
      console.error("Error finding user ID:", error);
      alert("Failed to find user ID.");
    }
  });
  
  // Approve KYC
document.getElementById("approveButton").addEventListener("click", async () => {
  const userId = document.getElementById("userIdToApproveReject").value;

  if (!userId) {
    alert("Please enter a valid user ID.");
    return;
  }

  try {
    const contract = await connectToContract();

    // Check the admin address
    const adminAddress = await contract.admin();
    console.log("Admin Address:", adminAddress); // Log the admin address to verify

    // Ensure the signer is the admin (optional but recommended for debugging)
    const signerAddress = await contract.signer.getAddress();
    console.log("Signer Address:", signerAddress); // Log the signer address

    if (adminAddress.toLowerCase() !== signerAddress.toLowerCase()) {
      alert("You are not authorized to approve KYC.");
      return;
    }

    console.log("Approving KYC for user ID:", userId); // Debugging log
    const tx = await contract.approveKYC(userId);
    console.log("Transaction hash:", tx.hash); // Debugging log
    await tx.wait(); // Wait for the transaction to be mined
    alert(`User with ID ${userId} has been approved.`);
  } catch (error) {
    console.error("Error approving KYC:", error);
    alert("Failed to approve KYC.");
  }
 });

 // Reject KYC
  document.getElementById("rejectButton").addEventListener("click", async () => {
  const userId = document.getElementById("userIdToApproveReject").value;

  if (!userId) {
    alert("Please enter a valid user ID.");
    return;
  }

  try {
    const contract = await connectToContract();

    // Check the admin address
    const adminAddress = await contract.admin();
    console.log("Admin Address:", adminAddress); // Log the admin address to verify

    // Ensure the signer is the admin (optional but recommended for debugging)
    const signerAddress = await contract.signer.getAddress();
    console.log("Signer Address:", signerAddress); // Log the signer address

    if (adminAddress.toLowerCase() !== signerAddress.toLowerCase()) {
      alert("You are not authorized to reject KYC.");
      return;
    }

    console.log("Rejecting KYC for user ID:", userId); // Debugging log
    const tx = await contract.rejectKYC(userId);
    console.log("Transaction hash:", tx.hash); // Debugging log
    await tx.wait(); // Wait for the transaction to be mined
    alert(`User with ID ${userId} has been rejected.`);
  } catch (error) {
    console.error("Error rejecting KYC:", error);
    alert("Failed to reject KYC.");
  }
});

  
  
  // Get KYC Status
  document.getElementById("getStatusButton").addEventListener("click", async () => {
    const userId = document.getElementById("userIdForStatus").value;
  
    if (!userId) {
      alert("Please enter a valid user ID.");
      return;
    }
  
    try {
      const contract = await connectToContract();
      const status = await contract.getKYCStatus(userId);
      document.getElementById("statusDisplay").innerText = `KYC Status: ${status}`;
    } catch (error) {
      console.error("Error getting KYC status:", error);
      alert("Failed to get KYC status.");
    }
  });