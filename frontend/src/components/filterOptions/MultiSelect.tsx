import { useRef } from 'react';
import { Select, Tooltip } from 'antd';
import type { SelectProps } from 'antd';

interface MultiSelectProps {
    options: SelectProps['options'];
    defaultValues: string[];
    handleChange: (value: string[]) => void;
    id: string;
    placeholder?: string;
    label?: string;
    multiLine?: boolean; // allow the selecter to go over multiple lines 
    title?: string;
}

const MultiSelect = ({ 
    options, 
    defaultValues, 
    handleChange, 
    id,
    placeholder = "Please select", 
    label,
    multiLine = false,
    title
}: MultiSelectProps) => {
    const selectRef = useRef<any>(null); // Ref to access the Select component

    const handleLabelClick = () => {
        // Open the dropdown programmatically when the label is clicked
        if (selectRef.current) {
            selectRef.current.focus();
        }
    };

    return (
        <Tooltip title={title} placement="left">
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
                maxTagCount={multiLine? undefined : "responsive"}
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
        </Tooltip>
    );
};

export default MultiSelect;
