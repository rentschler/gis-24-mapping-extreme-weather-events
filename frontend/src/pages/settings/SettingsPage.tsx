import { Space } from 'antd';
import { ImpactCode, impactCodeData, InfoSource, infoSourceData, QCLevel, QCLevelDescriptions } from '../../types/response';
import type { SelectProps } from 'antd';

import Check from '../../components/filterOptions/Check';
import DateRange from '../../components/filterOptions/DateRange';
import RangeSlider from '../../components/filterOptions/RangeSlider';
import MultiSelect from '../../components/filterOptions/MultiSelect';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { setHideEventsWithoutDescription, setShowAggregatedEvents, setShowPointEvents, setShowSummaries, updateTimeRange } from '../../store/settingsSlice';
import { Button } from 'antd';
import { setEndDate, setFilters, setStartDate } from '../../store/querySlice';
const SettingsPage = () => {
    // redux state variables
    const dispatch: AppDispatch = useDispatch();
    const { timeRange,
        showPointEvents,
        showAggregatedEvents,
        showSummaries,
        hideEventsWithoutDescription,
    } = useSelector((state: RootState) => state.settings);
    const { 
        filters
      } = useSelector((state: RootState) => state.query);
    

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
            value: source.code, label: <div title={source.description}>{source.description}</div>
        });
    });
    const sourceDefaultValues = [InfoSource.GOV, InfoSource.NWSP];

    const ImpactOptions: SelectProps['options'] = [];
    impactCodeData.forEach((impact) => {
        ImpactOptions.push({
            value: impact.code, label: <div title={impact.description}>{impact.description}</div>
        });
    });

    const ImpactDefaultValues = [ImpactCode.H7, ImpactCode.H8, ImpactCode.H9, ImpactCode.V1];

    return (
        <Space direction="vertical" size={18}>
            <p>{filters.startDate}</p>
            <p>{filters.endDate}</p>
            <DateRange
                value={timeRange}
                onChange={(_: any, dateString: [string, string]) => {
                    // dispatch sends the action to the reducer to update the state
                    dispatch(updateTimeRange(dateString));
                }}
            />
            <Check
                checked={showPointEvents}
                setChecked={(checked: boolean) => {
                    dispatch(setShowPointEvents(checked));
                }}
                label="Show Point Events"
            />
            <Check
                checked={showAggregatedEvents}
                setChecked={(checked: boolean) => {
                    dispatch(setShowAggregatedEvents(checked));
                }}
                label="Show Aggregated Events"
            />
            <Check
                checked={showSummaries}
                setChecked={(checked: boolean) => {
                    dispatch(setShowSummaries(checked));
                }}
                label="Show Summaries"
            />
            <Check
                checked={hideEventsWithoutDescription}
                setChecked={(checked: boolean) => {
                    dispatch(setHideEventsWithoutDescription(checked));
                }}
                label="Hide Events Without Description"
            />
            <RangeSlider
                label="Number of Impacts"
                title="Filter the results based on the Number of Impacts"
                defaultValue={[2, 10]}
                min={0}
                max={10}
                onChange={(value: number[]) => {
                    handleChange(value.map(String));
                }}
            ></RangeSlider>
            <MultiSelect
                id="impact-multi-select"
                options={ImpactOptions}
                defaultValues={ImpactDefaultValues}
                handleChange={handleChange}
                placeholder="Select Impact Codes"
                label="Impact Codes"
                multiLine={true}

            />
            <MultiSelect
                id="qc-multi-select"
                options={options}
                defaultValues={defaultValues}
                handleChange={handleChange}
                placeholder="Select QC Levels"
                label="Quality Control Levels"
                multiLine={true}
            />
            <MultiSelect
                id="source-multi-select"
                options={sourceOptions}
                defaultValues={sourceDefaultValues}
                handleChange={handleChange}
                placeholder="Select Info Sources"
                label="Info Sources"
                multiLine={true}

            />
            <Button 
                className='mt-3'
                onClick={() => {
                    console.log("apply button clicked");
                    const payLoad = {
                        startDate: timeRange[0],
                        endDate: timeRange[1]
                    }
                    dispatch(setFilters(payLoad));
                }}
            >Apply</Button>
            </Space>
    )
}

export default SettingsPage