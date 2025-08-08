import {createAppKit} from "@reown/appkit";
import {EthersAdapter} from "@reown/appkit-adapter-ethers";
import {sepolia, mainnet} from "@reown/appkit/networks";
import {BrowserProvider, Contract, parseEther} from "ethers";
import {CONTRACT_ADDRESS} from '/modules/addresses.js';

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
  metadata: METADATA,
  projectId: PROJECT_ID,
  features: {
    swaps: false,
    onramp: false,
    email: false,
    socials: false,
  }
});

testBtn = document.getElementById("testBtn");

const YSC_ABI = [
  "function mint(uint256 amount) payable",
  "function mintPrice() view returns(uint256)"
]

testBtn.onclick = async function() {
  const provider = modal.getWalletProvider();
  const addressFrom = modal.getAddress();

  if (!provider) throw Error("No provider found");
  if (!addressFrom) throw Error("No address found");

  const ethersProvider = new BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();

  const contract = new Contract(CONTRACT_ADDRESS, YSC_ABI, signer);

  const cost = await contract.mintPrice();
  console.log(cost);
  const options = {value: cost};
  const receipt = await contract.mint(1, options);
  console.log("transaction sent.");
  await receipt.wait();
  console.log("transaction completed.");
}

