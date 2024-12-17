import { Slider, SliderSingleProps, Tooltip } from 'antd';
import { CloseOutlined } from "@ant-design/icons";

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
  return (
    <Tooltip title={title} placement="left">
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <label style={{ display: 'block', marginBottom: '2px' }}>{label}</label>
        <a onClick={() => console.log("close")}>{<CloseOutlined />}</a>
    </div>

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
    </Tooltip>
  )
}

export default RangeSlider