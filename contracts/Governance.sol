// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Governance {
    struct NGO {
        string name;
        address walletAddress;
    }

    struct UserVote {
        address user;
        address ngoAddress;
    }

    NGO[] public ngos;
    // array to keep track of user addresses who have voted
    // as solidity's mappings do not allow us to iterate over keys.
    address[] public userAddresses;
    // mapping to check if a user address is already added
    mapping(address => bool) private addedUserAddresses;

    mapping(address => address) public userVote;

    constructor() {
        // Add two hardcoded NGOs
        addNGO("Yellow Peace", 0x43a12e3647FD7c9eE99524eB0361755e93D2A760);
        addNGO("Blue Cross", 0x073BdB6644aBB1b1bf21e699d6a7364804948fa3);
    }

    function addNGO(string memory name, address walletAddress) private {
        ngos.push(NGO(name, walletAddress));
    }

    function voteForNGO(uint ngoIndex) public {
        require(ngoIndex < ngos.length, "NGO does not exist");
        if (!addedUserAddresses[msg.sender]) {
            userAddresses.push(msg.sender);
            addedUserAddresses[msg.sender] = true;
        }
        userVote[msg.sender] = ngos[ngoIndex].walletAddress;
    }

    function getNGOs() public view returns (NGO[] memory) {
        return ngos;
    }

    function getAllNGOVotes()
        public
        view
        returns (NGO[] memory, uint[] memory)
    {
        uint[] memory voteCounts = new uint[](ngos.length);
        for (uint i = 0; i < ngos.length; i++) {
            uint count = 0;
            for (uint j = 0; j < userAddresses.length; j++) {
                if (userVote[userAddresses[j]] == ngos[i].walletAddress) {
                    count++;
                }
            }
            voteCounts[i] = count;
        }
        return (ngos, voteCounts);
    }

    function getUserVotes() public view returns (UserVote[] memory) {
        UserVote[] memory votes = new UserVote[](userAddresses.length);
        for (uint i = 0; i < userAddresses.length; i++) {
            votes[i] = UserVote({
                user: userAddresses[i],
                ngoAddress: userVote[userAddresses[i]]
            });
        }
        return votes;
    }
}
