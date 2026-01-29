import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface DateSelectorProps {
  /** Current date value */
  value: Date | null;
  /** Callback fired when date changes */
  onChange: (value: Date | null) => void;
  /** Date display format (default: "dd-MMM-yyyy") */
  format?: string;
  /** Component width in pixels (default: 165) */
  width?: number;
  /** Input field size */
  size?: "small" | "medium";
  /** Placeholder text for empty state */
  placeholder?: string;
  /** Disable the entire component */
  disabled?: boolean;
  /** Disable all past dates (before today) */
  disablePast?: boolean;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  value,
  onChange,
  format = "dd-MMM-yyyy",
  width = 165,
  size = "small",
  placeholder,
  disabled = false,
  disablePast = false,
  minDate,
  maxDate,
}) => {
  // State to control calendar popup visibility
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Wrap with LocalizationProvider to handle date formatting and localization
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={value}
        onChange={onChange}
        format={format}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        disabled={disabled}
        disablePast={disablePast}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          textField: {
            size,
            placeholder,
            InputProps: {
              // Make input read-only to prevent keyboard input
              readOnly: true,
            },
            // Handle click to open calendar (entire field clickable)
            onClick: () => !disabled && setIsOpen(true),
            sx: {
              width,
              backgroundColor: "background.paper",
              borderRadius: "25px",
              cursor: disabled ? "default" : "pointer",
              opacity: disabled ? 0.6 : 1,
              "& fieldset": {
                borderRadius: "25px",
              },
              "& .MuiInputBase-input": {
                cursor: disabled ? "default" : "pointer",
              },
              "& .MuiInputBase-root": {
                cursor: disabled ? "default" : "pointer",
              },
              "&.Mui-disabled": {
                cursor: "default",
                "& .MuiInputBase-input": {
                  cursor: "default",
                },
                "& .MuiInputBase-root": {
                  cursor: "default",
                },
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DateSelector;
