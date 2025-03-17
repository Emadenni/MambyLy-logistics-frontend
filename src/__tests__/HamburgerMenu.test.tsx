import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu/HamburgerMenu';

describe('Hamburger_menu', () => {
  it('should render the hamburger menu icon', () => {
    render(
      <MemoryRouter>
        <HamburgerMenu />
      </MemoryRouter>
    );
    const icon = screen.getByRole('button');
    expect(icon).toBeInTheDocument();
  });

  test('should open the menu when clicked', () => {
    render(
      <MemoryRouter>
        <HamburgerMenu />
      </MemoryRouter>
    );
    const icon = screen.getByRole('button');
    fireEvent.click(icon);
    
    // Usa getByTestId per selezionare l'overlay
    const overlay = screen.getByTestId('overlay');  
    expect(overlay).toBeInTheDocument();
  });

  it('should close the menu when the overlay is clicked', () => {
    render(
      <MemoryRouter>
        <HamburgerMenu />
      </MemoryRouter>
    );
    const icon = screen.getByRole('button');
    fireEvent.click(icon);

    const overlay = screen.getByTestId('overlay'); 
    fireEvent.click(overlay);

    const list = screen.getByTestId('menu-list');
    expect(list).not.toHaveClass('open');
  });

  it('should render all the nav links', () => {
    render(
      <MemoryRouter>
        <HamburgerMenu />
      </MemoryRouter>
    );
    const navLinks = screen.getAllByRole('link');
    expect(navLinks).toHaveLength(5); 
  });
});
