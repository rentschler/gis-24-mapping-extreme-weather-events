import { Slider, SliderSingleProps } from 'antd';

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
    10: {
      style: {
        color: 'white',
      },
      label: <p>10</p>,
    },
    11: {
      style: {
        color: 'white',
      },
      label: <strong>10+</strong>,
    },
  };
  

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
            marks={marks} 
            onChangeComplete={onChange}
        />
    </div>
  )
}

export default RangeSlider