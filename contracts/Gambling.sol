//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./DonationContract.sol";
import "./Greeter.sol";

// import "hardhat/donationContract.sol";

contract Gambling {
    address private owner;

    struct Prediction {
        uint256 num;
        uint256 time;
        int256 price;
    }

    mapping(address => uint256) public balances;
    mapping(address => Prediction) public predictions;

    uint public revealTime;
    uint public operationCost;

    address payable public moneyPoolAddress;
    DonationContract moneyPoolInstance;

    address public greeterAddress;
    Greeter greeterInstance;

    constructor(
        address payable _moneyPool,
        address _greeter,
        uint _revealTime
    ) {
        owner = msg.sender;
        revealTime = _revealTime;
        moneyPoolAddress = _moneyPool;
        moneyPoolInstance = DonationContract(moneyPoolAddress);
        greeterAddress = _greeter;
        greeterInstance = Greeter(greeterAddress);
        console.log("Deploying the Gambling contract. /n Owner: ", owner);
    }

    function addMoneyToContract() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
    }

    function deposit() external payable {
        require(msg.value > 0, "Deposit value must be greater than 0");
        require(
            balances[msg.sender] + msg.value >= balances[msg.sender],
            "Integer overflow"
        );
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) public {
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function predict(uint8 _pre) public {
        require(_pre == 1 || _pre == 2 || _pre == 3, "invalid prediction");
        require(balances[msg.sender] > 0, "unsifficient amount.");
        require(
            predictions[msg.sender].num == 0,
            "You have already started your prediction."
        );
        int256 latestPrice = greeterInstance.getLatestPrice();
        predictions[msg.sender] = Prediction(
            _pre,
            block.timestamp + revealTime,
            latestPrice
        );
    }

    function revealResult() public returns (uint256, int256, bool) {
        //wait for 10 mins
        require(
            predictions[msg.sender].time != 0,
            "You haven't started the prediction yet."
        );
        require(
            block.timestamp >= predictions[msg.sender].time,
            "Reveal time has not yet arrived."
        );
        uint8 result = 0;
        int256 latestPrice = greeterInstance.getLatestPrice();
        int256 pPrice = predictions[msg.sender].price;
        if (latestPrice < pPrice) {
            result = 1;
        } else if (latestPrice > pPrice) {
            result = 3;
        } else {
            result = 2;
        }
        bool isCorrect = predictions[msg.sender].num == result;
        uint256 reward = 0;
        // users guess the worng result, donate the money to money pool
        if (!isCorrect) {
            uint256 loss = (balances[msg.sender] * 8) / 10;
            moneyPoolInstance.donateV2{value: loss}();
            uint256 cost = balances[msg.sender] - loss;
            operationCost += cost;
            balances[msg.sender] = 0;
        }
        //users guess the right result, front-end calls transferToUser
        else {
            reward = (balances[msg.sender] * 4) / 10;
            require(
                reward < getMoneyPoolBalance(),
                "not enough amount in money pool"
            );
            require(
                balances[msg.sender] + reward >= balances[msg.sender],
                "Integer overflow"
            );
            moneyPoolInstance.transferToUser(payable(msg.sender), reward);
            balances[msg.sender] = balances[msg.sender] + reward;
        }
        predictions[msg.sender].num = 0;
        predictions[msg.sender].time = 0;
        return (reward, pPrice, isCorrect);
    }

    function getMoneyPoolBalance() public view returns (uint) {
        return moneyPoolAddress.balance;
    }

    function getUserBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
