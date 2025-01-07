import { Checkbox, CheckboxProps, Tooltip } from 'antd'

interface CheckProps {
    label: string;
    checked: boolean;
    setChecked: (checked: boolean) => void;
    disabled?: boolean;
    title?: string;
}

const Check = ({ label, checked, setChecked, disabled=false, title }: CheckProps) => {
    const onChange2: CheckboxProps['onChange'] = (e) => {
        console.log('checked = ', e.target.checked);
        setChecked(e.target.checked);
    };

    return (
        <Tooltip title={title} placement="left">
            <Checkbox checked={checked} 
                onChange={onChange2} 
                disabled={disabled}
            >
                <span 
                    style={{color: disabled ? 'gray' : 'white'}}
                > {label} </span>
            </Checkbox>
        </Tooltip>
    )
}

export default Check