import './login.css';
import personas from "../../assets/personas.png";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from '../../context/AuthContext';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRoleSelect = (role) => {
        // Create a mock user object based on the selected role
        const mockUser = {
            id: '1',
            name: role === 'INVESTOR' ? 'Demo Investor' : 'Demo Entrepreneur',
            email: `${role.toLowerCase()}@demo.com`,
            type: role,
            image: ''
        };
        
        // Store the mock user in localStorage
        localStorage.setItem('user', JSON.stringify(mockUser));
        login(mockUser);
        navigate('/');
    };

    return (
        <>
            <div className="login-container">
                <div className="izq">
                    <div className="form-container">
                        <div className="form-header">
                            <Link to={'/'}> &lt;-- Back to Home</Link>
                            <img src={logo} style={{width: '7rem'}} alt="Logo"/>
                        </div>
                        <p className="titulo-login">Select Your Role</p>
                        
                        <div className='role-buttons'>
                            <button 
                                className="role-button investor"
                                onClick={() => handleRoleSelect('INVESTOR')}
                            >
                                Ingresar como Inversionista
                            </button>
                            <button 
                                className="role-button entrepreneur"
                                onClick={() => handleRoleSelect('ENTREPRENEUR')}
                            >
                                Ingresar como Emprendedor
                            </button>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <img className="foto-login" src={personas} alt="Personas"/>
                </div>
            </div>
        </>
    );
}

export default Login;
