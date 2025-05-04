import React, { useState, useEffect } from 'react';
import aboutImg from '../../assets/about-img.png';
import contactImg from '../../assets/contact-img.png';
import personasImg from '../../assets/personas.png';
import './carousel.css';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    {
      src: aboutImg,
      alt: 'Sobre nosotros'
    },
    {
      src: contactImg,
      alt: 'Contacto'
    },
    {
      src: personasImg,
      alt: 'Personas'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia de imagen cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, [images.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="carousel">
      <button className="carousel__button carousel__button--left" onClick={prevSlide}>
        &#10094;
      </button>
      <div className="carousel__slides">
        {images.map((image, index) => (
          <div
            className={`carousel__slide ${index === currentIndex ? 'active' : ''}`}
            key={index}
          >
            <img 
              className='img-carousel' 
              src={image.src} 
              alt={image.alt}
            />
          </div>
        ))}
      </div>
      <button className="carousel__button carousel__button--right" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel; 