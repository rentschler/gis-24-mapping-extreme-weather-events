import { Space } from 'antd';
import { ImpactCode, impactCodeData, InfoSource, infoSourceData, QCLevel, QCLevelDescriptions } from '../../types/response';
import type { SelectProps } from 'antd';

import Check from '../../components/filterOptions/Check';
import DateRange from '../../components/filterOptions/DateRange';
import RangeSlider from '../../components/filterOptions/RangeSlider';
import MultiSelect from '../../components/filterOptions/MultiSelect';
import { useState } from 'react';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateTimeRange } from '../../store/settingsSlice';

const SettingsPage = () => {
    const dispatch: AppDispatch = useDispatch();
    const { timeRange } = useSelector((state: RootState) => state.settings);


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
        sourceOptions.push({
            value: source.code, label: <div title={source.description}>{source.code}</div>
        });
    });
    const sourceDefaultValues = [InfoSource.GOV, InfoSource.NWSP];

    const ImpactOptions: SelectProps['options'] = [];
    impactCodeData.forEach((impact) => {
        ImpactOptions.push({
            value: impact.code, label: <div title={impact.description}>{impact.code}</div>
        });
    });

    const ImpactDefaultValues = [ImpactCode.H7, ImpactCode.H8, ImpactCode.H9, ImpactCode.V1];

    const onDateChange = (_: any, dateString: [string, string]) => {
        dispatch(updateTimeRange(dateString));
    }



    const [checked, setChecked] = useState(true);
    return (
        <Space direction="vertical" size={18}>
            <DateRange onChange={onDateChange} value={timeRange}/>
            <Check checked={checked} setChecked={setChecked} label="Show Point Events" />
            <Check checked={checked} setChecked={setChecked} label="Show Aggregated Events" />
            <Check checked={checked} setChecked={setChecked} label="Show Summaries" />
            <Check checked={checked} setChecked={setChecked} label="Hide Events Without Description" />
            <RangeSlider
                label="Number of Impacts"
                title="Filter the results based on the Number of Impacts"
                defaultValue={[2, 10]}
                min={0}
                max={10}
                onChange={(value: number[]) => {
                    handleChange(value.map(String));
                }}>
            </RangeSlider>
            <MultiSelect id="impact-multi-select" options={ImpactOptions} defaultValues={ImpactDefaultValues} handleChange={handleChange} placeholder='Select Impact Codes' label='Impact Codes' />
            <MultiSelect id="qc-multi-select" options={options} defaultValues={defaultValues} handleChange={handleChange} placeholder='Select QC Levels' label='Quality Control Levels' />
            <MultiSelect id="source-multi-select" options={sourceOptions} defaultValues={sourceDefaultValues} handleChange={handleChange} placeholder='Select Info Sources' label='Info Sources' />
        </Space>
    )
}

export default SettingsPage