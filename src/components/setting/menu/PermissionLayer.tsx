import React, { useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    IconButton,
    Checkbox,
    FormControlLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import styled from '@emotion/styled';
import IconPlus from '@mui/icons-material/AddBoxRounded';
import IconMinus from '@mui/icons-material/IndeterminateCheckBoxRounded';
import Swal from '../../../common/Swal';
// /mng/setting/getEmpDepartList.jsp 전체 부서리스트
// /mng/setting/menu/getMenuList.jsp 열람 부서리스트
// /mng/setting/updDepartMenu.jsp 열람 부서 설정값
// /mng/setting/updDepartMenu.jsp

// 체크박스클릭시 하위레벨 체크박스 전체 체크되어야함 (반대로도 가능해야함)
// 체크박스클릭시 같은레벨 체크박스가 다 되어있으면 상위레벨 체크박스에 체크되어야함. (반대로도 가능해야함)
// 문제 :
// selectedDptCode 상태가 적용된 이후 해당코드가 있는지 여부 or 갯수체크하여 상위레벨 full_code를 추가해야함..
// 조건을 걸수 있는시점이 handlechange하는 시점인데 이때 상태값은 적용이전값을 가지고있어서 제대로 체크하기어려움.. (이거가능??이런 개발...)
// 외부에서 값을 정리해서 넘겨 상태업데이트 하도록해야할듯..
// 단순 체크박스만 작동하게 하려해도 최초 렌더링시점에서 selectedDptCode값을 비교하여 체크박스여부를 결정하기때문에 단순하게 처리가 안됨.

// 외부에서 값정리해서 상태업데이트시 setState는 하나만 존재해도될듯함. (최종값만 전달예정)

const GET_DPT_URL = '/api/setting/menu/getEmpDepartList'; // 전체부서리스트
const GET_PERMISSION_URL = '/api/setting/menu/getMenuDepartList'; //권한설정된부서리스트
const INS_UPD_PERMISSION_URL = '/api/setting/menu/insUpdPermission'; //권한설정업데이트

const PermissionCheckbox = (props: any) => {
    const [ fold, setFold ] = useState(false)
    const { ggparentData, gparentData, parentData, currentData, selectedDptCode, setSelectedDptCode } = props;
    const handleClick = () => {
        setFold((prev:any) => !prev)
    };
    
    const handleChange = useCallback((checked, dptCode, data) => {
        const tempArr: any = [];
        
        if (checked) {
            // 선택값추가
            tempArr.push(dptCode);
            // 선택한기준 자식있으면 추가
            if (currentData.child && currentData.child.length !== 0) {
                currentData.child.map((d: any) => {
                    tempArr.push(d.full_code);
                    if (d.child && d.child.length !== 0) {
                        d.child.map((s: any) => {
                            tempArr.push(s.full_code);
                            if (s.child && s.child.length !== 0) {
                                s.child.map((f: any) => {
                                    tempArr.push(f.full_code);
                                })
                            }
                        })
                    }
                })
            }
            
            // 선택됬던 코드랑비교해서 없는애들을 임시배열에 추가 
            selectedDptCode.forEach((el: any) => {
                if (!tempArr.includes(el)) {
                    tempArr.push(el);
                }
            })
            // 같은레벨이 임시배열에 들어가있는갯수와 상위레벨기준 자식갯수와 같으면 부모추가
            const addParentCode: any = [];
            if (parentData) { 
                parentData.child.forEach((el: any) => {
                    if (tempArr.includes(el.full_code)) {
                        addParentCode.push(el.full_code);
                    }
                })
                if (addParentCode.length === parentData.child.length) { 
                    tempArr.push(parentData.full_code)
                }
            }
            
            // 상태추가
            setSelectedDptCode( tempArr )
        } else {
            // 관련부모 전체 추가
            ggparentData && tempArr.push(ggparentData.full_code); 
            gparentData && tempArr.push(gparentData.full_code); 
            parentData && tempArr.push(parentData.full_code);
            
            // 선택값추가 
            tempArr.push(dptCode);
            // 선택한기준 자식있으면 추가
            if (currentData.child && currentData.child.length !== 0) {
                tempArr.push(dptCode);
                currentData.child.map((d: any) => {
                    tempArr.push(d.full_code);
                    if (d.child && d.child.length !== 0) {
                        d.child.map((s: any) => {
                            tempArr.push(s.full_code);
                            if (s.child && s.child.length !== 0) {
                                s.child.map((f: any) => {
                                    tempArr.push(f.full_code);
                                })
                            }
                        })
                    }
                })
            }
            // 임시배열 생성, 기존상태에서 선택한값과 일치하지않는값들 추가 ( 위에서 선택한값을 기존상태에서 뺀 배열 )
            const eceptTempArr: any = [];
            selectedDptCode.forEach((el: any) => {
                if (!tempArr.includes(el)) {
                    eceptTempArr.push(el);
                }
            })
            // 뺸배열 상태적용 
            setSelectedDptCode(eceptTempArr)
        }      
    }, [ggparentData, gparentData, parentData, currentData, selectedDptCode, setSelectedDptCode ])

    const isChecked = () => { 
        const result = selectedDptCode.filter((d: any) => d === currentData.full_code).length !== 0 ? true : false
        return result;
    }
    
    return (
        <>
            { currentData.child && 
                <IconButton className='accordion-button' color="primary" aria-label="accordion-button" component="label" onClick={handleClick}>
                    { !fold ? <IconMinus /> : <IconPlus /> }
                </IconButton>
            }
            <FormControlLabel
            className={`permission_checkbox ${!fold ? 'visibleChild' : ''}`} 
            control={<Checkbox
                onChange={(e) => handleChange(e.target.checked, currentData.full_code, currentData)}
                checked={ isChecked() }
                name={'dpt_' + currentData.full_code}
                value={currentData.full_code} />}
            label={currentData.epa_name + '-' + currentData.full_code} />
        </>
    );
}

const Department = (props: any) => {
    const { list, selectedDptCode, setSelectedDptCode } = props;
    return (
        <>
            <Box className='permission_list' sx={(theme) => ({bgcolor : theme.palette.background.paper })}>
                <ul>
                    <li className={"step_" + list[0].epa_step}>
                        <PermissionCheckbox currentData={list[0]} selectedDptCode={selectedDptCode} setSelectedDptCode={setSelectedDptCode} />
                    </li>
                    { list.map((q: any) =>
                        q.full_code.length === 3 &&
                        q.full_code !== '000' &&
                        <li key={q.full_code} className={"step_" + q.epa_step}>
                            <PermissionCheckbox currentData={q} selectedDptCode={selectedDptCode} setSelectedDptCode={setSelectedDptCode} />
                            <ul>
                                { q.child && q.child.map((w:any) => w.epa_upcode === q.epa_code &&
                                    <li key={w.full_code} className={"step_" + w.epa_step}>
                                        <PermissionCheckbox parentData={q} currentData={w} selectedDptCode={selectedDptCode} setSelectedDptCode={setSelectedDptCode} />
                                        <ul>
                                            { w.child && w.child.map((r:any) => r.epa_upcode === w.epa_code &&
                                                <li key={r.full_code} className={"step_" + r.epa_step}>
                                                    <PermissionCheckbox gparentData={q} parentData={w} currentData={r} selectedDptCode={selectedDptCode} setSelectedDptCode={setSelectedDptCode} />
                                                    <ul>
                                                        { r.child && r.child.map((t:any) =>  t.epa_upcode === r.epa_code &&
                                                            <li key={t.full_code} className={"step_" + t.epa_step}>
                                                                <PermissionCheckbox ggparentData={q} gparentData={w} parentData={r} currentData={t} selectedDptCode={selectedDptCode} setSelectedDptCode={setSelectedDptCode} />
                                                            </li>
                                                        )}
                                                    </ul>
                                                </li>
                                            )}
                                        </ul>
                                    </li>
                                )}
                            </ul>
                        </li>
                    )}
                </ul>
            </Box>
        </>
    )
}

export default function PermissionLayer(props: any) {
    const { itmNo, permissionLayerOpen, setPermissionLayerOpen, selectedDptCode, setSelectedDptCode } = props;
    const [departmentList, setDepartmentList] = useState(
        {loading: false, dptList:[] as any }
    );
    const { loading, dptList } = departmentList;
    const { SwalAlert } = Swal();

    useEffect(() => { 
        if (permissionLayerOpen) { 
            const params = {
                itm_no : itmNo
            };
            const dataPromise = axios.get(GET_PERMISSION_URL, { params });
            dataPromise.then(function (obj: any) {
                if (obj && obj.data) {
                    const data = obj.data;
                    if (data.result == 0) {
                        setSelectedDptCode(data.data.map((d:any) => d.dpt_cd));
                    }
                }
            });
        }
    },[itmNo, setSelectedDptCode, permissionLayerOpen])
    
    useEffect(() => {
        const dataPromise = axios.get(GET_DPT_URL);
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                const data = obj.data;
                if (data.result == 0) {
                    setDepartmentList({
                        loading : false,
                        dptList: data.data
                    });
                }
            }
        });
    }, []);

    const handleUpdate = () => {
        let dpt1 = selectedDptCode.filter((item: any) => item.length == 3);
        let dpt2 = selectedDptCode.filter((item: any) => item.length == 6);
        let dpt3 = selectedDptCode.filter((item: any) => item.length == 9);
        let dpt4 = selectedDptCode.filter((item: any) => item.length == 12);

        for (let i = 0; i < dpt1.length; i++) {
            const item1 = dpt1[i];
            dpt2 = dpt2.filter((item: any) => !item.includes(item1));
            dpt3 = dpt3.filter((item: any) => !item.includes(item1));
            dpt4 = dpt4.filter((item: any) => !item.includes(item1));
        }
        for (let i = 0; i < dpt2.length; i++) {
            const item2 = dpt2[i];
            dpt3 = dpt3.filter((item: any) => !item.includes(item2));
            dpt4 = dpt4.filter((item: any) => !item.includes(item2));
        }
        for (let i = 0; i < dpt3.length; i++) {
            const item3 = dpt3[i];
            dpt4 = dpt4.filter((item: any) => !item.includes(item3));
        }

        const params = {
            itm_no: itmNo,
            dpt_cds: `${dpt1.join()},${dpt2.join()},${dpt3.join()},${dpt4.join()}`
        }
        const dataPromise = axios.get(INS_UPD_PERMISSION_URL, { params });
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                const data = obj.data;
                if (data.result == 0) {
                    SwalAlert("권한수정완료", "success");
                    setPermissionLayerOpen(false);
                    setSelectedDptCode([]);
                }
            }
        });
    };
    
    const handleClose = () => {
        setPermissionLayerOpen(false);
        setSelectedDptCode([]);
    };
    
    return (
        <Dialog
            fullWidth={true}
            maxWidth='lg'
            open={permissionLayerOpen}
            onClose={handleClose}
            scroll="paper"
            >
            <DialogTitle>권한설정</DialogTitle>
            <DialogContent>
                <DialogContentSummary>
                    권한 부여할 부서를 선택하세요.
                </DialogContentSummary>
                <DialogContentText style={{color: "red"}}>
                    광고영업1팀/광고운영팀 에누리 그룹 폴더 접근 제한
                </DialogContentText>
                <Box>
                    {loading ? (
                            "loading.."
                    ) : (
                        <Department list={dptList} selectedDptCode={selectedDptCode} setSelectedDptCode={setSelectedDptCode} />
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>취소</Button>
                <Button onClick={handleUpdate}>수정</Button>
            </DialogActions>
        </Dialog>
    );
}

const DialogContentSummary = styled.div`
    font-size:14px;
    color:#888;
`;
