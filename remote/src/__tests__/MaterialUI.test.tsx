/**
 * Material UI Component Test Suite - MFE_Shared_NPM Remote
 * 
 * Tests for Material UI components used in the remote application
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button, TextField, Box, Typography, Card, IconButton, Checkbox } from '@mui/material';

describe('Material UI Component Tests - Remote NPM', () => {
  // Rendering Tests
  it('should render MUI Button component', () => {
    render(<Button variant="contained">Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should render MUI TextField component', () => {
    render(<TextField label="Username" placeholder="Enter username" />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
  });

  it('should render MUI Box with children', () => {
    render(
      <Box data-testid="test-box">
        <Typography>Content inside Box</Typography>
      </Box>
    );
    expect(screen.getByTestId('test-box')).toBeInTheDocument();
    expect(screen.getByText(/content inside box/i)).toBeInTheDocument();
  });

  it('should render MUI Typography variants', () => {
    render(
      <>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="body1">Body text</Typography>
      </>
    );
    expect(screen.getByText(/heading 1/i)).toBeInTheDocument();
    expect(screen.getByText(/body text/i)).toBeInTheDocument();
  });

  it('should render MUI Card component', () => {
    render(
      <Card data-testid="test-card">
        <Typography>Card Content</Typography>
      </Card>
    );
    expect(screen.getByTestId('test-card')).toBeInTheDocument();
    expect(screen.getByText(/card content/i)).toBeInTheDocument();
  });

  // Event Handling Tests
  it('should handle Button click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('should handle TextField onChange events', () => {
    const handleChange = jest.fn();
    render(<TextField label="Email" onChange={handleChange} />);
    const input = screen.getByLabelText(/email/i);
    
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('test@example.com');
  });

  it('should handle Checkbox toggle events', () => {
    const handleChange = jest.fn();
    render(<Checkbox onChange={handleChange} inputProps={{ 'aria-label': 'Accept terms' }} />);
    const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
    
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should handle IconButton click with disabled state', () => {
    const handleClick = jest.fn();
    render(<IconButton onClick={handleClick} disabled aria-label="delete">Delete</IconButton>);
    const button = screen.getByRole('button', { name: /delete/i });
    
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
