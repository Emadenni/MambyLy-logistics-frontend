import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Hero from '../components/Hero/Hero';
import CTA from '../components/Cta/Cta';
import Logo from '../components/Logo/Logo';
import SwitchWord from '../components/SwitchWord/SwitchWord';
import Layout from '../components/Layout/Layout';

global.matchMedia = global.matchMedia || function () {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {}, 
      removeEventListener: () => {} 
    };
  };

describe('Home Page', () => {
  it('should render the Home page with all components', async () => {
    render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
  });

  it('should render the logo and allow navigation', () => {
    render(
      <MemoryRouter>
        <Logo size="medium" />
      </MemoryRouter>
    );

    const logoImage = screen.getByAltText('mambyLy-logo');
    expect(logoImage).toBeInTheDocument();

    const logoLink = screen.getByRole('link');
    fireEvent.click(logoLink);

    expect(window.location.pathname).toBe('/');
  });

  it('should render and hover CTA button', () => {
    const onClickMock = vi.fn();

    render(
      <MemoryRouter>
        <CTA
          text="Test CTA"
          backgroundColor="#0B770B"
          color="#DBD714"
          hoverBackgroundColor="#fff"
          hoverColor="#0B770B"
          onClick={onClickMock}
        />
      </MemoryRouter>
    );

    const ctaButton = screen.getByText('Test CTA');
    expect(ctaButton).toBeInTheDocument();

    fireEvent.mouseEnter(ctaButton);
    expect(ctaButton).toHaveStyle('background-color: #fff');
    expect(ctaButton).toHaveStyle('color: #0B770B');

    fireEvent.click(ctaButton);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should load Hero video and image', async () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      const heroVideo = screen.getByRole('video');
      expect(heroVideo).toBeInTheDocument();
    });
  
    const heroImage = screen.getByAltText('hero placeholder');
    expect(heroImage).toBeInTheDocument();
  });
  
});
