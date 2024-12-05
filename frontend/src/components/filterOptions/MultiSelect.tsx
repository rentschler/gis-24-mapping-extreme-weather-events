import { useRef } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';

interface MultiSelectProps {
    options: SelectProps['options'];
    defaultValues: string[];
    handleChange: (value: string[]) => void;
    id: string;
    placeholder?: string;
    label?: string;
}

const MultiSelect = ({ 
    options, 
    defaultValues, 
    handleChange, 
    id,
    placeholder = "Please select", 
    label 
}: MultiSelectProps) => {
    const selectRef = useRef<any>(null); // Ref to access the Select component

    const handleLabelClick = () => {
        // Open the dropdown programmatically when the label is clicked
        if (selectRef.current) {
            selectRef.current.focus();
            // trigger a click event to open the dropdown
            selectRef.current.click();
        }
    };

    return (
        <div>
            {label && (
                <label 
                    onClick={handleLabelClick} 
                    htmlFor={id}
                    style={{ cursor: 'pointer', display: 'block', marginBottom: '2px' }}
                >
                    {label}
                </label>
            )}
            <Select
              maxTagCount={"responsive"}

                id={id}
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder={placeholder}
                defaultValue={defaultValues}
                onChange={handleChange}
                options={options}
                ref={selectRef} // Attach the ref
            >
                {"hello world" }
            </Select>
        </div>
    );
};

export default MultiSelect;
