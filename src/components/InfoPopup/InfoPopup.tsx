import React from 'react';
import { Modal } from '@mui/material';
import CTA from '../Cta/Cta';

const InfoPopup: React.FC<{
  title: string;
  description: string;
  services: string[];
  image: string;
  onClose: () => void;
}> = ({ title, description, services, image, onClose }) => {
  return (
    <Modal open={true} onClose={onClose}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '300px',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            overflow: 'hidden',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
        
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.4)',
              color: 'white',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{title}</h2>
            <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>{description}</p>
          </div>

          
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              color: 'white',
              cursor: 'pointer',
              zIndex: 2,
            }}
          >
            ✕
          </button>
        </div>

       
        <div style={{ padding: '1.5rem' }}>
          <ul
            style={{
              listStyle: 'disc',
              paddingLeft: '1.2rem',
              fontSize: '0.95rem',
              margin: 0,
            }}
          >
            {services.map((service, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                {service}
              </li>
            ))}
          </ul>
          <CTA
            text="KONTAKTA OSS"
            backgroundColor="rgb(9, 126, 165)"
            color="white"
            hoverBackgroundColor="rgb(10, 69, 86)"
            hoverColor="yellow"
          />
        </div>
      </div>
     
    </Modal>
  );
};

export default InfoPopup;
