import { Slider } from 'antd';

const RangeSlider = () => {
  return (
    <div title="Filter the results based on the Number of Impacts">
    <label style={{ display: 'block', marginBottom: '2px' }}>Number of Impacts</label>
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
    </div>
  )
}

export default RangeSlider