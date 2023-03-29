import { Field, Form, Formik } from 'formik';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useCallback, useState } from 'react';
import { Button, Checkbox, TextareaAutosize, TextField } from '@mui/material';
import BootstrapInput from './BootStrapInput';
import * as Yup from "yup";

import Swal from '../../common/Swal';
import axios from 'axios';
import { Box } from 'react-feather';
const { SwalAlert } = Swal();

const INS = 'INS';
const INS_REP = 'INS_REP';
const UPD = 'UPD';
const url = '/api/board/boardList';
const uploadUrl = '/api/board/fileUpload';

const SetBoardData = (setShowAddForm: any, addFormFlag: number, user: any, getBoardList: Function) => {

    const addBoard = useCallback((params: any, resetForm: Function, setSubmitting: Function) => {

        const dataPromise = axios.get(url, { params });
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                let data = obj.data;
                if (data.result == 0) {
                    SwalAlert(addFormFlag == 0 ? "게시글 작성이 완료되었습니다." : "게시글 수정이 완료되었습니다.", "success");
                    resetForm({});
                    setSubmitting(false);
                    setShowAddForm(false);
                    getBoardList(params.board_code, 1, "", "");
                } else {
                    SwalAlert("다시 시도해주세요.", "warning");
                    return;
                }
            }
        })
    }, [getBoardList, setShowAddForm, addFormFlag])

    const setBoardParams = useCallback((values: any, resetForm: Function, setSubmitting: Function, file1: File, file2: File) => {

        const getUserGeolocationDetails = fetch("https://geolocation-db.com/json/");
        getUserGeolocationDetails.then(res => res.json()).then(data => {
            if (addFormFlag == 1 && values.password != values.origin_pswd) {
                SwalAlert("비밀번호가 맞지 않습니다.", "warning");
            }

            const params = {
                type: (addFormFlag == 0 ? INS : (addFormFlag == 1 ? UPD : INS_REP)),
                emloc_no: values.emloc_no,
                parent_no: values.parent_no,
                seq_no: values.seq_no,
                blank_in: values.blank_in,
                subject: encodeURI(values.subject),
                is_notice: (values.isNotice ? 1 : 0),
                writer: user.name,
                mm_id: user.id,
                usr_no: user.no,
                board_code: values.boardCode,
                contents: values.content.replace(/\n/g, "\r\n"),
                pswd: values.password,
                ip_addr: data.IPv4,
                kind_code: 0,
            }

            // let fileData = [];
            // fileData.push(file1);
            // fileData.push(file2);
            // fileUpload(fileData);
            addBoard(params, resetForm, setSubmitting);
        });
    }, [addBoard, addFormFlag, user])



    const fileUpload = useCallback((data: any) => {
        console.log(data)
        // let formData = new FormData();
        for (let i in data) {
            const params = {
                fileName: data[i]
            }
            const dataPromise = axios.get(uploadUrl, { params });
            dataPromise.then(function (obj: any) {
                if (obj && obj.data) {
                    let data = obj.data;
                    if (data.result == 0) {
                        console.log(data.data);
                    } else {
                        SwalAlert("다시 시도해주세요.", "warning");
                        return;
                    }
                }
            })
        }
    }, [])

    return { setBoardParams }
}


const BoardAdd = (props: any) => {
    const {
        addFormFlag, // 0: insert, 1: update
        boardDetailItem,
        boardCode,
        boardName,
        user,
        setShowAddForm,
        getBoardList,
        setShowForm,
    } = props;

    const {
        setBoardParams
    } = SetBoardData(setShowAddForm, addFormFlag, user, getBoardList);

    const [file1, setFile1] = useState(Object);
    const [file2, setFile2] = useState(Object);

    const initialValues = {
        emloc_no: boardDetailItem.no,
        parent_no: boardDetailItem.parent_no,
        seq_no: boardDetailItem.seq_no,
        blank_in: boardDetailItem.blank_in,
        boardCode: boardCode,
        subject: (addFormFlag == 0 ? "" : boardDetailItem.subject),
        isNotice: (addFormFlag == 0 ? false : (boardDetailItem.is_notice == 0 ? false : true)),
        writer: `${user.name} ( ${user.id} )`,
        content: (addFormFlag == 0 ? "" : boardDetailItem.contents),
        password: (addFormFlag == 0 ? "" : boardDetailItem.pswd),
        file1: "",
        file2: "",
        origin_pswd: boardDetailItem.pswd
    }

    const validationSchema = Yup.object().shape({
        subject: Yup.string().required("제목을 입력하세요."),
        content: Yup.string().required("내용을 입력하세요."),
        password: Yup.string()
            .min(4, "최소 4자리 이상 입력해주세요.")
            .max(12, "최대 12자리까지 입력 가능합니다.")
            .required("비밀번호를 입력해주세요."),
    });

    const btnClickCancel = () => {
        setShowAddForm(false);
        if (addFormFlag == 0) {
            setShowForm(false);
        } else {
            setShowForm(true);
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                setBoardParams(values, resetForm, setSubmitting, file1, file2);
            }}>
            {
                ({ isSubmitting, touched, errors }) => (
                    <Form>
                        {addFormFlag != 0 ?
                            <Box>
                                <Field type="hidden" name="emloc_no" />
                                <Field type="hidden" name="origin_pswd" />
                            </Box>
                            : <></>
                        }
                        <TableContainer className="board_add_form">
                            <Table className="board_table" sx={{ height: "auto" }}>
                                <TableHead className='board_sub'>
                                    <TableRow>
                                        <TableCell size="small" >
                                            <Field type="hidden" name="boardCode" />
                                            위치: {boardName}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell size="small">
                                            <Field type="hidden" name="writer" />
                                            작성자: {user.name + "(" + user.id + ")"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell size="small" >
                                            <Field
                                                as={TextField}
                                                name="subject"
                                                fullWidth
                                                placeholder='제목'
                                                size='small'
                                                autoFocus
                                                error={Boolean(touched.subject && errors.subject)}
                                            />
                                            {touched.subject && errors.subject ? (<div style={{ color: "red" }}>{errors.subject}</div>) : <div></div>}
                                            <Field as={Checkbox} label="공지 등록" name="isNotice" defaultChecked={initialValues.isNotice || false} />공지등록
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Field
                                                as={TextareaAutosize}
                                                name="content"
                                                placeholder='내용'
                                                className="board_add_content"
                                            />
                                            {touched.content && errors.content ? (<div style={{ color: "red" }}>{errors.content}</div>) : <div></div>}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Field
                                                as={TextField}
                                                name="password"
                                                fullWidth
                                                placeholder='비밀번호'
                                                size='small'
                                            />
                                            {touched.password && errors.password ? (<div style={{ color: "red" }}>{errors.password}</div>) : <div></div>}
                                            {addFormFlag == 0 ?
                                                <span className="board_add_pswd">* 게시글 수정/삭제 시 필요합니다.</span>
                                                : <span className="board_add_pswd">* 비밀번호를 입력해주세요.</span>
                                            }
                                        </TableCell>
                                    </TableRow>
                                    {/* <TableRow>
                                        <TableCell >
                                            <Box>
                                                <Field
                                                    type="file"
                                                    name="file1"
                                                    onChange={(e: any) => {
                                                        // setFieldValue("file", e.target.files[0])
                                                        setFile1(e.target.files[0])
                                                    }}
                                                />
                                            </Box>
                                            <Box>
                                                <Field
                                                    type="file"
                                                    name="file2"
                                                    onChange={(e: any) => {
                                                        setFile2(e.target.files[0])
                                                    }}
                                                />
                                            </Box>
                                        </TableCell>
                                    </TableRow> */}
                                    <TableRow>
                                        {user.id == boardDetailItem.mm_id ?
                                            <TableCell>
                                                <Button variant="outlined" onClick={btnClickCancel}>취소</Button>&nbsp;
                                                <Button type="submit" variant='outlined' disabled={isSubmitting}>{addFormFlag == 0 ? "등록" : "저장"}</Button>
                                            </TableCell>
                                            : <></>}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Form>
                )
            }
        </Formik >
    )
}
export default BoardAdd;

BoardAdd.defaultProps = {
    addFormFlag: 0,
    boardDetailItem: {},
    boardCodeList: [],
    boardCode: 9999,
    user: {},
    setShowAddForm: false,
    getBoardList: false,
    setShowForm: null,
}
