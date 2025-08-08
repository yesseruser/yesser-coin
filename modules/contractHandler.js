import {BrowserProvider, Contract, parseEther} from "ethers";
import {CONTRACT_ADDRESS} from '/modules/addresses.js';

const YSC_ABI = [
  "function mint(uint256 amount) payable",
  "function mintPrice() view returns(uint256)"
];

async function getSignerFromModal(modal) {
  const provider = modal.getWalletProvider();
  const addressFrom = modal.getAddress();

  if (!provider) throw Error("No provider found");
  if (!addressFrom) throw Error("No address found");

  const ethersProvider = new BrowserProvider(provider);
  return await ethersProvider.getSigner();
}

export async function getMintPrice(modal) {
  signer = await getSignerFromModal(modal);
  const contract = new Contract(CONTRACT_ADDRESS, YSC_ABI, signer);

  return await contract.mintPrice();
}

export async function mint(amount, modal) {
  signer = await getSignerFromModal(modal);
  const contract = new Contract(CONTRACT_ADDRESS, YSC_ABI, signer);
  const cost = getMintPrice(modal);

  console.log(cost);
  const options = {value: cost * BigInt(amount)};
  return await contract.mint(amount, options);
}
