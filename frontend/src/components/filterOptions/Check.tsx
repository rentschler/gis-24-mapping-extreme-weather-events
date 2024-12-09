import { Checkbox, CheckboxProps } from 'antd'

interface CheckProps {
    label: string;
    checked: boolean;
    setChecked: (checked: boolean) => void;
}

const Check = ({ label, checked, setChecked }: CheckProps) => {
    const onChange2: CheckboxProps['onChange'] = (e) => {
        console.log('checked = ', e.target.checked);
        setChecked(e.target.checked);
    };

    return (
        <Checkbox checked={checked} onChange={onChange2} style={{ color: 'white' }}>
            {label}
        </Checkbox>
    )
}

export default Check