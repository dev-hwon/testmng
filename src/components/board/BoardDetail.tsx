import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    ImageListItem
} from '@mui/material';
import Swal from '../../common/Swal';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { useQueryClient } from 'react-query';
import Image, {ImageProps} from 'next/image';
const { SwalAlert } = Swal();

const apiUrl = '/api/board/getBoardDetail';
const DET_FILE = 'DET_FILE';

const PrevImg = (props: any) => {
    const { data } = props;

    const dataItem = [];
    for (let i = 0; i < data.length; i++) {
        let ext = data[i].filename.split(".")[1];
        if (ext.toLowerCase() == "jpg" || ext.toLowerCase() == "png" || ext.toLowerCase() == "gif") {
            dataItem.push(data[i]);
        }
    }
    
    const listItem = dataItem.map((item, idx) => (
        <Image key={idx}
            src={process.env.NEXT_PUBLIC_JCAASPDOMAIN + "/Upload/EMLOC_BOARD/" + item.filename}
            alt={item.filename}
            layout="fill"
            //{...props} as ImageProps
            />
    ))

    return (
        <Box >
            {listItem}
        </Box>
    )
}

const AttachFilelist = (props: any) => {
    const { data } = props;
    const dataItem = [];
    for (let i = 0; i < data.length; i++) {
        dataItem.push(data[i]);
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
    ));

    return (
        <Box component="span" className='board_file'>
            {listItem}
        </Box>
    )
}

const GetFileDetail = () => {
    const [attachFileList, setAttachFileList] = useState<attachFileList>(Object);

    const getDetailFile = useCallback((emloc_no: number) => {
        const params = {
            type: DET_FILE,
            emloc_no
        }
        const dataPromise = axios.get(apiUrl, { params });
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

const BoardDetail = (props: any) => {
    const { boardNo } = props;
    const queryClient = useQueryClient();
    const [boardDetailItem, setBoardDetailItem] = useState(initialValue);
    const { user } = useAuth();
    const { attachFileList, getDetailFile } = GetFileDetail();

    useEffect(() => {
        if (boardNo != 0) {
            // console.log(user);
            const params = {
                emloc_no: boardNo,
            }
            const dataPromise = axios.get(apiUrl, { params });
            dataPromise.then(function (obj: any) {
                if (obj && obj.data) {
                    let data = obj.data;
                    if (data.result == 0) {
                        setBoardDetailItem(data.data);
                        getDetailFile(boardNo);
                    } else {
                        SwalAlert("다시 시도해주세요. (setBoardDetailItem error)", "warning");
                        return;
                    }
                } else {
                    SwalAlert("다시 시도해주세요. (setBoardDetailItem error)", "warning");
                    return;
                }
            });
        }
    }, [boardNo, getDetailFile]);

    return (
        <Box className="board_form_box" sx={(theme) => ({bgcolor : theme.palette.background.paper })}>
            {
                boardDetailItem &&
                <TableContainer>
                    <Table className="board_table" sx={{ height: "auto" }} >
                        <TableHead className='board_sub'>
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
                            {/* 첨부파일있을경우에만 노출 tableRow */}
                            <TableRow>
                                <TableCell colSpan={4} size="small">첨부파일:
                                    <AttachFilelist data={attachFileList} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4} size="small" >
                                    <Typography gutterBottom dangerouslySetInnerHTML={{ __html: boardDetailItem.contents.replace(/\r\n/g, "<br/>") }} className='board_form_content'>
                                    </Typography>
                                    {/* <PrevImg data={attachFileList} /> */}
                                </TableCell>
                            </TableRow>
                            { user && user.id == boardDetailItem.mm_id ?
                                <TableRow>
                                    <TableCell colSpan={4} size="small">
                                        <Box>
                                            {/* <Button variant="outlined" onClick={btnClickUpdate}>수정</Button>&nbsp;
                                            <Button variant="outlined" onClick={btnClickDelete}>삭제</Button> */}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                : <></>}
                        </TableBody>
                    </Table >
                </TableContainer >
            }
        </Box >
    );
};

export default BoardDetail;

const initialValue = {
    no: 0,
    subject: '',
    writer: '',
    mm_id: '',
    usr_no: '',
    contents: '',
    reg_date: '',
    view_cnt: 0,
    cmt_cnt: 0,
    is_notice: 0,
    parent_no: 0,
    pswd: ''
}

type attachFileList = {
    seq: number,
    no: number,
    filename: string,
    regdate: string,
    delflag: number
}

