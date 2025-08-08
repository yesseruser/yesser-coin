import {createAppKit} from "@reown/appkit";
import {EthersAdapter} from "@reown/appkit-adapter-ethers";
import {sepolia} from "@reown/appkit/networks";
import {getMintPrice, mint} from "/src/modules/contractHandler.js";
import {formatEther} from "ethers";

const PROJECT_ID = "50f3aefeae0553f61bd9321167d87e8f";

const METADATA = {
  name: "YesserCoin Website",
  description: "A website for YesserCoin",
  url: "https://yesseruser.github.io/yesser-coin/mint",
  icons: ["https://avatars.githubusercontent.com/u/67008763"]
};

const modal = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [sepolia],
  metadata: METADATA,
  projectId: PROJECT_ID,
  features: {
    swaps: false,
    onramp: false,
    email: false,
    socials: false,
  }
});

let mintPrice;
const amountInput = document.getElementById("amountInput");
const mintCostDiv = document.getElementById("mintCost");
const mintBtn = document.getElementById("mintBtn");

modal.subscribeProviders(async (state) => {
  const provider = state["eip155"];

  if (provider) {
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "";
    document.getElementById("step3").style.display = "none";
    document.getElementById("step4").style.display = "none";
    mintPrice = await getMintPrice(modal);
    mintCostDiv.textContent = formatEther(mintPrice * BigInt(amountInput.value * 100)) + " ETH + gas fees";
  } else {
    document.getElementById("step1").style.display = "";
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "none";
    document.getElementById("step4").style.display = "none";
  }
});

document.getElementById("connectWalletBtn").onclick = function() {
  modal.open({ view: "Connect", namespace: "eip155" });
}

amountInput.onchange = function() {
  mintCostDiv.textContent = formatEther(mintPrice * BigInt(amountInput.value * 100)) + " ETH + gas fees";
};

mintBtn.onclick = async function() {
  const receipt = await mint(amountInput.value * 100, modal)
  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "";
  await receipt.wait();
  console.log(receipt);
  document.getElementById("step3").style.display = "none";
  document.getElementById("step4").style.display = "";
}
