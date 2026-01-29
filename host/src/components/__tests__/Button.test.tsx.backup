import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button } from 'shared/components/Button';

// Test wrapper with MUI theme
const theme = createTheme();
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

const renderWithTheme = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper });
};

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with label prop', () => {
      renderWithTheme(<Button label="Click Me" />);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should render button with children', () => {
      renderWithTheme(<Button>Child Content</Button>);
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('should prioritize label over children when both are provided', () => {
      renderWithTheme(<Button label="Label Text">Children Text</Button>);
      expect(screen.getByText('Label Text')).toBeInTheDocument();
      expect(screen.queryByText('Children Text')).not.toBeInTheDocument();
    });

    it('should render with default props', () => {
      renderWithTheme(<Button>Default Button</Button>);
      const button = screen.getByText('Default Button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it('should render with custom variant', () => {
      renderWithTheme(<Button variant="contained" label="Contained Button" />);
      const button = screen.getByText('Contained Button');
      expect(button).toHaveClass('MuiButton-contained');
    });

    it('should render with custom color', () => {
      renderWithTheme(<Button color="primary" label="Primary Button" />);
      const button = screen.getByText('Primary Button');
      expect(button).toHaveClass('MuiButton-colorPrimary');
    });
  });

  describe('Interaction', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = jest.fn();
      renderWithTheme(<Button onClick={handleClick} label="Click Me" />);
      
      const button = screen.getByText('Click Me');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn();
      renderWithTheme(<Button onClick={handleClick} disabled label="Disabled Button" />);
      
      const button = screen.getByText('Disabled Button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle multiple clicks', () => {
      const handleClick = jest.fn();
      renderWithTheme(<Button onClick={handleClick} label="Multi Click" />);
      
      const button = screen.getByText('Multi Click');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      renderWithTheme(<Button disabled label="Disabled" />);
      expect(screen.getByText('Disabled')).toBeDisabled();
    });

    it('should be enabled when disabled prop is false', () => {
      renderWithTheme(<Button disabled={false} label="Enabled" />);
      expect(screen.getByText('Enabled')).toBeEnabled();
    });

    it('should be enabled by default', () => {
      renderWithTheme(<Button label="Default" />);
      expect(screen.getByText('Default')).toBeEnabled();
    });
  });

  describe('Variants', () => {
    it('should render text variant', () => {
      renderWithTheme(<Button variant="text" label="Text Button" />);
      const button = screen.getByText('Text Button');
      expect(button).toHaveClass('MuiButton-text');
    });

    it('should render contained variant', () => {
      renderWithTheme(<Button variant="contained" label="Contained Button" />);
      const button = screen.getByText('Contained Button');
      expect(button).toHaveClass('MuiButton-contained');
    });

    it('should render outlined variant', () => {
      renderWithTheme(<Button variant="outlined" label="Outlined Button" />);
      const button = screen.getByText('Outlined Button');
      expect(button).toHaveClass('MuiButton-outlined');
    });
  });

  describe('Colors', () => {
    it('should render primary color', () => {
      renderWithTheme(<Button color="primary" label="Primary" />);
      const button = screen.getByText('Primary');
      expect(button).toHaveClass('MuiButton-colorPrimary');
    });

    it('should render secondary color', () => {
      renderWithTheme(<Button color="secondary" label="Secondary" />);
      const button = screen.getByText('Secondary');
      expect(button).toHaveClass('MuiButton-colorSecondary');
    });

    it('should render error color', () => {
      renderWithTheme(<Button color="error" label="Error" />);
      const button = screen.getByText('Error');
      expect(button).toHaveClass('MuiButton-colorError');
    });

    it('should render success color', () => {
      renderWithTheme(<Button color="success" label="Success" />);
      const button = screen.getByText('Success');
      expect(button).toHaveClass('MuiButton-colorSuccess');
    });
  });

  describe('Accessibility', () => {
    it('should have button role', () => {
      renderWithTheme(<Button label="Accessible Button" />);
      const button = screen.getByRole('button', { name: 'Accessible Button' });
      expect(button).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      renderWithTheme(<Button aria-label="Custom Aria Label" label="Button" />);
      const button = screen.getByLabelText('Custom Aria Label');
      expect(button).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      const handleClick = jest.fn();
      renderWithTheme(<Button onClick={handleClick} label="Keyboard Button" />);
      
      const button = screen.getByText('Keyboard Button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Additional Props', () => {
    it('should pass through additional props', () => {
      renderWithTheme(<Button label="Custom" data-testid="custom-button" />);
      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });

    it('should support custom className', () => {
      renderWithTheme(<Button label="Custom Class" className="custom-class" />);
      const button = screen.getByText('Custom Class');
      expect(button).toHaveClass('custom-class');
    });

    it('should support custom styles', () => {
      renderWithTheme(<Button label="Styled" style={{ fontSize: '20px' }} />);
      const button = screen.getByText('Styled');
      expect(button).toHaveStyle({ fontSize: '20px' });
    });
  });

  describe('Edge Cases', () => {
    it('should render with empty label', () => {
      renderWithTheme(<Button label="" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with no label or children', () => {
      renderWithTheme(<Button />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle onClick with undefined', () => {
      renderWithTheme(<Button onClick={undefined} label="No Handler" />);
      const button = screen.getByText('No Handler');
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });
});
