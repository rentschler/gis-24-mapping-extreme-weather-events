import { Space } from 'antd';
import { ImpactCode, impactCodeData, InfoSource, infoSourceData, QCLevel, QCLevelDescriptions } from '../../types/response';
import type { SelectProps } from 'antd';

import Check from './Check';
import DateRange from './DateRange';
import RangeSlider from './RangeSlider';
import MultiSelect from './MultiSelect';

const options: SelectProps['options'] = [];
const defaultValues = [QCLevel.QC1, QCLevel.QC2];

Object.entries(QCLevelDescriptions).forEach(([value, label]) => {
    options.push({ value, label: <div title={label.description}>{label.title}</div> });
});
const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
};

const sourceOptions: SelectProps['options'] = [];
infoSourceData.forEach((source) => {
    sourceOptions.push({ value: source.code, label: <div title={source.description}>{source.code}</div>
    });
});
const sourceDefaultValues = [InfoSource.GOV, InfoSource.NWSP];

const ImpactOptions: SelectProps['options'] = [];
impactCodeData.forEach((impact) => {
    ImpactOptions.push({ value: impact.code, label: <div title={impact.description}>{impact.code}</div>
    });
});

const ImpactDefaultValues = [ImpactCode.H7, ImpactCode.H8, ImpactCode.H9, ImpactCode.V1];

const FilterOptions = () => {
  return (
    <Space direction="vertical" size={18}>
        <DateRange />
        <Check label="Show Point Events" />
        <Check label="Show Aggregated Events" />
        <Check label="Show Summaries" />
        <Check label="Hide Events Without Description" />
        <RangeSlider />
        <MultiSelect id="qc-multi-select" options={options} defaultValues={defaultValues} handleChange={handleChange} placeholder='Select QC Levels' label='Quality Control Levels' />
        <MultiSelect id="source-multi-select" options={sourceOptions} defaultValues={sourceDefaultValues} handleChange={handleChange} placeholder='Select Info Sources' label='Info Sources' />
        <MultiSelect id="impact-multi-select" options={ImpactOptions} defaultValues={ImpactDefaultValues} handleChange={handleChange} placeholder='Select Impact Codes' label='Impact Codes' />
    </Space>
  )
}

export default FilterOptions