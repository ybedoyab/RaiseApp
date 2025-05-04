import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import './WalletSetup.css';

const WalletSetup = () => {
  const { account, active, isConnecting, error, connectWallet, disconnectWallet } = useWeb3();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleSaveWallet = async () => {
    if (!active || !account) {
      setSaveError('Please connect your wallet first');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Aquí puedes implementar la lógica para guardar la wallet en el backend
      // Por ejemplo, podrías hacer una llamada a la API para actualizar el perfil del usuario
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('User not found');
      }

      // TODO: Implementar la llamada a la API para guardar la wallet
      // await apiService.updateUserWallet(user.id, account);
      
      alert('Wallet connected successfully!');
    } catch (error) {
      console.error('Error saving wallet:', error);
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="wallet-setup">
      <h2>Connect Your Wallet</h2>
      <p className="description">
        Connect your wallet to enable Web3 features like making investments or receiving funds.
      </p>

      <div className="wallet-connect">
        {!active ? (
          <div className="wallet-buttons">
            <button
              onClick={() => connectWallet('injected')}
              disabled={isConnecting}
              className="connect-button"
            >
              {isConnecting ? 'Connecting...' : 'Connect MetaMask/Core'}
            </button>
            <button
              onClick={() => connectWallet('walletconnect')}
              disabled={isConnecting}
              className="connect-button"
            >
              {isConnecting ? 'Connecting...' : 'Connect WalletConnect'}
            </button>
          </div>
        ) : (
          <div className="wallet-info">
            <span className="address">{formatAddress(account)}</span>
            <button onClick={disconnectWallet} className="disconnect-button">
              Disconnect
            </button>
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>

      {active && (
        <button
          onClick={handleSaveWallet}
          disabled={isSaving}
          className="save-wallet-button"
        >
          {isSaving ? 'Saving...' : 'Save Wallet'}
        </button>
      )}

      {saveError && <div className="error-message">{saveError}</div>}
    </div>
  );
};

export default WalletSetup; 