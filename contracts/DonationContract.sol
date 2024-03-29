// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
This approach offers a good balance by leveraging the benefits of a smart contract for logging and programmable actions, 
while also providing the flexibility and safety of not storing all the funds within the contract itself.
*/

contract DonationContract {
    address payable public moneyPoolAddress;
    address public owner;

    event DonationReceived(address indexed donor, uint amount);
    event FundsTransferredToNGO(address indexed ngoAddress, uint amount);
    event FundsTransferredToUser(address indexed userAddress, uint amount);

    constructor(address payable _moneyPoolAddress) {
        moneyPoolAddress = _moneyPoolAddress;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
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

    function claimPrizeV2(address payable to) public onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "Insufficient balance in contract");

        uint256 prizeAmount = contractBalance / 2;
        to.transfer(prizeAmount);
    }

    function transferToNGO(address payable ngoAddress) public onlyOwner {
        require(
            address(this).balance >= 0.0001 ether,
            "Insufficient funds in contract"
        );
        ngoAddress.transfer(0.0001 ether);
        emit FundsTransferredToNGO(ngoAddress, 0.0001 ether);
    }

    // transferToUser
    function transferToUser(address payable userAddress, uint amount) public {
        // uint amountInWei = amount * 1 ether;

        require(
            address(this).balance >= amount,
            "Insufficient funds in contract"
        );

        userAddress.transfer(amount);
        emit FundsTransferredToUser(userAddress, amount);
    }

    // a function to move all the money to moneyPoolAddress before we discard this contract
    function withdrawAllToMoneyPool() public {
        require(address(this).balance > 0, "No funds to withdraw");
        moneyPoolAddress.transfer(address(this).balance);
    }
}
