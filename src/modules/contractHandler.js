import {BrowserProvider, Contract, parseEther} from "ethers";
import {CONTRACT_ADDRESS} from '/src/modules/addresses.js';

const YSC_ABI = [
  "function mint(uint256 amount) payable",
  "function mintPrice() view returns(uint256)",
  "function balanceOf(address account) view returns(uint256)"
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
  const signer = await getSignerFromModal(modal);
  const contract = new Contract(CONTRACT_ADDRESS, YSC_ABI, signer);

  return await contract.mintPrice();
}

export async function mint(amount, modal) {
  const signer = await getSignerFromModal(modal);
  const contract = new Contract(CONTRACT_ADDRESS, YSC_ABI, signer);
  const cost = await getMintPrice(modal);

  const options = {value: cost * BigInt(amount)};
  return await contract.mint(amount, options);
}

export async function getCurrentBalance(modal) {
  const signer = await getSignerFromModal(modal);
  const address = signer.address;

  const contract = new Contract(CONTRACT_ADDRESS, YSC_ABI, signer);
  return await contract.balanceOf(address);
}
