import { Slider, SliderSingleProps, Tooltip } from 'antd';
import ClearButton from './ClearButton';

interface RangeSliderProps {
    label: string;
    title: string;
    defaultValue: number[];
    min: number;
    max: number;
    onChange: (value: number[]) => void;
}

const marks: SliderSingleProps['marks'] = {
    0: {
        style: {
            color: 'white',
        },
        label: <p>0</p>,
    },
    2: {
        style: {
            color: 'white',
        },
        label: <p>2</p>,
    },
    4: {
        style: {
            color: 'white',
        },
        label: <p>4</p>,
    },
    6: {
        style: {
            color: 'white',
        },
        label: <p>6</p>,
    },
    8: {
        style: {
            color: 'white',
        },
        label: <p>8</p>,
    },

    10: {
        style: {
            color: 'white',
        },
        label: <strong>10+</strong>,
    },
};

const RangeSlider = ({ label, title, defaultValue, min, max, onChange }: RangeSliderProps) => {
    // Clear slider values by resetting to initial state
    const handleClear = () => {
        const defaultRange = [min, max]; // Adjust based on your requirements
        onChange(defaultRange);
    };

    return (
        <Tooltip title={title} placement="left">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label >{label}</label>
                <ClearButton handleClear={handleClear} />
            </div>
            <Slider
                range={{ draggableTrack: true }}
                value={defaultValue} // Fully controlled component
                styles={{
                    track: {
                        background: 'gray',
                    },
                    rail: {
                        background: 'lightgray',
                    },
                }} min={min}
                max={max}
                marks={marks}
                onChange={onChange} // Update state on change
                onChangeComplete={onChange} // Ensure state sync after drag
            />
        </Tooltip>
    );
};

export default RangeSlider;
