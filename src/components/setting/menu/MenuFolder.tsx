 import React, { useEffect} from 'react';
import { NativeSelect } from '@mui/material';

 // 폴더
const MenuFolder = (props: any) => {
    const { data, grNo, setFolderNo } = props;

    useEffect(() => {
        setFolderNo(0);
    }, [grNo, setFolderNo]);

    const filterData = data.filter((item: any) => grNo == item.gr_hg_no);
    const listItem = filterData.map((item: any, idx: any) => (
        <option
            key={item.gr_no}
            value={item.gr_no}
            defaultValue={idx == 0 ? item.gr_no : '' }>
            {item.title}
        </option >
    ));

    const onChangeFolder = (e: any) => {
        setFolderNo(e.target.value);
    }
    
    return (
        <NativeSelect
            className='menu_select'
            onChange={(e) => onChangeFolder(e)}
        >
            <option value={0}>전체</option>
            {listItem}
        </NativeSelect>
    )
}

export default MenuFolder