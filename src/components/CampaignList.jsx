import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import { contractService } from '../services/contractService';
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Progress,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel
} from '@chakra-ui/react';

const CampaignList = () => {
  const { address } = useWeb3();
  const toast = useToast();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      console.log('Llamando a getCampaignCount...');
      const campaignCount = await contractService.getCampaignCount();
      console.log('Cantidad de campañas:', campaignCount);
      const loadedCampaigns = [];

      for (let i = 0; i < campaignCount; i++) {
        try {
          const campaign = await contractService.getCampaignDetails(i);
          console.log('Campaña cargada:', campaign);
          loadedCampaigns.push({
            id: i,
            ...campaign
          });
        } catch (err) {
          console.error('Error cargando campaña', i, err);
        }
      }

      setCampaigns(loadedCampaigns);
      console.log('Campañas finales:', loadedCampaigns);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las campañas',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    if (!selectedCampaign) return;

    try {
      await contractService.invest(selectedCampaign.id, investmentAmount);
      toast({
        title: 'Inversión exitosa',
        description: 'Has invertido en la campaña exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
      loadCampaigns(); // Reload campaigns to update amounts
    } catch (error) {
      console.error('Error investing:', error);
      toast({
        title: 'Error',
        description: 'No se pudo realizar la inversión',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openInvestModal = (campaign) => {
    setSelectedCampaign(campaign);
    setInvestmentAmount('');
    onOpen();
  };

  const getCampaignStatus = (campaign) => {
    const now = Math.floor(Date.now() / 1000);
    if (campaign.endTime.lt(now)) {
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
    if (fundingGoal.isZero()) return 0;
    return amountRaised.mul(100).div(fundingGoal).toNumber();
  };

  return (
    <div style={{ paddingTop: '7rem' }}>
      <Box p={6}>
        <Heading mb={6}>Campañas de Inversión</Heading>
        
        {loading ? (
          <Text>Cargando campañas...</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {campaigns.map((campaign) => {
              const status = getCampaignStatus(campaign);
              const progress = calculateProgress(campaign.amountRaised, campaign.fundingGoal);
              
              return (
                <Box
                  key={campaign.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={4}
                  _hover={{ shadow: 'md' }}
                >
                  <VStack align="stretch" spacing={3}>
                    <Heading size="md">{campaign.title}</Heading>
                    <Text noOfLines={2}>{campaign.description}</Text>
                    
                    <HStack justify="space-between">
                      <Text>Meta: {ethers.utils.formatEther(campaign.fundingGoal)} ETH</Text>
                      <Badge colorScheme={getStatusColor(status)}>{status}</Badge>
                    </HStack>
                    
                    <Box>
                      <Text mb={2}>Progreso</Text>
                      <Progress value={progress} colorScheme="blue" />
                    </Box>
                    
                    <Text>
                      Recaudado: {ethers.utils.formatEther(campaign.amountRaised)} ETH
                    </Text>
                    
                    <Button
                      colorScheme="blue"
                      onClick={() => openInvestModal(campaign)}
                      isDisabled={status !== 'Activa'}
                    >
                      Invertir
                    </Button>
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>
        )}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Invertir en {selectedCampaign?.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Cantidad a invertir (ETH)</FormLabel>
                  <NumberInput
                    min={0}
                    value={investmentAmount}
                    onChange={(value) => setInvestmentAmount(value)}
                  >
                    <NumberInputField placeholder="Cantidad en ETH" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                
                <Button
                  colorScheme="blue"
                  width="full"
                  onClick={handleInvest}
                  isDisabled={!investmentAmount}
                >
                  Confirmar Inversión
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </div>
  );
};

export default CampaignList; 