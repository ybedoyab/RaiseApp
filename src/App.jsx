import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Web3Provider } from './context/Web3Context';
import Nav from './components/Nav/Nav';
import Home from './views/Home/Home';
import Login from './views/Login/Login';
import EditProfile from './views/EditProfile/EditProfile';
import CreateCampaign from './components/CreateCampaign';
import CampaignList from './components/CampaignList';
import CampaignDetails from './components/CampaignDetails';
import './styles/navbar.css';
import './styles/global.css';

function App() {
  return (
    <ChakraProvider>
      <Web3Provider>
        <Router>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/campaigns" element={<CampaignList />} />
            <Route path="/campaigns/create" element={<CreateCampaign />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
          </Routes>
        </Router>
      </Web3Provider>
    </ChakraProvider>
  );
}

export default App;
