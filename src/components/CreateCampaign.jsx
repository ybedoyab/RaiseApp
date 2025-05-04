import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { contractService } from '../services/contractService';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  Heading,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';

const CreateCampaign = () => {
  const { address } = useWeb3();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fundingGoal: '',
    durationInDays: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address) {
      toast({
        title: 'Error',
        description: 'Por favor, conecta tu wallet primero',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const receipt = await contractService.createCampaign(
        formData.title,
        formData.description,
        formData.fundingGoal,
        formData.durationInDays
      );

      toast({
        title: 'Campaña creada',
        description: 'Tu campaña de inversión ha sido creada exitosamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        fundingGoal: '',
        durationInDays: ''
      });

    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la campaña. Por favor, intenta de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '7rem' }}>
      <Box maxW="600px" mx="auto" p={6}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Crear Emprendimiento para Inversión</Heading>
          <Text color="gray.600">
            Crea un nuevo emprendimiento para recibir inversiones
          </Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Título</FormLabel>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nombre de tu emprendimiento"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe tu emprendimiento y por qué necesitas inversión"
                  rows={4}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Meta de Financiamiento (ETH)</FormLabel>
                <NumberInput
                  min={0}
                  value={formData.fundingGoal}
                  onChange={(value) => handleNumberChange('fundingGoal', value)}
                >
                  <NumberInputField placeholder="Cantidad en ETH" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Duración (días)</FormLabel>
                <NumberInput
                  min={1}
                  value={formData.durationInDays}
                  onChange={(value) => handleNumberChange('durationInDays', value)}
                >
                  <NumberInputField placeholder="Número de días" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                isLoading={isLoading}
                loadingText="Creando campaña..."
              >
                Crear Campaña
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </div>
  );
};

export default CreateCampaign; 