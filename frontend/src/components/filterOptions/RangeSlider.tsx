import { Slider } from 'antd';

interface RangeSliderProps {
    label: string;
    title: string;
    defaultValue: number[];
    min: number;
    max: number;
    onChange: (value: number[]) => void;
}

const RangeSlider = ({ label, title, defaultValue, min, max, onChange }: RangeSliderProps) => {
  return (
    <div title={title}>
    <label style={{ display: 'block', marginBottom: '2px' }}>{label}</label>
        <Slider range={{ draggableTrack: true }} 
            defaultValue={defaultValue} 
            styles={{
                track: {
                    background: 'gray',
                },
                rail: {
                    background: 'lightgray',
                },
            }} 
            min={min}
            max={max}
            onChangeComplete={onChange}
        />
    </div>
  )
}

export default RangeSlider