import './nav.css'
import Logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProfileNav from '../ProfileNav/ProfileNav';
import { Link as ScrollLink, scroller } from 'react-scroll';
import { useWeb3 } from '../../context/Web3Context';
import WalletConnect from '../WalletConnect';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, useDisclosure, Stack, Box, Text, Image } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import personas from '../../assets/personas.png';

const Nav = () => {
    const navigate = useNavigate();
    const { address } = useWeb3();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, login } = useAuth();
    const [step, setStep] = useState('role');
    const [selectedRole, setSelectedRole] = useState(null);

    const handleNavigation = (target) => {
        if (window.location.pathname !== "/") {
            navigate("/", { replace: true });
            setTimeout(() => {
                scroller.scrollTo(target, {
                    duration: 800,
                    delay: 0,
                    smooth: 'easeInOutQuart',
                });
            }, 100);
        } else {
            scroller.scrollTo(target, {
                duration: 800,
                delay: 0,
                smooth: 'easeInOutQuart'
            });
        }
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setStep('login');
    };

    const handleLogin = () => {
        // Simula login como en Login.jsx
        const mockUser = {
            id: '1',
            name: selectedRole === 'INVESTOR' ? 'Demo Investor' : 'Demo Entrepreneur',
            email: `${selectedRole.toLowerCase()}@demo.com`,
            type: selectedRole,
            image: ''
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        login(mockUser);
        setStep('role');
        setSelectedRole(null);
        onClose();
    };

    const handleBack = () => {
        setStep('role');
        setSelectedRole(null);
    };

    return (
        <nav className="nav-bar">  
            <div className="left">
                <img src={Logo} alt="Raise App Logo" onClick={() => navigate("/")} />
            </div>
            <div className="center">
                <ul>
                    <li onClick={() => handleNavigation('home')}>Home</li>
                    <li onClick={() => handleNavigation('about')}>About</li>
                    <li onClick={() => handleNavigation('contact')}>Contact</li>
                    <Link to="/campaigns">Emprendimientos</Link>
                    <Link to="/campaigns/create">Crear Emprendimiento</Link>
                </ul>
            </div>
            <div className="right">
                {user ? (
                    <>
                        {address && (
                            <div style={{marginRight: '1rem', color: '#FFE922', fontWeight: 'bold', fontSize: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '0.4rem 1rem'}}>
                                {address.slice(0, 6)}...{address.slice(-4)}
                            </div>
                        )}
                        <ProfileNav user={user} />
                    </>
                ) : (
                    <Button className="button not-logged" onClick={onOpen}>Ingresar</Button>
                )}
            </div>
            <Modal isOpen={isOpen} onClose={() => { onClose(); setStep('role'); setSelectedRole(null); }} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {step === 'role' ? '¿Cómo deseas ingresar?' : 'Iniciar sesión'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {step === 'role' ? (
                            <Stack spacing={4} py={4} align="center">
                                <Button colorScheme="blue" size="lg" width="100%" onClick={() => handleRoleSelect('INVESTOR')}>
                                    Ingresar como Inversionista
                                </Button>
                                <Button colorScheme="yellow" size="lg" width="100%" onClick={() => handleRoleSelect('ENTREPRENEUR')}>
                                    Ingresar como Emprendedor
                                </Button>
                            </Stack>
                        ) : (
                            <Box py={4} textAlign="center">
                                <Image src={logo} alt="Logo" mx="auto" mb={4} width="5rem" />
                                <Text fontWeight="bold" mb={2} fontSize="lg">
                                    {selectedRole === 'INVESTOR' ? 'Inversionista' : 'Emprendedor'} Demo
                                </Text>
                                <Text mb={4} color="gray.500">
                                    (Simulación de login instantáneo)
                                </Text>
                                <Button colorScheme="blue" size="lg" width="100%" onClick={handleLogin} mb={2}>
                                    Ingresar
                                </Button>
                                <Button variant="link" colorScheme="gray" onClick={handleBack} width="100%">
                                    Volver
                                </Button>
                            </Box>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </nav>
    );
}

export default Nav;