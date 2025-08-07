import {createAppKit} from "@reown/appkit";
import {EthersAdapter} from "@reown/appkit-adapter-ethers";
import {sepolia} from "@reown/appkit/networks";
import {BrowserProvider, Contract, parseEther} from "ethers";
import '/modules/addresses.js';

const PROJECT_ID = "50f3aefeae0553f61bd9321167d87e8f";

const METADATA = {
  name: "YesserCoin Website",
  description: "A website for YesserCoin",
  url: "https://yesseruser.github.io/yesser-coin",
  icons: ["https://avatars.githubusercontent.com/u/67008763"]
};

const modal = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [sepolia],
  defaultChain: sepolia,
  metadata: METADATA,
  projectId: PROJECT_ID,
  features: {
    swaps: false,
    onramp: false,
    email: false,
    socials: false,
  }
});

const provider = await modal.subscribeProviders((state) => {
  return state["eip155"];
});

const addressFrom = await modal.subscribeAccount((state) => {
  return state;
});

testBtn = document.getElementById("testBtn");

testBtn.onclick = async function() {
  if (!provider) throw Error("No provider found");
  if (!addressFrom) throw Error("No address found");

  const tx = {
    from: addressFrom,
    to: "0x93Ff13F9Bb2A6909CB5Ab1BE7c9Bf2295294EfFf",
    value: parseEther("0.0001"),
  };
  const ethersProvider = new BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();
  const transax = await signer.sendTransaction(tx);
  console.log("transaction:", transax);
}

