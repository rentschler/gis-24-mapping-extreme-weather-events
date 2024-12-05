import { Select, Space } from 'antd';
import { QCLevel, QCLevelDescriptions } from '../../types/response';
import type { SelectProps } from 'antd';

import Check from './Check';
import DateRange from './DateRange';
import RangeSlider from './RangeSlider';
import MultiSelect from './MultiSelect';

const options: SelectProps['options'] = [];
const defaultValues = [QCLevel.QC1, QCLevel.QC2];

Object.entries(QCLevelDescriptions).forEach(([value, label]) => {
    options.push({ value, label: <span>{label.title}<title>{label.description}</title></span> });
});
const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
};


const FilterOptions = () => {
  return (
    <Space direction="vertical" size={12}>
        <DateRange />
        <Check label="Show Point Events" />
        <Check label="Show Aggregated Events" />
        <Check label="Show Summaries" />
        <MultiSelect options={options} defaultValues={defaultValues} handleChange={handleChange} placeholder='Select QC Levels' />
        <RangeSlider />
    </Space>
  )
}

export default FilterOptions