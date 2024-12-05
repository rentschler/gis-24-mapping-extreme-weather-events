import { Select } from 'antd';
import type { SelectProps } from 'antd';

interface MultiSelectProps {
    options: SelectProps['options'];
    defaultValues: string[];
    handleChange: (value: string[]) => void;
    placeholder?: string;
}



const MultiSelect = ({ options, defaultValues, handleChange, placeholder="Please select" }: MultiSelectProps) => {
    return (
        <div>
            <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder={placeholder}
                defaultValue={defaultValues}
                onChange={handleChange}
                options={options}
            />
        </div>
    )
}

export default MultiSelect