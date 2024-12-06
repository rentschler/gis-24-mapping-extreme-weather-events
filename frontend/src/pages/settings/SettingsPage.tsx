import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { updateTimeRange } from '../../store/settingsSlice';


const SettingsPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { timeRange } = useSelector((state: RootState) => state.settings);

  const handleDateChange = (newRange: [string, string]) => {
    console.log('newRange = ', newRange);
    
    dispatch(updateTimeRange(newRange));
  };

  return (
    <div>
      <h2>Settings</h2>
      <label>
        Time Range:
        <input
          type="date"
          value={timeRange[0]}
          onChange={(e) => handleDateChange([e.target.value, timeRange[1]])}
        />
        <input
          type="date"
          value={timeRange[1]}
          onChange={(e) => handleDateChange([timeRange[0], e.target.value])}
        />
      </label>
      <p>
        {`Selected Time Range: ${timeRange[0]} - ${timeRange[1]}`}
      </p>
    </div>
  );
};

export default SettingsPage;
