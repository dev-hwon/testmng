import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    TextField,
    NativeSelect
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import CommonKey from '../../../common/CommonKey';
import Swal from '../../../common/Swal';

const insUpdApiUrl = '/api/setting/menu/insUpdMenu';
const detApiUrl = '/api/setting/menu/getMenuDetail';
const delApiUrl = '/api/setting/menu/delMenu'

const UpdMenuLayer = (props: any) => {
    const { itmNo, reload, setReload, updPopOpen, onCloseUpdLayer } = props;
    const [menuItem, setMenuItem] = useState(Object);
    const { SwalAlert, SwalConfirm } = Swal();
    //const { } = UpdMenu();

    useEffect(() => {
        if (updPopOpen) {
            const params = {
                itm_no: itmNo
            }
            const dataPromise = axios.get(detApiUrl, { params });
            dataPromise.then(function (obj: any) {
                if (obj && obj.data) {
                    const data = obj.data;
                    if (data.result == 0) {
                        setMenuItem(data.data);
                    }
                }
            });     
        }
    }, [updPopOpen, itmNo]);

    const updMenuItem = useCallback((values: any) => {
        const params = {
            itm_no: itmNo,
            itm_nm: values.itm_nm,
            itm_url: values.itm_url,
            itm_hg_no: values.itm_hg_no,
            itm_lmt_yn: values.itm_lmt_yn,
            lnk_tp_cd: values.lnk_tp_cd,
            itm_use_yn: values.itm_use_yn,
        }
        const dataPromise = axios.get(insUpdApiUrl, { params });
            dataPromise.then(function (obj: any) {
                if (obj && obj.data) {
                    const data = obj.data;
                    if (data.result == 0) {
                        onCloseUpdLayer();
                        SwalAlert("메뉴 수정 완료", "success");
                        setReload(!reload);
                    }
                }
            });     
    }, [itmNo, SwalAlert, onCloseUpdLayer, reload, setReload]);

    const delMenuItem = useCallback(() => {
        const params = {
            itm_no: itmNo,
        }
        const dataPromise = axios.get(delApiUrl, { params });
            dataPromise.then(function (obj: any) {
                if (obj && obj.data) {
                    const data = obj.data;
                    if (data.result == 0) {
                        onCloseUpdLayer();
                        SwalAlert("메뉴 삭제 완료", "success");
                        setReload(!reload);
                    } else if (data.result == -2) {
                        onCloseUpdLayer();
                        SwalAlert("게시글이 존재하는 메뉴입니다.", "warning");
                    }
                }
            });     
    }, [itmNo, SwalAlert, onCloseUpdLayer, reload, setReload]);

    const onClickDelBtn = () => {
        SwalConfirm("메뉴 삭제", "정말 메뉴를 삭제하시겠습니까?").then((result) => {
            if (result) {
                delMenuItem();
            } else {
                return false;
            }
        });
    }

    const initialValues = {
        itm_nm: menuItem.itm_nm || '',
        itm_url: menuItem.itm_url || '',
        itm_hg_no: menuItem.itm_hg_no || '',
        itm_lmt_yn: menuItem.itm_lmt_yn || '',
        lnk_tp_cd: menuItem.lnk_tp_cd || '',
        itm_use_yn: menuItem.itm_use_yn || '',
    }

    const validationSchema = Yup.object().shape({
        itm_nm: Yup.string().required("메뉴명 입력하세요."),
        itm_url: Yup.string().required("메뉴 경로를 입력하세요."),
    });

    return (
        <Dialog
        fullWidth={true}
        maxWidth='sm'
        open={updPopOpen}
        onClose={onCloseUpdLayer}
        scroll="paper"
        >
            <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                updMenuItem(values);
            }}>{
                    ({ isSubmitting, touched, errors }) => (
                        <Form> 
                            <DialogTitle>메뉴 수정</DialogTitle>
                            <DialogContent>
                                <Field
                                    as={TextField}
                                    autoFocus
                                    required
                                    margin="dense"
                                    name="itm_nm"
                                    label="메뉴 명"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    error={Boolean(touched.itm_nm && errors.itm_nm)}
                                />
                                {touched.itm_nm && errors.itm_nm ? (<div style={{ color: "red" }}>{errors.itm_nm}</div>) : <div></div>}
                                <Field
                                    as={TextField}
                                    className='menu_upd_box'
                                    required
                                    margin="dense"
                                    name="itm_url"
                                    label="메뉴 경로"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    error={Boolean(touched.itm_url && errors.itm_url)}
                                />
                                {touched.itm_url && errors.itm_url ? (<div style={{ color: "red" }}>{errors.itm_url}</div>) : <div></div>}        
                                <span>경로 유형코드</span>
                                <Field
                                    as={NativeSelect}
                                    margin="dense"
                                    name="lnk_tp_cd"
                                    label="경로 유형코드"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    defaultChecked={touched.lnk_tp_cd}
                                >
                                    <option value="I">I(내부)</option>
                                    <option value="O">O(외부)</option>
                                </Field>
                                <span>IP제한</span>
                                <Field
                                    as={NativeSelect}
                                    margin="dense"
                                    name="itm_lmt_yn"
                                    label="IP제한"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    defaultChecked={touched.itm_lmt_yn}
                                >
                                    <option value="N">N</option>
                                    <option value="Y">Y</option>
                                </Field>
                                <span>사용여부</span>
                                <Field
                                    as={NativeSelect}
                                    margin="dense"
                                    name="itm_use_yn"
                                    label="사용여부"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    defaultChecked={touched.itm_use_yn}
                                >
                                    <option value="N">N</option>
                                    <option value="Y">Y</option>
                                </Field>
                                <Button sx={{marginTop: "1rem"}} variant="contained" color="error" size='small' onClick={() => onClickDelBtn()}>메뉴 삭제</Button>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={onCloseUpdLayer}>취소</Button>
                                <Button type='submit' disabled={isSubmitting}>수정</Button>
                            </DialogActions>
                        </Form>
                    )
                }
            </Formik>
        </Dialog>
    )
};

export default UpdMenuLayer;

// export interface MenuItem {
//     itm_no: number, 
//     itm_url: string, 
//     itm_hg_no: number,
//     itm_lmt_yn: string,
//     itm_use_yn: string, 
//     ins_dt: Date,

// }