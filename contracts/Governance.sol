// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Governance {
    struct NGO {
        string name;
        address walletAddress;
    }

    NGO[] public ngos;
    mapping(address => uint) public votes;

    constructor() {
        // Add two hardcoded NGOs with initial votes
        addNGO("Yellow Peace", 0x43a12e3647FD7c9eE99524eB0361755e93D2A760, 3);
        addNGO("Blue Cross", 0x073BdB6644aBB1b1bf21e699d6a7364804948fa3, 1);
    }

    function addNGO(
        string memory name,
        address walletAddress,
        uint initialVotes
    ) private {
        ngos.push(NGO(name, walletAddress));
        votes[walletAddress] = initialVotes;
    }

    function voteForNGO(uint ngoIndex) public {
        require(ngoIndex < ngos.length, "NGO does not exist");
        votes[ngos[ngoIndex].walletAddress]++;
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
            voteCounts[i] = votes[ngos[i].walletAddress];
        }
        return (ngos, voteCounts);
    }
}
