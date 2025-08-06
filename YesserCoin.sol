// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
using Strings for uint256;
using Strings for address;

interface ERC20TransferInterface {
    function transferFrom(address from, address to, uint256 value) external returns(bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract YesserCoin is ERC20, Ownable, ERC20Burnable {
    address public constant OLD_CONTRACT_ADDRESS = 0x2D92DD421d4B262e48bc67AA8fcABF30b43929C0;
    ERC20TransferInterface public OldContract = ERC20TransferInterface(OLD_CONTRACT_ADDRESS);

    uint256 public constant MAX_SUPPLY = 1000000000000000000;
    uint256 public mintPrice = 1 gwei;
    bool public mintingEnabled = true;

    constructor(uint256 initialSupply)
        ERC20("YesserCoin", "YSC")
        Ownable(msg.sender)
    {
        require(
            initialSupply <= MAX_SUPPLY,
            "Initial supply exceeds maximum supply"
        );
        _mint(msg.sender, initialSupply);
    }

    function mint(uint256 amount) external payable {
        require(mintingEnabled, "Minting is disabled");
        require(msg.value >= amount * mintPrice, "Insufficient payment");
        require(
            MAX_SUPPLY >= totalSupply() + amount,
            "Total supply after transaction would exceed maximum supply"
        );
        _mint(msg.sender, amount);

        uint256 excess = msg.value - mintPrice;
        if (excess > 0) {
            (bool sent, ) = msg.sender.call{value: address(this).balance}("");
            require(sent, "Failed to send excess Ether");
        }
    }

    function migrate_old_tokens(uint256 amount) public {
        require(mintingEnabled, "Minting is disabled");

        require(
            MAX_SUPPLY >= totalSupply() + amount,
            "Total supply after transaction would exceed maximum supply"
        );

        require(OldContract.allowance(msg.sender, address(this)) >= amount, string.concat("Not enough allowance from the old contract. Call approve(", address(this).toHexString(), ", ", amount.toString(), ") on the old contract"));

        bool success = OldContract.transferFrom(msg.sender, OLD_CONTRACT_ADDRESS, amount);
        require(success, "Failed to transfer old tokens");
        _mint(msg.sender, amount);
    }

    function migrate_all_old_tokens() external {
        require(mintingEnabled, "Minting is disabled");
        uint256 balance = OldContract.balanceOf(msg.sender);
        require(balance > 0, "Old YSC balance must is not greater than 0");
        migrate_old_tokens(balance);
    }

    function get_current_supply() public view returns (uint256) {
        return totalSupply();
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    function toggleMintingEnabled() public onlyOwner {
        mintingEnabled = !mintingEnabled;
    }

    function forceMint(uint256 amount) external onlyOwner {
        require(totalSupply() + amount < MAX_SUPPLY, "Supply would exceed maximum");
        _mint(msg.sender, amount);
    }

    function claimMintFees() external onlyOwner {
        // payable(this.owner()).transfer(address(this).balance);
        (bool sent, ) = address(this.owner()).call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }
}
