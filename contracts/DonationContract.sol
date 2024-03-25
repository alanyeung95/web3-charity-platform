// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
This approach offers a good balance by leveraging the benefits of a smart contract for logging and programmable actions, 
while also providing the flexibility and safety of not storing all the funds within the contract itself.
*/

contract DonationContract {
    address payable public moneyPoolAddress;

    event DonationReceived(address indexed donor, uint amount);
    event FundsTransferredToNGO(address indexed ngoAddress, uint amount);
    event FundsTransferredToUser(address indexed userAddress, uint amount);

    constructor(address payable _moneyPoolAddress) {
        moneyPoolAddress = _moneyPoolAddress;
    }

    // user to money pool
    function donateV2() external payable {
        //require(msg.value > 0, "Donation must be greater than 0");
        // Funds are now kept within the contract
        emit DonationReceived(msg.sender, msg.value);
    }

    function claimPrize(address to) public {
        //require(msg.sender == owner, "Only owner can claim the prize");
        require(
            address(this).balance >= 0.05 ether,
            "Insufficient balance in contract"
        );

        payable(to).transfer(0.05 ether);
    }

    function transferToNGO(address payable ngoAddress) public {
        require(
            address(this).balance >= 0.001 ether,
            "Insufficient funds in contract"
        );
        ngoAddress.transfer(0.001 ether);
        emit FundsTransferredToNGO(ngoAddress, 0.001 ether);
    }

    // transferToUser
    function transferToUser(address payable userAddress, uint amount) public {
        uint amountInWei = amount * 1 ether;

        require(
            address(this).balance >= amountInWei,
            "Insufficient funds in contract"
        );

        userAddress.transfer(amountInWei);
        emit FundsTransferredToUser(userAddress, amountInWei);
    }

    // a function to move all the money to moneyPoolAddress before we discard this contract
    function withdrawAllToMoneyPool() public {
        require(address(this).balance > 0, "No funds to withdraw");
        moneyPoolAddress.transfer(address(this).balance);
    }
}
