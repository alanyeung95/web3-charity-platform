// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
This approach offers a good balance by leveraging the benefits of a smart contract for logging and programmable actions, 
while also providing the flexibility and safety of not storing all the funds within the contract itself.
*/

contract DonationContract {
    address payable public moneyPoolAddress;

    event DonationReceived(address indexed donor, uint amount);

    constructor(address payable _moneyPoolAddress) {
        moneyPoolAddress = _moneyPoolAddress;
    }

    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        moneyPoolAddress.transfer(msg.value); // forward the donation to the money pool
        emit DonationReceived(msg.sender, msg.value);
    }
}
