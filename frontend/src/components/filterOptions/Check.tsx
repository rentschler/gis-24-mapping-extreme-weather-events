import { Checkbox, CheckboxProps } from 'antd'
import React, { useState } from 'react'

interface CheckProps {
    label: string;
}

const Check = ({ label }: CheckProps) => {
    const onChange2: CheckboxProps['onChange'] = (e) => {
        console.log('checked = ', e.target.checked);
        setChecked(e.target.checked);
    };
    const [checked, setChecked] = useState(true);

    return (
        <Checkbox checked={checked} onChange={onChange2} style={{ color: 'white' }}>
            {label}
        </Checkbox>
    )
}

export default Check