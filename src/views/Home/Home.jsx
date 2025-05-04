import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import { contractService } from '../../services/contractService';
import {
  Box,
  Button,
  Heading,
  Text,
  Container,
  Stack,
  SimpleGrid,
  Progress,
  Badge,
  useColorModeValue,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import Contact from '../../components/Contact/Contact'
import './home.css'
import About from '../../components/About/About'
import Nav from '../../components/Nav/Nav'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Carousel from '../../components/Carousel/Carousel'

const Home = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { address } = useWeb3();

  useEffect(() => {
    loadFeaturedCampaigns();
  }, []);

  const loadFeaturedCampaigns = async () => {
    try {
      setLoading(true);
      const campaignCount = await contractService.getCampaignCount();
      const campaigns = [];

      // Get the last 3 active campaigns
      for (let i = Math.max(0, campaignCount - 3); i < campaignCount; i++) {
        try {
          const campaign = await contractService.getCampaignDetails(i);
          const now = Math.floor(Date.now() / 1000);
          // Only include active campaigns
          if (campaign.endTime.toNumber() > now) {
            campaigns.push({
              id: i,
              ...campaign
            });
          }
        } catch (err) {
          console.error('Error cargando campaña destacada', i, err);
        }
      }

      setFeaturedCampaigns(campaigns);
    } catch (error) {
      console.error('Error loading featured campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCampaignStatus = (campaign) => {
    const now = Math.floor(Date.now() / 1000);
    if (campaign.endTime.toNumber() < now) {
      return campaign.amountRaised.gte(campaign.fundingGoal) ? 'Completada' : 'Fallida';
    }
    return 'Activa';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Activa':
        return 'green';
      case 'Completada':
        return 'blue';
      case 'Fallida':
        return 'red';
      default:
        return 'gray';
    }
  };

  const calculateProgress = (amountRaised, fundingGoal) => {
    const raised = parseFloat(ethers.utils.formatEther(amountRaised));
    const goal = parseFloat(ethers.utils.formatEther(fundingGoal));
    return (raised / goal) * 100;
  };

  return (
    <div className='page-container fade-in'>
      <Nav />
      <Header />
      
      {/* Featured Campaigns Section */}
      <Container maxW={'7xl'} py={16} bg="transparent">
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mb={12}>
          <Heading fontSize={'3xl'}>Campañas Destacadas</Heading>
          <Text color={'gray.600'} fontSize={'xl'}>
            Descubre las últimas campañas de inversión activas
          </Text>
        </Stack>

        {loading ? (
          <Text textAlign="center">Cargando campañas destacadas...</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {featuredCampaigns.map((campaign) => {
              const status = getCampaignStatus(campaign);
              const progress = calculateProgress(campaign.amountRaised, campaign.fundingGoal);
              
              return (
                <Box
                  key={campaign.id}
                  className="modern-card"
                  p={6}
                >
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Heading size="md">{campaign.title}</Heading>
                      <Badge colorScheme={getStatusColor(status)}>{status}</Badge>
                    </HStack>
                    
                    <Text noOfLines={2}>{campaign.description}</Text>
                    
                    <Box>
                      <Text mb={2}>Progreso</Text>
                      <Progress value={progress} colorScheme="blue" />
                    </Box>
                    
                    <HStack justify="space-between">
                      <Text>Meta: {ethers.utils.formatEther(campaign.fundingGoal)} ETH</Text>
                      <Text>Recaudado: {ethers.utils.formatEther(campaign.amountRaised)} ETH</Text>
                    </HStack>
                    
                    <Button
                      as={RouterLink}
                      to={`/campaigns/${campaign.id}`}
                      className="modern-button"
                      colorScheme="blue"
                      variant="outline"
                    >
                      Ver Detalles
                    </Button>
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Container>

      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;