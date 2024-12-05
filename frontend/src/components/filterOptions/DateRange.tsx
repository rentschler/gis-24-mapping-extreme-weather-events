import { DatePicker, DatePickerProps, GetProps } from 'antd';
import dayjs from 'dayjs';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const { RangePicker } = DatePicker;
const DateRange = () => {
    const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
        console.log('onOk: ', value);
    };
    const dateFormat = 'YYYY-MM-DD';

    return (
        <>
            <label style={{ cursor: 'pointer', display: 'block', marginBottom: '2px' }} htmlFor='custom-date-range'>Select Date Range</label>
            <RangePicker
                id="custom-date-range"
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                onChange={(value, dateString) => {
                    console.log('Selected Time: ', value);
                    console.log('Formatted Selected Time: ', dateString);
                }}
                onOk={onOk}
                separator="to"
                size="small"
                defaultValue={[dayjs('2021-01-01', dateFormat), dayjs('2022-01-01', dateFormat)]}
                minDate={dayjs('2021-01-01', dateFormat)}
                maxDate={dayjs('2022-01-01', dateFormat)}>
                <p>RangePicker</p>
            </RangePicker>
        </>
    )
}

export default DateRange