import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../components/header';
import { ThemeProvider } from 'styled-components';
import { cyanTheme } from '../themes';
import React from 'react';

// Mock getStoredData and writeStoredData
vi.mock('@/lib/localStorage', () => ({
  getStoredData: () => ({
    responseExport: false,
    host: 'oast.fun',
  }),
  writeStoredData: vi.fn(),
}));

// Mock Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Header Component', () => {
  const defaultProps = {
    host: 'oast.fun',
    theme: 'cyan',
    handleAboutPopupVisibility: vi.fn(),
    handleThemeSelection: vi.fn(),
    isResetPopupDialogVisible: false,
    isNotificationsDialogVisible: false,
    isCustomHostDialogVisible: false,
    handleResetPopupDialogVisibility: vi.fn(),
    handleNotificationsDialogVisibility: vi.fn(),
    handleCustomHostDialogVisibility: vi.fn(),
    processPolledData: vi.fn(),
  };

  it('renders the brand name', () => {
    render(
      <ThemeProvider theme={cyanTheme}>
        <Header {...defaultProps} />
      </ThemeProvider>
    );
    expect(screen.getByText('INTERACTSH')).toBeInTheDocument();
  });

  it('renders the URL centerpiece when URL is provided', () => {
    render(
      <ThemeProvider theme={cyanTheme}>
        <Header {...defaultProps} url="test.oast.fun" />
      </ThemeProvider>
    );
    expect(screen.getByText('test.oast.fun')).toBeInTheDocument();
  });

  it('shows theme options on hover', async () => {
    render(
      <ThemeProvider theme={cyanTheme}>
        <Header {...defaultProps} />
      </ThemeProvider>
    );
    
    const themeSelector = screen.getByTitle('Switch Theme');
    expect(themeSelector).toBeInTheDocument();
    
    // Check if theme options exist
    expect(screen.getByText('CYAN')).toBeInTheDocument();
    expect(screen.getByText('LIME')).toBeInTheDocument();
    expect(screen.getByText('SUNSET')).toBeInTheDocument();
  });

  it('calls handleThemeSelection when a theme option is clicked', () => {
    render(
      <ThemeProvider theme={cyanTheme}>
        <Header {...defaultProps} />
      </ThemeProvider>
    );
    
    const limeOption = screen.getByText('LIME');
    fireEvent.click(limeOption);
    
    expect(defaultProps.handleThemeSelection).toHaveBeenCalledWith('lime');
  });
});
