import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; 
import Footer_menu from '../components/Footer_menu/Footer_menu';  


describe('Footer_menu', () => {
  it('should render all the nav links', () => {
    render(
      <MemoryRouter>
        <Footer_menu />
      </MemoryRouter>
    );
    const navLinks = screen.getAllByRole('link');
    expect(navLinks).toHaveLength(6); 
  });



  it('should render the correct link texts', () => {
    render(
      <MemoryRouter>
        <Footer_menu />
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
        <Footer_menu />
      </MemoryRouter>
    );
    const hemLink = screen.getByText('HEM');
    fireEvent.click(hemLink);
    
    
    expect(window.location.pathname).toBe('/');
  });
});
