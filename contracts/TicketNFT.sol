// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ITicketNFT} from "./interfaces/ITicketNFT.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TicketNFT is ERC1155, ITicketNFT {
    // your code goes here (you can do it!)

    address public owner;

    constructor(string memory uri_) ERC1155(uri_) {
        // Making the owner variable payable means that this address is capable of receiving Ether. 
        owner = msg.sender;
    }

    // implement the mintFromMarketPlace function from the ITicketNFT interface
    // so that we can omit the mint implementation form ERC1155
    function mintFromMarketPlace(address to, uint256 nftId) override external {
        _mint(to, nftId, 1, "");
    }

}