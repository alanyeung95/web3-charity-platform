//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

// import "hardhat/donationContract.sol";

contract Gambling {
    address private owner;

    struct Prediction {
        uint256 num;
        uint256 time;
    }

    mapping(address => uint256) public balances;
    mapping(address => Prediction) public predictions;

    uint public revealTime;
    // address payable public moneyPool;
    uint public operationCost;

    constructor(uint _revealTime, address payable _money_pool) {
        owner = msg.sender;
        revealTime = _revealTime;
        // moneyPool = _money_pool;
        console.log("Deploying the Gambling contract. /n Owner: ", owner);
    }

    // function deposit_into_moneyPool() public payable {
    //     require(msg.value > 0, "Deposit amount must be greater than 0");
    //     moneyPool += msg.value;
    // }

    // function getMoneyPoolBalance() public view returns (uint) {
    //     return moneyPool.balance;
    // }

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
        predictions[msg.sender] = Prediction(
            _pre,
            block.timestamp + revealTime
        );
    }

    function revealResult(uint256 moneyPool) public returns (uint256, bool) {
        //wait for 10 mins
        //1 lower, 2 same, 3 higher
        require(
            predictions[msg.sender].time != 0,
            "You haven't started the prediction yet."
        );
        require(
            block.timestamp >= predictions[msg.sender].time,
            "Reveal time has not yet arrived."
        );
        uint8 result = 3;
        bool isCorrect = predictions[msg.sender].num == result;
        if (isCorrect) {
            uint256 reward = (balances[msg.sender] * 4) / 10;
            require(reward < moneyPool, "not enough amount in money pool");
            require(
                balances[msg.sender] + reward >= balances[msg.sender],
                "Integer overflow"
            );
            balances[msg.sender] = balances[msg.sender] + reward;
            // moneyPool.transferToTPlayer();
        } else {
            uint256 loss = (balances[msg.sender] * 8) / 10;
            // moneyPool.transfer(loss);
            uint256 cost = balances[msg.sender] - loss;
            operationCost += cost;
            balances[msg.sender] = 0;
        }
        predictions[msg.sender].num = 0;
        predictions[msg.sender].time = 0;
    }

    // function getmoneyPool() external view returns (uint256) {
    //     return getMoneyPoolBalance();
    // }

    function getUserBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
