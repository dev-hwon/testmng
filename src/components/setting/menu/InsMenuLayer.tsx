import React, { useCallback, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    NativeSelect,
    TextField,
} from '@mui/material';
import axios from 'axios';
import CommonKey from '../../../common/CommonKey';
import Swal from '../../../common/Swal';
import { useQueryClient } from 'react-query';
import MenuGroup from './MenuGroup';
import MenuFolder from './MenuFolder';

const apiUrl = '/api/setting/menu/insUpdMenu';

const InsMenuLayer = (props: any) => {
    const {
        reload,
        setReload,
        insPopOpen,
        onCloseInsLayer
    } = props;
    const [itmName, setItmName] = useState('');
    const [itmUrl, setItmUrl] = useState('');
    const [grNo, setGrNo] = useState(0);
    const [folderNo, setFolderNo] = useState(0);
    const { SwalAlert } = Swal();

    const menuType = useQueryClient().getQueryData(CommonKey.MENU_TYPE);
    const menuFolder = useQueryClient().getQueryData(CommonKey.MENU_FOLDER);

    const insertMenu = useCallback(() => {
        const params = {
            itm_nm: itmName,
            itm_url: itmUrl,
            itm_hg_no: folderNo,
        }

        const dataPromise = axios.get(apiUrl, { params });
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                const data = obj.data;
                if (data.result == 0) {
                    onCloseInsLayer();
                    SwalAlert("메뉴 등록 완료", "success");
                    setItmName('');
                    setItmUrl('');
                    setReload(!reload);
                }
            }
        });
    }, [grNo, folderNo, itmName, itmUrl, SwalAlert, onCloseInsLayer, reload, setReload]);

    const onClickInsBtn = () => {
        if (itmName.length == 0 || itmUrl.length == 0) {
            alert('메뉴 명/경로를 확인해주세요.');
            return false;
        }

        if (grNo == 0 || folderNo == 0) {
            alert('그룹 및 폴더를 확인해주세요.');
            return false;
        }
        insertMenu();
    }
    return (
        <Dialog
            fullWidth={true}
            maxWidth='sm'
            open={insPopOpen}
            onClose={onCloseInsLayer}> 
            <DialogTitle>메뉴 등록</DialogTitle>
            <DialogContent>
                 <MenuGroup data={menuType}
                    setGrNo={setGrNo}
                />
                {grNo && grNo != 0 ? 
                    <MenuFolder data={menuFolder}
                        grNo={grNo}
                        setFolderNo={setFolderNo} />
                    : <></>
                }
                <TextField
                    autoFocus
                    margin="dense"
                    name="itm_nm"
                    label="메뉴 명"
                    helperText="메뉴 명을 입력하세요."
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e)=> setItmName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    name="itm_url"
                    label="메뉴 경로"
                    helperText="메뉴 경로를 입력하세요."
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e)=> setItmUrl(e.target.value)}
                />          
            </DialogContent>
            <DialogActions>
                <Button onClick={onCloseInsLayer}>취소</Button>
                <Button  onClick={onClickInsBtn}>추가</Button>
            </DialogActions>
        </Dialog>
    )
}

export default InsMenuLayer;