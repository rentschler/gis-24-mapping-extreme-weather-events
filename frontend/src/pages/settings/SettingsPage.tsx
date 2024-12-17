import { Space } from 'antd';
import { impactCodeData, infoSourceData, QCLevelDescriptions } from '../../types/response';
import type { SelectProps } from 'antd';

import Check from '../../components/filterOptions/Check';
import DateRange from '../../components/filterOptions/DateRange';
import RangeSlider from '../../components/filterOptions/RangeSlider';
import MultiSelect from '../../components/filterOptions/MultiSelect';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { setHasChanged, setHideEventsWithoutDescription, setImpactCodes, setImpactRange, setInfoSources, setQCLevels, setShowAggregatedEvents, setShowPointEvents, setShowSummaries, setTimeRange } from '../../store/settingsSlice';
import { Button } from 'antd';
import {  setQueryFilters } from '../../store/querySlice';
import { setVisoptions } from '../../store/visSlice';
const SettingsPage = () => {
    // redux state variables
    const dispatch: AppDispatch = useDispatch();
    const { 
        queryFilters,
        visOptions,
        hasChanged
    } = useSelector((state: RootState) => state.settings);

    // QC level options
    const options: SelectProps['options'] = [];
    Object.entries(QCLevelDescriptions).forEach(([value, label]) => {
        options.push({ value, label: <div title={label.description}>{label.title}</div> });
    });

    // info source options
    const sourceOptions: SelectProps['options'] = [];
    infoSourceData.forEach((source) => {
        sourceOptions.push({
            // text truncate
            value: source.code, label: <div style={{overflow:"hidden", textOverflow:"ellipsis", maxWidth:"300px"}} title={source.description}>{source.description}</div>
        });
    });

    // impact code options
    const ImpactOptions: SelectProps['options'] = [];
    impactCodeData.forEach((impact) => {
        ImpactOptions.push({
            value: impact.code, label: <div title={impact.description}>{impact.description}</div>
        });
    });

    console.log(visOptions, queryFilters, hasChanged);
    
    if(!visOptions) return;

    return (
        <Space direction="vertical" size={18}>
            <DateRange
                value={queryFilters.timeRange}
                onChange={(_: any, dateString: [string, string]) => {
                    // dispatch sends the action to the reducer to update the state
                    dispatch(setTimeRange(dateString));
                }}
            />
            <Check
                checked={visOptions.showPointEvents}
                setChecked={(checked: boolean) => {
                    dispatch(setShowPointEvents(checked));
                }}
                label="Show Point Events"
            />
            <Check
                checked={visOptions.showAggregatedEvents}
                setChecked={(checked: boolean) => {
                    dispatch(setShowAggregatedEvents(checked));
                }}
                label="Show Aggregated Events"
            />
            <Check
                checked={visOptions.showSummaries}
                setChecked={(checked: boolean) => {
                    dispatch(setShowSummaries(checked));
                }}
                label="Show Summaries"
            />
            <Check
                checked={visOptions.hideEventsWithoutDescription}
                setChecked={(checked: boolean) => {
                    dispatch(setHideEventsWithoutDescription(checked));
                }}
                label="Hide Events Without Description"
            />
            <RangeSlider
                label="Number of Impacts"
                title="Filter the results based on the Number of Impacts"
                defaultValue={queryFilters.impactRange}
                min={0}
                max={10}
                onChange={(value: number[]) => {
                    dispatch(setImpactRange(value))
                }}
                ></RangeSlider>
            <MultiSelect
                id="impact-multi-select"
                options={ImpactOptions}
                defaultValues={queryFilters.impactCodes}
                handleChange={(value: string[]) => {
                    dispatch(setImpactCodes(value))
                }}
                placeholder="No Filter Applied"
                label="Impact Codes"
                multiLine={true}
            />
            <MultiSelect
                id="qc-multi-select"
                options={options}
                defaultValues={queryFilters.qcLevels}
                handleChange={(value: string[]) => {
                    dispatch(setQCLevels(value))
                }}
                placeholder="No Filter Applied"
                label="Quality Control Levels"
                multiLine={true}
            />
            <MultiSelect
                id="source-multi-select"
                options={sourceOptions}
                defaultValues={queryFilters.infoSources}
                handleChange={(value: string[]) => {
                    dispatch(setInfoSources(value))
                }}
                placeholder="No Filter Applied"
                label="Info Sources"
                multiLine={true}

            />
            <Button 
                className='mt-3'
                style={!hasChanged?{background:"#F5F5F5"}:{}}
                onClick={() => {
                    console.log("apply button clicked");
                    // submit changes to the query state
                    dispatch(setQueryFilters(queryFilters));
                    // submit changes to the vis state
                    dispatch(setVisoptions(visOptions));
                    dispatch(setHasChanged(false))
                }}
                disabled={!hasChanged}
            >Apply</Button>
            </Space>
    )
}

export default SettingsPage