import { DatePicker, TimeRangePickerProps, Tooltip } from 'antd';
import dayjs from 'dayjs';


const { RangePicker } = DatePicker;

interface DateRangeProps {
    value: [string, string];
    onChange?: TimeRangePickerProps['onChange'];
    title?: string;
}


const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'All Dates', value: [dayjs('2021-01-01'), dayjs('2022-01-01')] },
    { label: 'July 2021', value: [dayjs('2021-06-01'), dayjs('2021-06-30')] },
  ];

  
  
const DateRange = ({ value, onChange, title }: DateRangeProps) => {

    const dateFormat = 'YYYY-MM-DD';

    return (
        <Tooltip title={title} placement="left">
            <label style={{ cursor: 'pointer', display: 'block', marginBottom: '2px' }} htmlFor='custom-date-range'>Select Date Range</label>
            <RangePicker
                id="custom-date-range"
                // showTime={{ format: 'HH:mm' }}
                allowClear={false}
                presets={rangePresets}
                format={dateFormat}
                onChange={onChange}
                separator="to"
                size="small"
                defaultValue={[dayjs('2021-01-01', dateFormat), dayjs('2022-01-01', dateFormat)]}
                minDate={dayjs('2021-01-01', dateFormat)}
                maxDate={dayjs('2022-01-01', dateFormat)}
                placement='bottomRight'
                value={[dayjs(value[0], dateFormat), dayjs(value[1], dateFormat)]}
                >
                <p>RangePicker</p>
                
            </RangePicker>
        </Tooltip>
    )
}

export default DateRange