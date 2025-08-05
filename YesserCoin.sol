// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YesserCoin is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000000000000000;
    uint256 public currentSupply = 0;
    uint256 public mintPrice = 1 gwei;

    constructor(uint256 initialSupply)
        ERC20("YesserCoin", "YSC")
        Ownable(msg.sender)
    {
        require(
            initialSupply <= MAX_SUPPLY,
            "Initial supply exceeds maximum supply"
        );
        _mint(msg.sender, initialSupply);
        currentSupply += initialSupply;
    }

    function mint(uint256 amount) external payable {
        require(msg.value >= amount * mintPrice, "Insufficient payment");
        require(
            MAX_SUPPLY >= currentSupply + amount,
            "Total supply after transaction would exceed maximum supply"
        );
        _mint(msg.sender, amount);
    }

    function get_current_supply() public view returns (uint256) {
        return currentSupply;
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    function claimMintFees() external onlyOwner {
        // payable(this.owner()).transfer(address(this).balance);
        (bool sent, ) = address(this.owner()).call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}
