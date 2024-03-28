// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserProfile {
    struct Profile {
        string username;
        string selfIntroduction;
        uint totalDonations;
        uint score;
        string photoURL;
    }

    mapping(address => Profile) private profiles;
    address[] private userAddresses;
    mapping(address => bool) private addedUserAddresses; // Track if a user is already in the array

    function setProfile(
        string memory _username,
        string memory _selfIntroduction,
        string memory _photoURL
    ) public {
        addUserAddressIfNeeded(msg.sender);
        profiles[msg.sender] = Profile(
            _username,
            _selfIntroduction,
            profiles[msg.sender].totalDonations,
            profiles[msg.sender].score,
            _photoURL
        );
    }

    function updateDonation(address userAddress, uint amount) public {
        addUserAddressIfNeeded(userAddress);
        profiles[userAddress].totalDonations += amount;
        profiles[userAddress].score += amount;
    }

    function increaseScore(address userAddress, uint amount) public {
        require(addedUserAddresses[userAddress], "User does not exist");
        profiles[userAddress].score += amount;
    }

    function resetScore(address userAddress) public {
        profiles[userAddress].score = 0;
    }

    function setPhotoURL(address userAddress, string memory _photoURL) public {
        profiles[userAddress].photoURL = _photoURL;
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
