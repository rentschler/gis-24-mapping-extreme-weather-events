import { Select, Space } from 'antd';

import Check from './Check';
import DateRange from './DateRange';




const FilterOptions = () => {
  return (
    <Space direction="vertical" size={12}>
        <DateRange />
        <Check label="Show Point Events" />
        <Check label="Show Aggregated Events" />
        <Check label="Show Summaries" />
        <Select options={[{ value: 'qc0', label: <span>qc0</span> },{ value: 'qc0+', label: <span>qc0+</span> },{ value: 'qc1', label: <span>qc1</span> },{ value: 'qc2', label: <span>qc2</span> }]} />
    </Space>
  )
}

export default FilterOptions