import React, { useEffect} from 'react';
import { NativeSelect } from '@mui/material';

// 타입 (에누리, 광고팀 등)
const MenuGroup = (props: any) => {
    const { data, setGrNo } = props;

    if (typeof data == 'undefined') {
        window.location.reload();
    }

    const listItem = data.map((item: any) => (
        <option key={item.gr_no} value={item.gr_no}>
            {item.title}
        </option >
    ));

    const onChangeGroup = (e: any) => {
        setGrNo(e.target.value);
        console.log(e.target.value)
    }

    return (
        <NativeSelect
            className='menu_select'
            onChange={(e) => onChangeGroup(e)}
        >
            <option value={0}>전체</option>
            {listItem}
        </NativeSelect>
        )
}
export default MenuGroup;