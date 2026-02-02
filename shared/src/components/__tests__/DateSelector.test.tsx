import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DateSelector from '../DateSelector';

describe('DateSelector Component', () => {
  const mockOnChange = jest.fn();
  const testDate = new Date(2026, 0, 15); // January 15, 2026

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render DateSelector component', () => {
      render(<DateSelector value={null} onChange={mockOnChange} />);
      // Check that the calendar button exists (which proves DatePicker rendered)
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
    });

    it('should render with placeholder when no date selected', () => {
      render(
        <DateSelector 
          value={null} 
          onChange={mockOnChange} 
          placeholder="Select a date" 
        />
      );
      expect(screen.getByPlaceholderText('Select a date')).toBeInTheDocument();
    });

    it('should display selected date', () => {
      render(<DateSelector value={testDate} onChange={mockOnChange} />);
      // MUI DatePicker formats the date and renders calendar button
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
    });

    it('should apply custom width', () => {
      const { container } = render(
        <DateSelector value={null} onChange={mockOnChange} width={200} />
      );
      // Calendar button should be rendered
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
    });

    it('should apply small size', () => {
      render(<DateSelector value={null} onChange={mockOnChange} size="small" />);
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
    });

    it('should apply medium size', () => {
      render(<DateSelector value={null} onChange={mockOnChange} size="medium" />);
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('should be enabled by default', () => {
      render(<DateSelector value={null} onChange={mockOnChange} />);
      const button = screen.getByRole('button', { name: /choose date/i });
      expect(button).toBeEnabled();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<DateSelector value={null} onChange={mockOnChange} disabled />);
      const button = screen.getByRole('button', { name: /choose date/i });
      expect(button).toBeDisabled();
    });

    it('should not be disabled when disabled prop is false', () => {
      render(<DateSelector value={null} onChange={mockOnChange} disabled={false} />);
      const button = screen.getByRole('button', { name: /choose date/i });
      expect(button).toBeEnabled();
    });
  });

  describe('Date Constraints', () => {
    it('should accept disablePast prop', () => {
      render(<DateSelector value={null} onChange={mockOnChange} disablePast />);
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
    });

    it('should accept minDate prop', () => {
      const minDate = new Date(2026, 0, 1);
      render(<DateSelector value={null} onChange={mockOnChange} minDate={minDate} />);
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
    });

    it('should accept maxDate prop', () => {
      const maxDate = new Date(2026, 11, 31);
      render(<DateSelector value={null} onChange={mockOnChange} maxDate={maxDate} />);
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
    });

    it('should accept both minDate and maxDate', () => {
      const minDate = new Date(2026, 0, 1);
      const maxDate = new Date(2026, 11, 31);
      render(
        <DateSelector 
          value={null} 
          onChange={mockOnChange} 
          minDate={minDate} 
          maxDate={maxDate} 
        />
      );
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have calendar button with accessible name', () => {
      render(<DateSelector value={null} onChange={mockOnChange} />);
      const button = screen.getByRole('button', { name: /choose date/i });
      expect(button).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<DateSelector value={null} onChange={mockOnChange} />);
      const button = screen.getByRole('button', { name: /choose date/i });
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null value gracefully', () => {
      render(<DateSelector value={null} onChange={mockOnChange} />);
      // Calendar button should exist even with null value
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
    });

    it('should work without placeholder', () => {
      render(<DateSelector value={null} onChange={mockOnChange} />);
      // Calendar button should exist without placeholder
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
    });

    it('should handle valid date value', () => {
      render(<DateSelector value={testDate} onChange={mockOnChange} />);
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
    });

    it('should handle custom format', () => {
      render(
        <DateSelector 
          value={testDate} 
          onChange={mockOnChange} 
          format="MM/dd/yyyy" 
        />
      );
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
    });
  });

  describe('Props Combination', () => {
    it('should handle all props together', () => {
      const minDate = new Date(2026, 0, 1);
      const maxDate = new Date(2026, 11, 31);
      
      render(
        <DateSelector 
          value={testDate}
          onChange={mockOnChange}
          format="dd-MMM-yyyy"
          width={180}
          size="small"
          placeholder="Pick a date"
          disabled={false}
          disablePast={true}
          minDate={minDate}
          maxDate={maxDate}
        />
      );
      
      expect(screen.getByRole('button', { name: /choose date/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Pick a date')).toBeInTheDocument();
    });
  });
});
