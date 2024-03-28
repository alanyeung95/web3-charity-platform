//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./DonationContract.sol";
import "./Greeter.sol";

contract Gambling {
    address private owner;

    //  0 = lose, 1 = win
    event PredictionResult(
        address indexed user,
        int16 result,
        uint256 originalBet
    );

    struct Prediction {
        uint256 num;
        uint256 time;
        int256 price;
    }

    mapping(address => uint256) public balances; // in wei unit
    mapping(address => Prediction) public predictions;

    uint public revealTime;

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

    function depositAndPredict(uint8 _pre) external payable {
        require(msg.value > 0, "Deposit value must be greater than 0");

        // this checking may cause bugs due to the ether formatting i guess
        //require(
        //    balances[msg.sender] + msg.value >= balances[msg.sender],
        //    "Integer overflow"
        //);
        require(_pre == 1 || _pre == 2 || _pre == 3, "invalid prediction");
        // require(
        //     predictions[msg.sender].num == 0,
        //     "You have already started your prediction."
        // );
        balances[msg.sender] += msg.value;
        moneyPoolInstance.donateV2{value: msg.value}();
        predict(_pre);
    }

    function predict(uint8 _pre) internal {
        int256 latestPrice = greeterInstance.getLatestPrice();
        predictions[msg.sender] = Prediction(
            _pre,
            block.timestamp + revealTime,
            latestPrice
        );
    }

    function revealResult() public {
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
        uint256 originalBet = balances[msg.sender];

        if (latestPrice < pPrice) {
            result = 1;
        } else if (latestPrice > pPrice) {
            result = 3;
        } else {
            result = 2;
        }
        bool isCorrect = predictions[msg.sender].num == result;
        //if the user gets the right result, send reward to the user, send the cost to this contract.

        if (isCorrect) {
            uint256 reward = (balances[msg.sender] * 14) / 10;
            uint256 cost = (balances[msg.sender] * 2) / 10;
            require(
                (reward + cost) < getMoneyPoolBalance(),
                "not enough amount in money pool"
            );
            require(
                balances[msg.sender] + reward >= balances[msg.sender],
                "Integer overflow"
            );

            // transfer 20% of fund to operation team wallet address
            // but it is too complicated to implement right now
            /*
            moneyPoolInstance.transferToUser(
                payable(address(moneyPoolAddress)),
                cost
            );
            */
            moneyPoolInstance.transferToUser(payable(msg.sender), reward);
            emit PredictionResult(msg.sender, 1, originalBet);
        } else {
            // doing nothing, as player already deposit money into the pool
            emit PredictionResult(msg.sender, 0, originalBet);
        }

        balances[msg.sender] = 0;
        predictions[msg.sender].num = 0;
        predictions[msg.sender].time = 0;
    }

    function getMoneyPoolBalance() public view returns (uint) {
        return moneyPoolAddress.balance;
    }

    function getUserBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
