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
      console.log('Llamando a getCampaignCount...');
      const campaignCount = await contractService.getCampaignCount();
      console.log('Cantidad de campañas:', campaignCount);
      const campaigns = [];

      // Get the last 3 active campaigns
      for (let i = Math.max(0, campaignCount - 3); i < campaignCount; i++) {
        try {
          const campaign = await contractService.getCampaignDetails(i);
          console.log('Campaña destacada cargada:', campaign);
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
      console.log('Campañas destacadas finales:', campaigns);
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

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}
      >
        <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
          <Stack spacing={4} align={'center'} textAlign={'center'}>
            <Heading
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
              lineHeight={'110%'}
            >
              Invierte en el futuro de{' '}
              <Text as={'span'} color={'blue.400'}>
                emprendimientos
              </Text>
            </Heading>
            <Text color={'gray.500'} maxW={'3xl'}>
              Descubre y apoya proyectos innovadores. Conecta con emprendedores y
              forma parte de su éxito a través de inversiones directas.
            </Text>
            <Stack spacing={6} direction={'row'}>
              <Button
                as={RouterLink}
                to="/campaigns"
                rounded={'full'}
                px={6}
                colorScheme={'blue'}
                bg={'blue.400'}
                _hover={{ bg: 'blue.500' }}
              >
                Explorar Campañas
              </Button>
              {address && (
                <Button
                  as={RouterLink}
                  to="/campaigns/create"
                  rounded={'full'}
                  px={6}
                >
                  Crear Campaña
                </Button>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Featured Campaigns Section */}
      <Container maxW={'7xl'} py={16}>
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
              const progress = (campaign.amountRaised.toNumber() / campaign.fundingGoal.toNumber()) * 100;
              
              return (
                <Box
                  key={campaign.id}
                  bg={useColorModeValue('white', 'gray.800')}
                  boxShadow={'xl'}
                  rounded={'md'}
                  overflow={'hidden'}
                  p={6}
                  _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s ease' }}
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
    </Box>
  );
};

export default Home;