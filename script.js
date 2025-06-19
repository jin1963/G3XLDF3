
let web3;
let contract;
let user;
const contractAddress = "0x27d82cc200033d8ecf6b5558ebe60ca212338a4f";

window.addEventListener("load", async () => {
  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    user = accounts[0];
    document.getElementById("walletInfo").innerText = "✅ Connected: " + user;
    contract = new web3.eth.Contract(contractABI, contractAddress);
  } else {
    alert("Please install MetaMask.");
  }
});

async function stake() {
  const amount = document.getElementById("amount").value;
  const tier = document.getElementById("tier").value;
  if (!amount || isNaN(amount)) return alert("Invalid amount");
  const tokenAddr = await contract.methods.token().call();
  const token = new web3.eth.Contract([{ "name":"approve", "type":"function", "inputs":[{ "name":"_spender", "type":"address" },{ "name":"_value", "type":"uint256" }], "outputs":[], "stateMutability":"nonpayable" }], tokenAddr);
  const stakeAmt = web3.utils.toWei(amount, "ether");
  await token.methods.approve(contractAddress, stakeAmt).send({ from: user });
  await contract.methods.stake(stakeAmt, tier).send({ from: user });
  alert("✅ Staked " + amount + " G3X");
}

async function claim() {
  const stakeIndex = 0;
  await contract.methods.claimRewards(stakeIndex).send({ from: user });
  alert("🎉 Claimed successfully!");
}

async function unstake() {
  const stakeIndex = 0;
  await contract.methods.unstake(stakeIndex).send({ from: user });
  alert("🔓 Unstaked successfully!");
}
