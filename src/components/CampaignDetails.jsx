import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { contractService } from '../services/contractService';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Progress,
  Badge,
  useToast,
  HStack,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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

const CampaignDetails = () => {
  const { id } = useParams();
  const { address } = useWeb3();
  const toast = useToast();
  const [campaign, setCampaign] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadCampaignDetails();
  }, [id]);

  const loadCampaignDetails = async () => {
    try {
      setLoading(true);
      const campaignDetails = await contractService.getCampaignDetails(id);
      const campaignInvestments = await contractService.getCampaignInvestments(id);
      
      setCampaign({
        id,
        ...campaignDetails
      });
      setInvestments(campaignInvestments);
    } catch (error) {
      console.error('Error loading campaign details:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los detalles de la campaña',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    try {
      await contractService.invest(id, investmentAmount);
      toast({
        title: 'Inversión exitosa',
        description: 'Has invertido en la campaña exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
      loadCampaignDetails(); // Reload campaign details
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

  const handleClaimFunds = async () => {
    try {
      await contractService.claimFunds(id);
      toast({
        title: 'Fondos reclamados',
        description: 'Has reclamado los fondos exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      loadCampaignDetails();
    } catch (error) {
      console.error('Error claiming funds:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron reclamar los fondos',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRequestRefund = async () => {
    try {
      await contractService.requestRefund(id);
      toast({
        title: 'Reembolso solicitado',
        description: 'Has solicitado el reembolso exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      loadCampaignDetails();
    } catch (error) {
      console.error('Error requesting refund:', error);
      toast({
        title: 'Error',
        description: 'No se pudo solicitar el reembolso',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getCampaignStatus = () => {
    if (!campaign) return '';
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

  if (loading) {
    return <Text>Cargando detalles de la campaña...</Text>;
  }

  if (!campaign) {
    return <Text>No se encontró la campaña</Text>;
  }

  const status = getCampaignStatus();
  const progress = (campaign.amountRaised.toNumber() / campaign.fundingGoal.toNumber()) * 100;
  const isCreator = campaign.creator.toLowerCase() === address?.toLowerCase();
  const hasInvested = investments.some(inv => inv.investor.toLowerCase() === address?.toLowerCase());

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">{campaign.title}</Heading>
          <Badge colorScheme={getStatusColor(status)} fontSize="md" px={3} py={1}>
            {status}
          </Badge>
        </HStack>

        <Text fontSize="lg">{campaign.description}</Text>

        <Box>
          <Text mb={2}>Progreso de la campaña</Text>
          <Progress value={progress} colorScheme="blue" size="lg" />
          <HStack justify="space-between" mt={2}>
            <Text>Meta: {ethers.utils.formatEther(campaign.fundingGoal)} ETH</Text>
            <Text>Recaudado: {ethers.utils.formatEther(campaign.amountRaised)} ETH</Text>
          </HStack>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>Detalles de la campaña</Heading>
          <VStack align="stretch" spacing={2}>
            <Text>Creador: {campaign.creator}</Text>
            <Text>Fecha de inicio: {new Date(campaign.startTime.toNumber() * 1000).toLocaleDateString()}</Text>
            <Text>Fecha de finalización: {new Date(campaign.endTime.toNumber() * 1000).toLocaleDateString()}</Text>
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>Inversiones</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Inversor</Th>
                <Th isNumeric>Cantidad (ETH)</Th>
                <Th>Fecha</Th>
              </Tr>
            </Thead>
            <Tbody>
              {investments.map((investment, index) => (
                <Tr key={index}>
                  <Td>{investment.investor}</Td>
                  <Td isNumeric>{ethers.utils.formatEther(investment.amount)}</Td>
                  <Td>{new Date(investment.timestamp.toNumber() * 1000).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <HStack spacing={4}>
          {status === 'Activa' && !isCreator && (
            <Button colorScheme="blue" onClick={onOpen}>
              Invertir
            </Button>
          )}
          
          {status === 'Completada' && isCreator && (
            <Button colorScheme="green" onClick={handleClaimFunds}>
              Reclamar Fondos
            </Button>
          )}
          
          {status === 'Fallida' && hasInvested && (
            <Button colorScheme="red" onClick={handleRequestRefund}>
              Solicitar Reembolso
            </Button>
          )}
        </HStack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invertir en {campaign.title}</ModalHeader>
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
  );
};

export default CampaignDetails; 