import { Slider } from 'antd';

const RangeSlider = () => {
  return (
    <>
    <label style={{ display: 'block', marginBottom: '8px' }}>Number of Impacts</label>
        <Slider range={{ draggableTrack: true }} 
            defaultValue={[2, 10]} 
            styles={{
                track: {
                    background: 'gray',
                },
                rail: {
                    background: 'lightgray',
                },
            }} 
            min={0}
            max={10}
        />
    </>
  )
}

export default RangeSlider