// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserProfile {
    struct Profile {
        string username;
        string selfIntroduction;
        uint totalDonations;
    }

    mapping(address => Profile) private profiles;

    function setProfile(
        string memory _username,
        string memory _selfIntroduction
    ) public {
        Profile storage profile = profiles[msg.sender];
        profile.username = _username;
        profile.selfIntroduction = _selfIntroduction;
    }

    function updateDonation(address userAddress, uint amount) public {
        // require(msg.sender == owner, "Only owner can update donations");
        profiles[userAddress].totalDonations += amount;
    }

    function getProfile(
        address userAddress
    ) public view returns (Profile memory) {
        return profiles[userAddress];
    }
}
