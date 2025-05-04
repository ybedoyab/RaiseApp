import './header.css'
import perosnas from '../../assets/personas.png'
import { Link } from 'react-router-dom';

function Header(){

    return(
        <>
        <div className='header'>
            <div className='titulos-header'>
            <p className='titulo-header'><span className='amarillo'>Libera</span> Sueños Locales. <br/>
            <span className='amarillo'>Potencia</span> Tu Comunidad.</p>
            <p className='subtitulo-header'>Invierte en el futuro de tu ciudad con financiamiento seguro basado en blockchain.</p>
            </div>
            <Link to={"/Explore"}className='explore-boton'>Explorar</Link>
        </div>
        <p className='texto-abajo'>Únete al movimiento. Construye un mañana más fuerte. Juntos.</p>
        </>
    );
}

export default Header;