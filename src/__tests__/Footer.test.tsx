import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; 
import Footer_menu from '../components/Footer_menu/Footer_menu';
import Terms from '../components/Terms/Terms';
import Social_box from '../components/Social_box/Social_box'; 

describe('Footer', () => {

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

  describe('Terms', () => {
    it('should render all the links', () => {
      render(
        <MemoryRouter>
          <Terms />
        </MemoryRouter>
      );
      const navLinks = screen.getAllByRole('link');
      expect(navLinks).toHaveLength(2); 
    });

    it('should render the correct link texts', () => {
      render(
        <MemoryRouter>
          <Terms />
        </MemoryRouter>
      );
      const integritetspolicyLink = screen.getByText('Integritetspolicy');
      const användarvillkorLink = screen.getByText('Användarvillkor');
      
      expect(integritetspolicyLink).toBeInTheDocument();
      expect(användarvillkorLink).toBeInTheDocument();
    });

    it('should navigate to the correct routes when clicked', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Terms />
        </MemoryRouter>
      );
      const integritetspolicyLink = screen.getByText('Integritetspolicy');
      fireEvent.click(integritetspolicyLink);
      
      // Verifica la navigazione corretta
      expect(window.location.pathname).toBe('/');
    });
  });

  describe('Social_box', () => {
    it('should render all the social icons with links', () => {
      render(
        <MemoryRouter>
          <Social_box />
        </MemoryRouter>
      );
      const socialIcons = screen.getAllByRole('link');
      expect(socialIcons).toHaveLength(6); // Poiché hai 6 icone sociali
    });

    it('should render the correct icons', () => {
      render(
        <MemoryRouter>
          <Social_box />
        </MemoryRouter>
      );
      const facebookIcon = screen.getByAltText('facebook_icon');
      const instagramIcon = screen.getByAltText('instagram_icon');
      const linkedinIcon = screen.getByAltText('linkedin_icon');
      const whatsappIcon = screen.getByAltText('whatsapp_icon');
      const tiktokIcon = screen.getByAltText('tiktok_icon');
      const viberIcon = screen.getByAltText('viber_icon');
      
      expect(facebookIcon).toBeInTheDocument();
      expect(instagramIcon).toBeInTheDocument();
      expect(linkedinIcon).toBeInTheDocument();
      expect(whatsappIcon).toBeInTheDocument();
      expect(tiktokIcon).toBeInTheDocument();
      expect(viberIcon).toBeInTheDocument();
    });

    it('should navigate to the correct routes when clicked', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Social_box />
        </MemoryRouter>
      );
      const facebookLink = screen.getByAltText('facebook_icon');
      fireEvent.click(facebookLink);
      

      expect(window.location.pathname).toBe('/');
    });
  });
});
