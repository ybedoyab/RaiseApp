import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Button, Stack, Text, useToast } from '@chakra-ui/react';

const WalletConnect = () => {
  const { address, connectWallet, disconnectWallet } = useWeb3();
  const toast = useToast();

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast({
        title: 'Wallet conectada',
        description: `Has conectado tu wallet exitosamente`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error al conectar',
        description: `No se pudo conectar la wallet. Por favor, intenta de nuevo.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDisconnect = () => {
    try {
      disconnectWallet();
      toast({
        title: 'Wallet desconectada',
        description: 'Has desconectado tu wallet exitosamente',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error al desconectar',
        description: 'No se pudo desconectar la wallet. Por favor, intenta de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!address) {
    return (
      <Stack spacing={4} align="center" p={4}>
        <Text fontSize="lg" fontWeight="bold">
          Conecta tu wallet para continuar
        </Text>
        <Button colorScheme="blue" onClick={handleConnect}>
          Conectar Wallet
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={4} align="center" p={4}>
      <Text fontSize="lg" fontWeight="bold">
        Wallet Conectada
      </Text>
      <Text fontSize="sm" color="gray.500">
        {address}
      </Text>
      <Button colorScheme="red" onClick={handleDisconnect}>
        Desconectar Wallet
      </Button>
    </Stack>
  );
};

export default WalletConnect; 