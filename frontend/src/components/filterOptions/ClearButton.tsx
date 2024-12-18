import { CloseCircleOutlined } from '@ant-design/icons';

interface ClearButtonProps {
    handleClear : ()=>void,
}

const ClearButton = ({handleClear}:ClearButtonProps) =>{
  return (
    <a onClick={handleClear} className='anticon anticon-close-circle'>{<CloseCircleOutlined />}</a>
  )
}

export default ClearButton