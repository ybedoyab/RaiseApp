// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract InvestmentCampaign is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _campaignIds;

    struct Campaign {
        uint256 id;
        address payable entrepreneur;
        string title;
        string description;
        uint256 fundingGoal;
        uint256 currentAmount;
        uint256 deadline;
        bool isActive;
        bool isFunded;
        bool isClaimed;
    }

    struct Investment {
        address investor;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Investment[]) public campaignInvestments;
    mapping(uint256 => mapping(address => uint256)) public investorContributions;

    event CampaignCreated(uint256 indexed campaignId, address indexed entrepreneur, uint256 fundingGoal);
    event InvestmentMade(uint256 indexed campaignId, address indexed investor, uint256 amount);
    event CampaignFunded(uint256 indexed campaignId);
    event FundsClaimed(uint256 indexed campaignId, address indexed entrepreneur, uint256 amount);
    event RefundIssued(uint256 indexed campaignId, address indexed investor, uint256 amount);

    constructor() {}

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _fundingGoal,
        uint256 _durationInDays
    ) external returns (uint256) {
        require(_fundingGoal > 0, "Funding goal must be greater than 0");
        require(_durationInDays > 0, "Duration must be greater than 0");

        _campaignIds.increment();
        uint256 campaignId = _campaignIds.current();

        campaigns[campaignId] = Campaign({
            id: campaignId,
            entrepreneur: payable(msg.sender),
            title: _title,
            description: _description,
            fundingGoal: _fundingGoal,
            currentAmount: 0,
            deadline: block.timestamp + (_durationInDays * 1 days),
            isActive: true,
            isFunded: false,
            isClaimed: false
        });

        emit CampaignCreated(campaignId, msg.sender, _fundingGoal);
        return campaignId;
    }

    function invest(uint256 _campaignId) external payable nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign is not active");
        require(block.timestamp <= campaign.deadline, "Campaign has ended");
        require(msg.value > 0, "Investment amount must be greater than 0");

        campaign.currentAmount += msg.value;
        investorContributions[_campaignId][msg.sender] += msg.value;

        campaignInvestments[_campaignId].push(Investment({
            investor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        emit InvestmentMade(_campaignId, msg.sender, msg.value);

        if (campaign.currentAmount >= campaign.fundingGoal) {
            campaign.isFunded = true;
            campaign.isActive = false;
            emit CampaignFunded(_campaignId);
        }
    }

    function claimFunds(uint256 _campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.entrepreneur, "Only entrepreneur can claim funds");
        require(campaign.isFunded, "Campaign is not funded");
        require(!campaign.isClaimed, "Funds already claimed");

        campaign.isClaimed = true;
        uint256 amount = campaign.currentAmount;
        campaign.currentAmount = 0;

        (bool success, ) = campaign.entrepreneur.call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsClaimed(_campaignId, campaign.entrepreneur, amount);
    }

    function requestRefund(uint256 _campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp > campaign.deadline, "Campaign is still active");
        require(!campaign.isFunded, "Campaign was successful");
        require(investorContributions[_campaignId][msg.sender] > 0, "No investment found");

        uint256 refundAmount = investorContributions[_campaignId][msg.sender];
        investorContributions[_campaignId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Transfer failed");

        emit RefundIssued(_campaignId, msg.sender, refundAmount);
    }

    function getCampaignDetails(uint256 _campaignId) external view returns (
        address entrepreneur,
        string memory title,
        string memory description,
        uint256 fundingGoal,
        uint256 currentAmount,
        uint256 deadline,
        bool isActive,
        bool isFunded,
        bool isClaimed
    ) {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.entrepreneur,
            campaign.title,
            campaign.description,
            campaign.fundingGoal,
            campaign.currentAmount,
            campaign.deadline,
            campaign.isActive,
            campaign.isFunded,
            campaign.isClaimed
        );
    }

    function getCampaignCount() public view returns (uint256) {
        return _campaignIds.current();
    }
    
    function getInvestorContribution(uint256 _campaignId, address _investor) external view returns (uint256) {
        return investorContributions[_campaignId][_investor];
    }
} 