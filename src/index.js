import {createAppKit} from "@reown/appkit";
import {EthersAdapter} from "@reown/appkit-adapter-ethers";
import {sepolia} from "@reown/appkit/networks";
import {mint} from "/src/modules/contractHandler.js";

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
