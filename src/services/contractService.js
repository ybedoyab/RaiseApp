import { ethers } from 'ethers';
import InvestmentCampaignABI from '../contracts/InvestmentCampaign.json';

const CONTRACT_ADDRESS = '0x7F9644e5984f078AD8f2e610E310E4459665eB6C';

class ContractService {
  constructor() {
    this.contract = null;
    this.provider = null;
    this.signer = null;
  }

  async init() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask to use this feature');
    }

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      InvestmentCampaignABI.abi,
      this.signer
    );
  }

  async createCampaign(title, description, fundingGoal, durationInDays) {
    if (!this.contract) await this.init();
    
    console.log('Creating campaign with params:', {
      title,
      description,
      fundingGoal,
      durationInDays
    });
    
    const fundingGoalWei = ethers.utils.parseEther(fundingGoal.toString());
    console.log('Funding goal in Wei:', fundingGoalWei.toString());
    
    try {
      const tx = await this.contract.createCampaign(
        title,
        description,
        fundingGoalWei,
        durationInDays
      );
      console.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);
      
      // Get the campaign details after creation
      const campaignCount = await this.getCampaignCount();
      console.log('New campaign count:', campaignCount);
      
      const campaignDetails = await this.getCampaignDetails(campaignCount - 1);
      console.log('New campaign details:', campaignDetails);
      
      return receipt;
    } catch (error) {
      console.error('Error in createCampaign:', error);
      throw error;
    }
  }

  async invest(campaignId, amount) {
    if (!this.contract) await this.init();
    
    const amountWei = ethers.utils.parseEther(amount.toString());
    const tx = await this.contract.invest(campaignId, { value: amountWei });
    const receipt = await tx.wait();
    return receipt;
  }

  async claimFunds(campaignId) {
    if (!this.contract) await this.init();
    
    const tx = await this.contract.claimFunds(campaignId);
    const receipt = await tx.wait();
    return receipt;
  }

  async requestRefund(campaignId) {
    if (!this.contract) await this.init();
    
    const tx = await this.contract.requestRefund(campaignId);
    const receipt = await tx.wait();
    return receipt;
  }

  async getCampaignCount() {
    if (!this.contract) await this.init();
    const count = await this.contract.getCampaignCount();
    return count.toNumber();
  }

  async getCampaignDetails(campaignId) {
    if (!this.contract) await this.init();
    console.log('Getting details for campaign ID:', campaignId);
    
    try {
      const details = await this.contract.getCampaignDetails(campaignId);
      console.log('Raw campaign details from contract:', details);
      
      const formattedDetails = {
        id: campaignId,
        entrepreneur: details.entrepreneur,
        title: details.title,
        description: details.description,
        fundingGoal: details.fundingGoal,
        amountRaised: details.currentAmount,
        endTime: details.deadline,
        isActive: details.isActive,
        isFunded: details.isFunded,
        isClaimed: details.isClaimed
      };
      
      console.log('Formatted campaign details:', formattedDetails);
      return formattedDetails;
    } catch (error) {
      console.error('Error getting campaign details:', error);
      throw error;
    }
  }

  async getCampaignInvestments(campaignId) {
    if (!this.contract) await this.init();
    
    const investments = await this.contract.getCampaignInvestments(campaignId);
    return investments.map(inv => ({
      investor: inv.investor,
      amount: ethers.utils.formatEther(inv.amount),
      timestamp: new Date(inv.timestamp.toNumber() * 1000)
    }));
  }

  async getInvestorContribution(campaignId, investorAddress) {
    if (!this.contract) await this.init();
    
    const contribution = await this.contract.getInvestorContribution(campaignId, investorAddress);
    return ethers.utils.formatEther(contribution);
  }
}

export const contractService = new ContractService(); 