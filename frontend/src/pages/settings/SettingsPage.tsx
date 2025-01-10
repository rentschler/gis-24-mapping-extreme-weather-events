import type {SelectProps} from 'antd';
import {Button, Radio, Space, Tooltip} from 'antd';
import {impactCodeData, infoSourceData, QCLevelDescriptions} from '../../types/response';

import Check from '../../components/filterOptions/Check';
import DateRange from '../../components/filterOptions/DateRange';
import RangeSlider from '../../components/filterOptions/RangeSlider';
import MultiSelect from '../../components/filterOptions/MultiSelect';
import {AppDispatch, RootState} from '../../store/store';
import {useDispatch, useSelector} from 'react-redux';
import {
    setHasChanged,
    setHideEventsWithoutDescription,
    setImpactCodes,
    setImpactRange,
    setInfoSources,
    setQCLevels,
    setShowDBSCANMap,
    setShowDynamicClustering,
    setShowHeatmap,
    setShowReportPolygons,
    setShowSimplePointMap,
    setTimeRange
} from '../../store/settingsSlice';
import {setQueryFilters} from '../../store/querySlice';
import {setVisoptions} from '../../store/visSlice';

interface SettingsPageProps {
    onHide: () => void;
}

const SettingsPage = ({onHide}: SettingsPageProps) => {
    // redux state variables
    const dispatch: AppDispatch = useDispatch();
    const {
        queryFilters,
        visOptions,
        hasChanged,
    } = useSelector((state: RootState) => state.settings);

    // QC level options
    const options: SelectProps['options'] = [];
    Object.entries(QCLevelDescriptions).forEach(([value, label]) => {
        options.push({value, label: <div title={label.description}>{label.title}</div>});
    });

    // info source options
    const sourceOptions: SelectProps['options'] = [];
    infoSourceData.forEach((source) => {
        sourceOptions.push({
            // text truncate
            value: source.code,
            label: <div style={{overflow: "hidden", textOverflow: "ellipsis", maxWidth: "300px"}}
                        title={source.description}>{source.description}</div>
        });
    });

    // impact code options
    const ImpactOptions: SelectProps['options'] = [];
    impactCodeData.forEach((impact) => {
        ImpactOptions.push({
            value: impact.code, label: <div title={impact.description}>{impact.description}</div>
        });
    });

    if (!visOptions) return null;

    return (
        <Space direction="vertical" size={18} style={{display: "flex"}}>
            {/* data picker*/}
            <DateRange
                value={queryFilters.timeRange}
                onChange={(_: unknown, dateString: [string, string]) => {
                    // dispatch sends the action to the reducer to update the state
                    dispatch(setTimeRange(dateString));
                }}
                title="Select a date range to filter events."
            />

            {/* adjust query to hide events without description*/}
            <Check
                checked={visOptions.hideEventsWithoutDescription}
                setChecked={(checked: boolean) => {
                    dispatch(setHideEventsWithoutDescription(checked));
                }}
                label="Hide Events Without Description"
                title="Activate this option if you are not interested in events that are missing a description."
            />

            {/* modify impact range*/}
            <RangeSlider
                label="Number of Impacts"
                title="Filter the results based on the number of impacts. Select '10' if you don't want to specify a maximum value."
                defaultValue={queryFilters.impactRange}
                min={0}
                max={10}
                onChange={(value: number[]) => {
                    if (value[1] === 10) value[1] = 100;
                    dispatch(setImpactRange(value))
                }}
            ></RangeSlider>

            {/* impact code filter*/}
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
                title="Filter the results based on the Impact Codes of the events. Leave empty to show all."
            />

            {/* QC level filter*/}
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
                title="Filter the results based on the quality control level of the events. Leave empty to show all."
            />

            {/* info source filter*/}
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
                title="Filter the results based on the source that provided the events. Leave empty to show all."

            />

            {/* ************************** */}
            <div className="offcanvas-title h5 py-3">Map Options</div>


            {/* change how marks are displayed*/}
            <Tooltip
                title="View extreme weather events either as simple dots or as aggregated clusters."
                placement="left"
            >
                <h4 className='mb-2'>Display marks as</h4>
                <Radio.Group onChange={(x) => {
                    if (x.target.value === 1) {
                        dispatch(setShowSimplePointMap(true));
                        dispatch(setShowDynamicClustering(false));
                    } else {
                        dispatch(setShowSimplePointMap(false));
                        dispatch(setShowDynamicClustering(true));
                    }
                }}
                             value={visOptions.showSimplePointMap ? 1 : 2}>
                    <Radio value={1}
                           style={{color: visOptions.showSimplePointMap ? "white" : "gray"}}
                    >Points</Radio>
                    <Radio value={2}
                           style={{color: visOptions.showDynamicClustering ? "white" : "gray"}}
                    >Cluster Markers</Radio>
                </Radio.Group>
            </Tooltip>

            {/* toggle summary visibility*/}
            <Check
                checked={visOptions.showReportPolygons}
                setChecked={(checked: boolean) => {
                    dispatch(setShowReportPolygons(checked));
                }}
                label="Show event summaries"
                // disabled={true}
                title="Show or hide general collective reports for the number of fatalities caused by violent flash floods"
            />

            {/* toggle heatmap visibility*/}
            <Check
                checked={visOptions.showHeatmap}
                setChecked={(checked: boolean) => {
                    dispatch(setShowHeatmap(checked));
                }}
                label="Show Heatmap"
                title="Show or hide heat map with precipitation number"
            />

            
            {/* toggle DBSCAN visibility*/}
            <Check
                checked={visOptions.showDBSCANMap}
                setChecked={(checked: boolean) => {
                    dispatch(setShowDBSCANMap(checked));
                }}
                label="DBSCAN MVP"
                title="Show or hide DBSCAN Visualisation"
            />


            <Tooltip title="Apply the changes you made to the filters and options." placement="left">
                <Button
                    className='mt-3'
                    style={!hasChanged ? {background: "#F5F5F5"} : {}}
                    onClick={() => {
                        console.log("apply button clicked");
                        // submit changes to the query state
                        dispatch(setQueryFilters(queryFilters));
                        // submit changes to the vis state
                        dispatch(setVisoptions(visOptions));
                        dispatch(setHasChanged(false))
                        onHide();
                    }}
                    disabled={!hasChanged}
                >Apply</Button>
            </Tooltip>
        </Space>
    )
}

export default SettingsPage