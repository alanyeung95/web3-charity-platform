// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserProfile {
    struct Profile {
        string username;
        string selfIntroduction;
        uint totalDonations;
    }

    mapping(address => Profile) private profiles;
    address[] private userAddresses;
    mapping(address => bool) private addedUserAddresses; // Track if a user is already in the array

    function setProfile(
        string memory _username,
        string memory _selfIntroduction
    ) public {
        addUserAddressIfNeeded(msg.sender);
        profiles[msg.sender] = Profile(
            _username,
            _selfIntroduction,
            profiles[msg.sender].totalDonations
        );
    }

    function updateDonation(address userAddress, uint amount) public {
        addUserAddressIfNeeded(userAddress);
        profiles[userAddress].totalDonations += amount;
    }

    function getProfile(
        address userAddress
    ) public view returns (Profile memory) {
        return profiles[userAddress];
    }

    function getUserAddresses() public view returns (address[] memory) {
        return userAddresses;
    }

    function addUserAddressIfNeeded(address userAddress) private {
        if (!addedUserAddresses[userAddress]) {
            userAddresses.push(userAddress);
            addedUserAddresses[userAddress] = true;
        }
    }
}
