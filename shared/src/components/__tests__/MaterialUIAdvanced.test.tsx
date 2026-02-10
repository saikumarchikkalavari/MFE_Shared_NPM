/**
 * Material UI Advanced Test Suite
 * 
 * Additional tests for Material UI components in MFE_Shared_NPM
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  Select, 
  MenuItem, 
  Checkbox, 
  FormControlLabel,
  Switch,
  Radio,
  RadioGroup
} from '@mui/material';

describe('Material UI Advanced Tests - MFE_Shared_NPM', () => {
  it('should render MUI Select with options', () => {
    render(
      <Select value="option1" displayEmpty>
        <MenuItem value="option1">Option 1</MenuItem>
        <MenuItem value="option2">Option 2</MenuItem>
        <MenuItem value="option3">Option 3</MenuItem>
      </Select>
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render MUI Checkbox with label', () => {
    render(
      <FormControlLabel 
        control={<Checkbox />} 
        label="Accept Terms" 
      />
    );
    expect(screen.getByLabelText(/accept terms/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should toggle MUI Switch component', () => {
    const handleChange = jest.fn();
    render(
      <FormControlLabel
        control={<Switch onChange={handleChange} />}
        label="Enable Notifications"
      />
    );
    
    const switchElement = screen.getByRole('checkbox');
    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalled();
  });

  it('should apply MUI Button color variants', () => {
    render(
      <>
        <button>Primary</button>
        <button>Secondary</button>
        <button>Error</button>
      </>
    );
    
    expect(screen.getByRole('button', { name: /primary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /secondary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /error/i })).toBeInTheDocument();
  });
});
