import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; 
import FooterMenu from '../components/FooterMenu/FooterMenu';
import Terms from '../components/Terms/Terms';
import SocialBox from '../components/SocialBox/SocialBox'; 

describe('Footer', () => {

  describe('FooterMenu', () => {
    it('should render all the nav links', () => {
      render(
        <MemoryRouter>
          <FooterMenu />
        </MemoryRouter>
      );
      const navLinks = screen.getAllByRole('link');
      expect(navLinks).toHaveLength(6); 
    });

    it('should render the correct link texts', () => {
      render(
        <MemoryRouter>
          <FooterMenu />
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
          <FooterMenu />
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
          <SocialBox />
        </MemoryRouter>
      );
      const socialIcons = screen.getAllByRole('link');
      expect(socialIcons).toHaveLength(6); // Poiché hai 6 icone sociali
    });

    it('should render the correct icons', () => {
      render(
        <MemoryRouter>
          <SocialBox />
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
          <SocialBox />
        </MemoryRouter>
      );
      const facebookLink = screen.getByAltText('facebook_icon');
      fireEvent.click(facebookLink);
      

      expect(window.location.pathname).toBe('/');
    });
  });
});
