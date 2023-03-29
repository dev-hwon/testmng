import React, { useCallback, useEffect, useState } from 'react';
import styled from "@emotion/styled";
import { Box } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Checkbox, FormControlLabel, TextareaAutosize, Typography } from '@mui/material';
import AnswerIcon from '@mui/icons-material/QuestionAnswerOutlined';
import BoardPaging from './BoardPaging';
import axios from 'axios';
import Swal from '../../common/Swal';
import { useQueryClient } from 'react-query';

const { SwalAlert, SwalConfirm } = Swal();


const SEL = 'SEL';
const INS = 'INS';
const UPD = 'UPD';
const DEL = 'DEL';
const url = '/api/board/comment';

const CmtList = (props: any) => {
    const { emloc_no, data, user, updCmt, delCmt, boardCode, getBoardList, currentPage, cmtCurrentPage } = props;
    const [updNum, setUpdNum] = useState(0);
    const [updContent, setUpdContent] = useState('');
    const [updIsSecret, setUpdIsSecret] = useState(false);
    const dataItem = [];
    for (let i = 0; i < data.length; i++) {
        dataItem.push(data[i]);
    }

    useEffect(() => {
        setUpdNum(0);
    }, [data])

    const btnUpdCmt = (cmt_idx: number) => {
        setUpdNum(0);
        updCmt(cmt_idx, updContent, updIsSecret, emloc_no, cmtCurrentPage);
    }

    const btnDelCmt = (cmt_idx: number) => {
        SwalConfirm("댓글 삭제", "정말로 댓글을 삭제하시겠습니까?").then((result) => {
            if (result) {
                delCmt(cmt_idx, emloc_no, getBoardList(boardCode, currentPage));
            } else {
                return;
            }
        });
    }

    const queryClient = useQueryClient();
    // const list = queryClient.getQueryData('boardList');
    // console.log(list);
    const xsmall = {
        fontSize : "12px", padding: "0 6px", minWidth: "auto", margin: "0 2px"
    }
    const listItem = dataItem.map((item) => (
        <TableBody key={item.cmt_idx} >
            <TableRow>
                <TableCell>
                    <CmtListHeader>
                        <AnswerIcon sx={{ fontSize : "19px", marginRight : "4px", verticalAlign: "top"}}></AnswerIcon>
                        {item.cmt_username}({item.cmt_userid})
                        <div className='board_cmt_regdate'>
                            (<span>{item.cmt_regdate.split(" ")[0]}</span> / <span>{item.cmt_regdate.split(" ")[1]}</span>)
                        </div>
                        {(user.id == item.cmt_userid) ?
                            (updNum != item.cmt_idx ?
                                <span>
                                    <Button variant="outlined" size="small" sx={xsmall} onClick={() => setUpdNum(item.cmt_idx)}>수정</Button>
                                    <Button variant="outlined" color='error' sx={xsmall} size="small" onClick={() => btnDelCmt(item.cmt_idx)}>삭제</Button>
                                </span> : <span>
                                    <Button variant="outlined" size="small" sx={xsmall} onClick={() => btnUpdCmt(item.cmt_idx)}>저장</Button>
                                    <Button variant="outlined" color='inherit' size="small" sx={xsmall} onClick={() => setUpdNum(0)}>취소</Button>
                                </span>
                            )
                            : ""
                        }
                    </CmtListHeader>
                    {
                        item.is_secret == 1 && (user.id != item.cmt_userid) ?
                            <CmtListBody><b> 비밀글 입니다.</b></CmtListBody>
                            : (updNum != item.cmt_idx ?
                                <CmtListBody><Typography gutterBottom dangerouslySetInnerHTML={{ __html: item.cmt_content.replace(/\r\n/g, "<br/>") }} /></CmtListBody>
                                :
                                <CmtListBody>
                                    <TextareaAutosize
                                        defaultValue={item.cmt_content.replace(/\r\n/g, "<br/>")}
                                        onChange={(e) => setUpdContent(e.target.value)}
                                        style={{ height: '100px', width: "100%", padding: "12px 6px", resize: "vertical"  }}
                                    />
                                    <FormControlLabel control={<Checkbox defaultChecked={item.is_secret == 0 ? false : true} onChange={(e) => setUpdIsSecret(e.target.checked)} />} label="비밀글" />
                                </CmtListBody>
                            )
                    }
                </TableCell>
            </TableRow>
        </TableBody >
    ))

    return (
        <Table className="board_table">
            <TableHead className="board_sub">
                <TableRow>
                    <TableCell size="small">
                        <b>댓글</b>
                    </TableCell>
                </TableRow>
            </TableHead>
            {listItem}
        </Table>
    )
}

const CmtDetail = () => {
    const [cmtList, setCmtList] = useState<cmtList>(Object);
    const [cmtCurrentPage, setCmtCurrentPage] = useState(1);
    const [cmtTotalCount, setCmtTotalCount] = useState(0);
    const [cmtTotalPage, setCmtTotalPage] = useState(0);
    const [cmtStartPage, setCmtStartPage] = useState(1);
    const [cmtEndPage, setCmtEndPage] = useState(1);
    const [cmtPageSize, setCmtPageSize] = useState(0);

    const [comment, setComment] = useState('');
    const [isSecret, setIsSecret] = useState(false);

    const getDetailCmt = useCallback((emloc_no: number, page: number) => {
        const params = {
            type: SEL,
            emloc_no,
            currentPage: page
        }

        const dataPromise = axios.get(url, { params });
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                let data = obj.data;
                if (data.result == 0) {
                    setCmtList(data.data);
                    setCmtTotalCount(data.totalCount);
                    setCmtTotalPage(data.totalPage);
                    setCmtStartPage(data.startPage);
                    setCmtEndPage(data.endPage);
                    setCmtPageSize(data.pageSize);
                } else {
                }
            }
        });
    }, [])

    const addCmt = useCallback((no: number, user: any, text: string, is_secret: Boolean, getBoardList: Function) => {
        const params = {
            type: INS,
            emloc_no: no,
            cmt_userid: user.id,
            cmt_username: user.name,
            cmt_content: text,
            is_secret: is_secret ? 1 : 0
        }

        const dataPromise = axios.get(url, { params });
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                let data = obj.data;
                if (data.result == 0) {
                    getDetailCmt(no, 1);
                    setComment('');
                    setIsSecret(false);
                    getBoardList;
                } else {
                    SwalAlert("다시 시도해주세요.", "warning");
                }
            }
        });
    }, [getDetailCmt])

    const updCmt = useCallback((no: number, text: string, is_secret: Boolean, emloc_no: number, cmtCurrentPage: number) => {
        const params = {
            type: UPD,
            cmt_idx: no,
            cmt_content: text,
            is_secret: is_secret ? 1 : 0
        }

        const dataPromise = axios.get(url, { params });
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                let data = obj.data;
                if (data.result == 0) {
                    getDetailCmt(emloc_no, cmtCurrentPage);
                } else {
                    SwalAlert("다시 시도해주세요.", "warning");
                }
            }
        });
    }, [getDetailCmt])

    const delCmt = useCallback((cmt_idx: number, emloc_no: number, getBoardList: Function) => {
        const params = {
            type: DEL,
            cmt_idx,
            emloc_no
        }

        const dataPromise = axios.get(url, { params });
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                let data = obj.data;
                if (data.result == 0) {
                    SwalAlert("삭제가 완료되었습니다.", "success");
                    getDetailCmt(emloc_no, cmtCurrentPage);
                    getBoardList;
                } else {
                    SwalAlert("다시 시도해주세요.", "warning");
                }
            }
        });
    }, [getDetailCmt, cmtCurrentPage])


    return {
        cmtList,
        cmtCurrentPage,
        cmtTotalCount,
        cmtTotalPage,
        cmtStartPage,
        cmtEndPage,
        cmtPageSize,
        comment,
        isSecret,
        setComment,
        setIsSecret,
        setCmtCurrentPage,
        getDetailCmt,
        addCmt,
        updCmt,
        delCmt
    }
}

const CmtForm = (props: any) => {
    const [activeCmt, setActiveCmt] = useState(false);
    const { boardDetailItem, user, boardCode, getBoardList, currentPage } = props;

    const {
        cmtList,
        cmtCurrentPage,
        cmtTotalCount,
        cmtTotalPage,
        cmtStartPage,
        cmtEndPage,
        cmtPageSize,
        comment,
        isSecret,
        setComment,
        setIsSecret,
        setCmtCurrentPage,
        getDetailCmt,
        addCmt,
        updCmt,
        delCmt
    } = CmtDetail();

    useEffect(() => {
        getDetailCmt(boardDetailItem.no, 1);
        setCmtCurrentPage(1);
        setComment('');
        setIsSecret(false);
    }, [boardDetailItem.no, getDetailCmt, setCmtCurrentPage, setComment, setIsSecret])

    useEffect(() => {
        getDetailCmt(boardDetailItem.no, cmtCurrentPage);
        window.scrollTo(0, 0);
    }, [getDetailCmt, boardDetailItem.no, cmtCurrentPage]);

    const btnAddCmt = () => {
        console.log(isSecret)
        if (comment.trim() == "") {
            SwalAlert("내용을 입력해주세요.", "warning");
        } else {
            addCmt(boardDetailItem.no, user, comment, isSecret, getBoardList(boardCode, currentPage));
        }
    }
    const btnActiveCmt = () => { 
        setActiveCmt(!activeCmt)
    }
    return (
        <>
            <Box sx={(theme) => ({ bgcolor: theme.palette.background.paper, "margin": "1rem 0 0" })} style={cmtTotalCount > 0 ? { "display": "block" } : { "display": "none" }}>
                <CmtList
                    emloc_no={boardDetailItem.no}
                    data={cmtList}
                    user={user}
                    updCmt={updCmt}
                    delCmt={delCmt}
                    boardCode={boardCode}
                    getBoardList={getBoardList}
                    currentPage={currentPage}
                    cmtCurrentPage={cmtCurrentPage} />
            </Box>
            {!activeCmt && 
                <Box sx={{ textAlign: "right" }} >
                    <Button
                        variant="contained"
                        sx={{ margin: ".5rem 0 0" }}
                        size='small'
                        onClick={btnActiveCmt}>댓글작성</Button>
                </Box>
            }
            <BoardPaging
                data={cmtList}
                setCurrentPage={setCmtCurrentPage}
                currentPage={cmtCurrentPage}
                totalCount={cmtTotalCount}
                startPage={cmtStartPage}
                endPage={cmtEndPage}
                totalPage={cmtTotalPage}
                pageSize={cmtPageSize}
            />
            {activeCmt &&
                <Box sx={(theme) => ({ bgcolor: theme.palette.background.paper, "margin": "1rem 0 0" })} >
                    <Table className="board_table" sx={{ height: 100 }} >
                        <TableHead className="board_sub">
                            <TableRow>
                                <TableCell colSpan={4} size="small">
                                    <b>댓글쓰기</b>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <TextareaAutosize
                                        placeholder='내용'
                                        className='cmt_add_content'
                                        style={{ height: '100px', width: "100%", padding: "12px 6px", resize: "vertical" }}
                                        value={comment}
                                        onChange={(e) => setComment(e.currentTarget.value)} />
                                    <TableWriteControllDiv>
                                        <FormControlLabel
                                            control={<Checkbox onChange={(e) => setIsSecret(e.target.checked)} defaultChecked={false} />}
                                            label="비밀글"
                                        />
                                        <Button
                                            variant="contained"
                                            size='small'
                                            sx={{ margin: "0 4px" }}
                                            onClick={btnAddCmt}>등록</Button>
                                        <Button
                                            variant="outlined"
                                            size='small'
                                            sx={{ margin: 0 }}
                                            color="primary"
                                            onClick={btnActiveCmt}>취소</Button>
                                    </TableWriteControllDiv>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            }
        </>
    )
}

export default CmtForm;

type cmtList = {
    cmt_idx: number,
    emloc_no: number,
    cmt_userid: string,
    cmt_username: string,
    cmt_content: string,
    cmt_regdate: string,
    cmt_delflag: number,
    is_secret: number
}

CmtForm.defaultProps = {
    boardDetailItem: {},
    user: {},
    boardCode: 9999,
    getBoardList: [],
    currentPage: 1
}
const TableWriteControllDiv = styled.div`
    text-align: right;
`
const CmtListHeader = styled.div`
    text-align: left;
`
const CmtListBody = styled.div`
    margin-top:8px;
    
`