import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from './context/AuthContext'
import { Web3Provider } from './context/Web3Context'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <Web3Provider>
          <App />
        </Web3Provider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
