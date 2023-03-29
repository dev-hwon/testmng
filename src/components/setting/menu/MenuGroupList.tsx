import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CommonKey from '../../../common/CommonKey';
import {Box, NativeSelect} from '@mui/material';
import { useQueryClient } from 'react-query';
import MenuGroup from './MenuGroup';
import MenuFolder from './MenuFolder';

const apiUrl = '/api/setting/menu/getMenuGroupList';
    
const MenuGroupList = (props: any) => {
    const {
        grNo,
        setGrNo,
        setFolderNo
    } = props;
    const [groupList, setGroupList] = useState([]);
    const [folderList, setFolderList] = useState([]);
    const queryClient = useQueryClient();

    useEffect(() => {
        window.scrollTo(0, 0);
        const dataPromise = axios.get(apiUrl);
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                const data = obj.data;
                if (data.result == 0) {
                    setGroupList(data.data.menuTypeArr);
                    setFolderList(data.data.menuGroupArr);
                    queryClient.setQueryData(CommonKey.MENU_TYPE, data.data.menuTypeArr);
                    queryClient.setQueryData(CommonKey.MENU_FOLDER, data.data.menuGroupArr);
                }
            }
        });
    }, [queryClient]);

    return (
        <Box className='menu_box_select'>
            <MenuGroup data={groupList}
                setGrNo={setGrNo}
            />
            {grNo && grNo != 0 ? 
                <MenuFolder data={folderList}
                    grNo={grNo}
                    setFolderNo={setFolderNo} />
                : <></>
            }
        </Box>
    );
};

export default MenuGroupList;