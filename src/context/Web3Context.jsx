import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();

          setProvider(provider);
          setSigner(signer);
          setAddress(address);

          // Listen for account changes
          window.ethereum.on('accountsChanged', async (accounts) => {
            if (accounts.length === 0) {
              setAddress(null);
              setSigner(null);
            } else {
              const newSigner = provider.getSigner();
              const newAddress = await newSigner.getAddress();
              setSigner(newSigner);
              setAddress(newAddress);
            }
          });
        } catch (error) {
          console.error('Error initializing Web3:', error);
        }
      }
    };

    initWeb3();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.error('Please install MetaMask');
    }
  };

  // Nueva función para desconectar la wallet
  const disconnectWallet = () => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    // Opcional: limpiar cualquier otro estado relacionado
  };

  return (
    <Web3Context.Provider value={{ address, provider, signer, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
}; 