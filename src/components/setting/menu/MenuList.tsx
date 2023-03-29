
import {
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import CommonKey from '../../../common/CommonKey';
import PermissionLayer from './PermissionLayer';
import Swal from '../../../common/Swal';
import ModeRoundedIcon from '@mui/icons-material/ModeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import UpdMenuLayer from './UpdMenuLayer';

const apiUrl = '/api/setting/menu/getMenuList';

const UpdPopUp = () => {
    const [updPopOpen, setUpdPopOpen] = useState(false);

    const onOpenUpdLayer = useCallback(() => {
        setUpdPopOpen(true);
    }, [setUpdPopOpen]);

    const onCloseUpdLayer = useCallback(() => {
        setUpdPopOpen(false);
    }, [setUpdPopOpen]);

    return {
        updPopOpen,
        onOpenUpdLayer,
        onCloseUpdLayer
    }
}

const TableContents = (props: any) => {
    const { data, setItmNo, setPermissionLayerOpen, dptCodeSet, checkedList, setCheckedLists , onOpenUpdLayer} = props;
    //const qc = useQueryClient();
    
    const onClickDepartBtn = useCallback((no: any) => {
        setItmNo(no);
        setPermissionLayerOpen(true);
        
    }, [setItmNo, setPermissionLayerOpen]);
    
    const dataItem = [];
    for (let i = 0; i < data.length; i++) {
        dataItem.push(data[i]);
    }

    const onClickUpdBtn = useCallback((no: any) => {
        setItmNo(no);
        onOpenUpdLayer();
    }, [setItmNo, onOpenUpdLayer]);
    
    const listItem = dataItem.map((item, i) => (
        <TableRow key={i} >
            <TableCell align='center' size="medium">{item.itm_no}</TableCell>
            <TableCell>{item.itm_nm}</TableCell>
            <TableCell >
                <Link href={item.itm_url }>{item.itm_url}</Link>
            </TableCell>
            <TableCell align="center" size="medium">{item.lnk_tp_cd}</TableCell>
            <TableCell align="center" size="medium">{item.itm_lmt_yn}</TableCell>
            <TableCell align="center" size="medium">{item.itm_use_yn}</TableCell>
            <TableCell align="center" size="medium">{item.ins_dtm.substring(0,10)}</TableCell>
            <TableCell align="center" size="medium">{item.upd_dtm}</TableCell>
            <TableCell align="center" size="medium">
                <Button variant="contained" size="small" startIcon={<ModeRoundedIcon />} onClick={() => onClickUpdBtn(item.itm_no)}>수정</Button>
                <Button variant="outlined" size="small" startIcon={<SettingsRoundedIcon/>} onClick={() => onClickDepartBtn(item.itm_no)} sx={{ marginLeft: "4px" }} >
                    권한
                </Button>
            </TableCell>
        </TableRow >
    ))

    return (
        <TableBody>
            {dataItem.length != 0 ? listItem :
                <TableRow>
                    <TableCell align="center" colSpan={9}>등록된 메뉴가 없습니다.</TableCell>
                </TableRow>
            }
        </TableBody>
    )
}

const MenuList = (props: any) => {
    const { grNo, folderNo, reload, setReload } = props;
    const [permissionLayerOpen, setPermissionLayerOpen] = useState(false);
    const [selectedDptCode, setSelectedDptCode] = useState([]);
    const [menuList, setMenuList] = useState<menuListItem>(Object);
    const [checkedList, setCheckedLists] = useState([Object]);
    const [itmNo, setItmNo] = useState(0);
    const { updPopOpen, onOpenUpdLayer, onCloseUpdLayer } = UpdPopUp();
    

    useEffect(() => {
        window.scrollTo(0, 0);
        const url = window.location.href.split('&no')[0];
        window.history.replaceState(null, '', url);
        const params = {
            grNo,
            folderNo : grNo == 0? 0 : folderNo
        };
        const dataPromise = axios.get(apiUrl, { params });
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                const data = obj.data;
                if (data.result == 0) {
                    setMenuList(data.data);
                }
            }
        });
    }, [reload, grNo, folderNo]);

    return (
        <TableContainer sx={{ "margin": ".5rem 0 0" }}>
            {/* <Button variant="outlined" onClick={onClickDelBtn}>선택 삭제</Button> */}
            <Table aria-label="simple table" className="menu_table" sx={(theme) => ({bgcolor : theme.palette.background.paper })}>
                <TableHead>
                    <TableRow>
                        <TableCell size="small" align="center">번호</TableCell>
                        <TableCell size="small" align="center">메뉴 명</TableCell>
                        <TableCell size="small" align="center">경로</TableCell>
                        <TableCell size="small" align="center">경로 유형코드</TableCell>
                        <TableCell size="small" align="center">IP제한</TableCell>
                        <TableCell size="small" align="center">사용여부</TableCell>
                        <TableCell size="small" align="center">등록일</TableCell>
                        <TableCell size="small" align="center">최근 수정일</TableCell>
                        <TableCell size="small" align="center"></TableCell>
                    </TableRow>
                </TableHead>
                <TableContents
                    data={menuList}
                    checkedList={checkedList}
                    setItmNo = {setItmNo}
                    setCheckedLists={setCheckedLists}
                    setPermissionLayerOpen={setPermissionLayerOpen}
                    setSelectedDptCode={setSelectedDptCode}
                    onOpenUpdLayer={onOpenUpdLayer}/>
            </Table>
            {/* <Paging
                code={boardCode}
                size={40}
                count={10}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalCount={totalCount} /> */}
            <PermissionLayer
                itmNo={itmNo}
                menuList={menuList}
                selectedDptCode={selectedDptCode}
                setSelectedDptCode={setSelectedDptCode}
                permissionLayerOpen={permissionLayerOpen}
                setPermissionLayerOpen={setPermissionLayerOpen} />
            <UpdMenuLayer
                    itmNo = {itmNo}
                    reload={reload}
                    setReload={setReload}
                    updPopOpen={updPopOpen}
                    onCloseUpdLayer={onCloseUpdLayer}/>
        </TableContainer >
    );
};

export default MenuList;

type menuListItem = {
    itm_no: number,
    itm_nm: string,
    itm_hg_no: number,
    itm_url: string,
    lnk_tp_cd: string,
    itm_lmt_yn: string,
    itm_use_yn: string,
    ins_dtm: Date,
    upd_dtm: Date,
}
