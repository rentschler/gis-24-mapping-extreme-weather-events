import { DatePicker, TimeRangePickerProps, Tooltip } from 'antd';
import dayjs from 'dayjs';
import ClearButton from './ClearButton';


const { RangePicker } = DatePicker;

interface DateRangeProps {
    value: [string, string];
    onChange?: TimeRangePickerProps['onChange'];
    title?: string;
}


const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'All Dates', value: [dayjs('2021-01-01'), dayjs('2022-01-01')] },
    { label: 'June 2021', value: [dayjs('2021-06-01'), dayjs('2021-06-30')] },
    { label: 'July 2021', value: [dayjs('2021-07-01'), dayjs('2021-07-31')] },
  ];

  
  
const DateRange = ({ value, onChange, title }: DateRangeProps) => {

    const dateFormat = 'YYYY-MM-DD';
    const handleClear = ()=>{
        if(onChange)
        onChange(null, ['2021-01-01', '2022-01-01'])
    }

    return (
        <Tooltip title={title} placement="left">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '9px' }}>
                <label style={{ cursor: 'pointer', display: 'block' }} htmlFor='custom-date-range'>Select Date Range</label>
                <ClearButton handleClear={handleClear} />
            </div>
            
            <RangePicker
                id="custom-date-range"
                // showTime={{ format: 'HH:mm' }}
                allowClear={false}
                presets={rangePresets}
                format={dateFormat}
                onChange={onChange}
                // prefix="start"
                // separator="end"
                size="small"
                defaultValue={[dayjs('2021-01-01', dateFormat), dayjs('2022-01-01', dateFormat)]}
                minDate={dayjs('2021-01-01', dateFormat)}
                maxDate={dayjs('2022-01-01', dateFormat)}
                placement='bottomRight'
                value={[dayjs(value[0], dateFormat), dayjs(value[1], dateFormat)]}
                style={{display:"flex"}}
                >
                <p>RangePicker</p>
                
            </RangePicker>
        </Tooltip>
    )
}

export default DateRange