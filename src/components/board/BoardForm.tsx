import { Box, maxHeight, maxWidth } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, ImageList, ImageListItem, NativeSelect, Typography } from '@mui/material';
import BootstrapInput from './BootStrapInput';
import Swal from '../../common/Swal';
import Image from 'next/image';
import fileDownload from 'js-file-download';
import styled from '@emotion/styled';

const { SwalAlert, SwalConfirm } = Swal();
const DET_FILE = 'DET_FILE';
const UPD_BC = 'UPD_BC';
const DEL = 'DEL';
const url = '/api/board/boardList';
const downloadUrl = '/api/board/fileDownload';



const SelectBoardCode = (props: any) => {
    const { data, no, boardCode, getBoardList, currentPage } = props;
    const { SwalAlert, SwalConfirm } = Swal();
    const [selBoardName, setSelBoardName] = useState(boardCode);


    const dataItem = [];
    for (let i = 0; i < data.length; i++) {
        dataItem.push(data[i]);
    }

    const listItem = dataItem.map((item) => (
        <option key={item.board_code} value={item.board_code}>
            {item.board_name}
        </option >
    ))

    const btnChangeBoardCode = () => {
        SwalConfirm("위치 변경", "게시글 위치를 변경하시겠습니까?").then((result) => {
            if (result) {
                ChangeBoardCode(no, selBoardName);
            } else {
                return;
            }
        });
    }

    const ChangeBoardCode = (no: number, code: string) => {
        const params = {
            type: UPD_BC,
            emloc_no: no,
            board_code: code
        }

        const dataPromise = axios.get(url, { params });
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                let data = obj.data;
                if (data.result == 0) {
                    SwalAlert('위치 변경이 완료되었습니다.', 'success');
                    getBoardList(boardCode, currentPage);
                } else {
                    SwalAlert('다시 시도해 주세요. (ChangeBoardCode error)', 'warning');
                }
            } else {
                SwalAlert('다시 시도해 주세요. (ChangeBoardCode error)', 'warning');
                return;
            }
        });
    }

    return (
        <TableRow>
            <TableCell colSpan={4} size="small" >
                <NativeSelect
                    value={selBoardName}
                    onChange={(e) => setSelBoardName(e.target.value)}
                    sx={{ width: 200 }}
                    size="small"
                    className="header"
                    input={<BootstrapInput />}
                >
                    {listItem}
                </NativeSelect>
                <Button variant="contained"
                    sx={{ m: 1, width: 100, height: 35 }}
                    onClick={btnChangeBoardCode}>
                    변경하기</Button>
            </TableCell>
        </TableRow>
    )
}



const AttachFilelist = (props: any) => {
    const { data } = props;
    const dataItem = [];
    for (let i = 0; i < data.length; i++) {
        dataItem.push(data[i]);
    }

    const downloadFile = (fileName: string) => {

        // const params = {
        //     fileName
        // }

        // const dataPromise = axios.get(downloadUrl, { params });
        // dataPromise.then(function (obj: any) {
        //     if (obj && obj.data) {
        //         let data = obj.data;
        //         console.log(data.result)
        //     } else {

        //         return;
        //     }
        // });
        const url = process.env.NEXT_PUBLIC_JCAASPDOMAIN + '/Upload/EMLOC_BOARD';
        // const url = "http://localhost:3000/" + '/Upload/EMLOC_BOARD';
        axios.get(url, {
            responseType: 'blob',
        }).then(res => {
            fileDownload(res.data, fileName);
        })
    }

    const listItem = dataItem.map((item) => (
        <Box component="span" key={item.seq}>
            {/* <a className="board_filename" onClick={() => downloadFile(item.filename)}> */}
            <a className="board_filename" >
                <ImageListItem>
                    <Image src={process.env.NEXT_PUBLIC_JCAASPDOMAIN + "/images/downloadimg.gif"}
                        alt="downloadimg.gif"
                        width={10} height={10} />
                </ImageListItem>
                {item.filename}
            </a>
        </Box >
    ))

    return (
        <Box component="span" className='board_file'>
            {listItem}
        </Box>
    )
}

const GetDetail = () => {
    const [attachFileList, setAttachFileList] = useState<attachFileList>(Object);

    const getDetailFile = useCallback((emloc_no: number) => {
        const params = {
            type: DET_FILE,
            emloc_no
        }
        const dataPromise = axios.get(url, { params });
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                let data = obj.data;
                if (data.result == 0) {
                    setAttachFileList(data.data);
                } else {
                    SwalAlert('다시 시도해 주세요. (getDetailFile error)', 'warning');
                }
            }
        });
    }, [])

    return {
        attachFileList,
        getDetailFile,
    }
}

const Container = styled.div`
    position: relative; !important
    width: '100%'; !important
    height: '100%'; !important
`;

const PrevImg = (props: any) => {
    const { data } = props;

    const dataItem = [];
    for (let i = 0; i < data.length; i++) {
        let ext = data[i].filename.split(".")[1];
        if (ext.toLowerCase() == "jpg" || ext.toLowerCase() == "png" || ext.toLowerCase() == "gif") {
            dataItem.push(data[i]);
        }
    }


    const listItem = dataItem.map((item) => (
        <Image key={item.seq}
            src={process.env.NEXT_PUBLIC_JCAASPDOMAIN + "/Upload/EMLOC_BOARD/" + item.filename}
            alt={item.filename}
            layout="fill"
        />
    ))

    return (
        <Box className="board_prevImg_Box">
            {listItem}
        </Box>
    )
}

const BoardForm = (props: any) => {
    const {
        boardDetailItem,
        boardCodeList,
        boardCode,
        getBoardList,
        currentPage,
        user,
        setShowForm,
        setShowAddForm,
        setAddFormFlag,
        searchKey,
        searchValue } = props;
    const {
        attachFileList,
        getDetailFile } = GetDetail();

    useEffect(() => {
        getDetailFile(boardDetailItem.no);
    }, [boardDetailItem, getDetailFile])

    const btnClickUpdate = () => {
        setShowForm(false);
        setShowAddForm(true);
        setAddFormFlag(1);
    }

    const btnClickDelete = () => {
        const params = {
            type: DEL,
            emloc_no: boardDetailItem.no
        }

        SwalConfirm("게시글 삭제", "정말 게시글을 삭제하시겠습니까?").then((result) => {
            if (result) {
                const dataPromise = axios.get(url, { params });
                dataPromise.then(function (obj: any) {
                    if (obj && obj.data) {
                        let data = obj.data;
                        if (data.result == 0) {
                            SwalAlert("삭제가 완료되었습니다.", "success");
                            setShowForm(false);
                            getBoardList(boardCode, currentPage, searchKey, searchValue);
                        } else {
                            SwalAlert("다시 시도해주세요. (btnClickDelete error)", "warning");
                        }
                    }
                });
            } else {
                return;
            }
        });
    }

    return (
        <Box className="board_form_box" sx={(theme) => ({bgcolor : theme.palette.background.paper })} >
            {
                boardDetailItem &&
                <TableContainer>
                    <Table className="board_table" sx={{ height: "auto" }} >
                        <TableHead className='board_sub'>
                            {user.id == boardDetailItem.mm_id ?
                                <SelectBoardCode
                                    data={boardCodeList}
                                    no={boardDetailItem.no}
                                    boardCode={boardCode}
                                    getBoardList={getBoardList}
                                    currentPage={currentPage} />
                                : <></>}
                            <TableRow>
                                <TableCell colSpan={4} size="small" >
                                    {<b>{boardDetailItem.subject}</b>}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell size="small">작성자 : {boardDetailItem.writer}({boardDetailItem.mm_id})</TableCell>
                                <TableCell size="small">번호 : {boardDetailItem.no}</TableCell>
                                <TableCell size="small">등록일 : {boardDetailItem.reg_date}</TableCell>
                                <TableCell size="small">조회수 : {boardDetailItem.view_cnt + 1}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4} size="small">첨부파일:
                                    <AttachFilelist data={attachFileList} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4} size="small" >
                                    <Typography gutterBottom dangerouslySetInnerHTML={{ __html: boardDetailItem.contents.replace(/\r\n/g, "<br/>") }} className='board_form_content'>
                                    </Typography>
                                    <PrevImg data={attachFileList} />
                                </TableCell>
                            </TableRow>
                            {user.id == boardDetailItem.mm_id ?
                                <TableRow>
                                    <TableCell colSpan={4} size="small">
                                        <Box>
                                            <Button variant="outlined" onClick={btnClickUpdate}>수정</Button>&nbsp;
                                            <Button variant="outlined" onClick={btnClickDelete}>삭제</Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                : <></>}
                        </TableBody>
                    </Table >
                </TableContainer >
            }
        </Box >
    )
}

export default BoardForm;
type boardData = {
    no: number,
    subject: string,
    writer: string,
    mm_id: string,
    usr_no: number,
    contents: string,
    reg_date: string,
    view_cnt: number,
    cmt_cnt: number,
    is_notice: number
}

type attachFileList = {
    seq: number,
    no: number,
    filename: string,
    regdate: string,
    delflag: number
}

