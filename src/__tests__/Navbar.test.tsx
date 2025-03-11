import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; 
import Navbar from '../components/Navbar/Navbar'; 

describe('Navbar', () => {
  it('should render all the nav links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const navLinks = screen.getAllByRole('link');
    expect(navLinks).toHaveLength(5); 
  });

  it('should have the correct active class for the active link', () => {
    render(
      <MemoryRouter initialEntries={['/tjänster']}>
        <Navbar />
      </MemoryRouter>
    );
    const activeLink = screen.getByText('TJÄNSTER');
    expect(activeLink).toHaveClass('navbar_link--active');
  });

  it('should render the correct link texts', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const hemLink = screen.getByText('HEM');
    const tjänsterLink = screen.getByText('TJÄNSTER');
    const kontaktaOssLink = screen.getByText('KONTAKTA OSS');
    const jobbLink = screen.getByText('JOBB');
    const omOssLink = screen.getByText('OM OSS');
    
    expect(hemLink).toBeInTheDocument();
    expect(tjänsterLink).toBeInTheDocument();
    expect(kontaktaOssLink).toBeInTheDocument();
    expect(jobbLink).toBeInTheDocument();
    expect(omOssLink).toBeInTheDocument();
  });

  it('should navigate to the correct routes when clicked', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );
    const hemLink = screen.getByText('HEM');
    fireEvent.click(hemLink);
    
    
    expect(window.location.pathname).toBe('/');
  });
});
