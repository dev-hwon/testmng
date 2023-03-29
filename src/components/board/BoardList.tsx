import React, { useEffect, useState, useCallback } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import CommonKey from '../../common/CommonKey';
import axios from 'axios';
import Paging from '../common/Paging';
import { useQueryClient } from 'react-query';

const apiUrl = '/api/board/getBoardList';

const TableContents = (props: any) => {
    const { data, queryClient, setBoardNo } = props;
    //const qc = useQueryClient();

    const dataItem = [];
    for (let i = 0; i < data.length; i++) {
        dataItem.push(data[i]);
    }

    const onClickNo = useCallback((no: any) => {
        queryClient.setQueryData(CommonKey.BOARD_NO, no);
        setBoardNo(no);
        const url = window.location.href.split('&no')[0] + "&no=" + no;
        window.history.replaceState(null, '', url);
        window.scrollTo(0, 0);
    }, [queryClient, setBoardNo]);

    const listItem = dataItem.map((item, i) => (
        <TableRow key={i} >
            <TableCell size="small" align="center">{item.is_notice == 0 ? item.no : <b>[공지]</b>}</TableCell>
            <TableCell size="small" onClick={() => onClickNo(item.no)}
            // <TableCell onClick={() => console.log(item.no)}
                sx={{ cursor: "pointer" }}>
                {item.is_notice == 0 ? item.subject : <b>{item.subject}</b>}
                {item.cmt_cnt == 0 ? "" : <span className="board_list_cmt">&nbsp;({item.cmt_cnt})</span>}
            </TableCell>
            <TableCell size="small" align="center">{item.writer}</TableCell>
            <TableCell size="small" align="center">{item.reg_date.split(' ')[0]}</TableCell>
            <TableCell size="small" align="center">{item.view_cnt}</TableCell>
        </TableRow >
    ))

    return (
        <TableBody>
            {dataItem.length != 0 ? listItem :
                <TableRow>
                    <TableCell align="center" colSpan={5}>등록된 게시물이 없습니다.</TableCell>
                </TableRow>
            }
        </TableBody>
    )
}

const BoardList = (props: any) => {
    const queryClient = useQueryClient();
    const { boardCode, setBoardNo } = props;
    const [boardList, setBoardList] = useState<boardListItem>(Object);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    //const code = Number(queryClient.getQueryData(CommonKey.BOARD_CODE));

    useEffect(() => {
        let isLoading = true;
        window.scrollTo(0, 0);
        if (!window.location.href.includes('&no')) {
            const url = window.location.href.split('&no')[0];
            window.history.replaceState(null, '', url);
        }
        
        const params = {
                board_code: Number(boardCode),
                size: 40,
                count: 10,
                currentPage,
        };
        if (boardCode != 0) {   
            const dataPromise = axios.get(apiUrl, { params });
            if (isLoading) {
                dataPromise.then(function (obj: any) {
                    if (obj && obj.data) {
                        const data = obj.data;
                        if (data.result == 0) {
                            setBoardList(data.data);
                            setTotalCount(data.totalCount);
                        }
                    }
                }).catch(function (err) {
                    isLoading = false;
                });
            }
        }
        return () => { isLoading = false };
    }, [boardCode, currentPage, setBoardList, setTotalCount]);

    return (
         <TableContainer sx={{"margin":".5rem 0 0"}}>
            <Table aria-label="simple table" className="board_table" sx={(theme) => ({bgcolor : theme.palette.background.paper })}>
                <TableHead>
                    <TableRow>
                        <TableCell size="small" align="center">번호</TableCell>
                        <TableCell size="small" align="center">제목</TableCell>
                        <TableCell size="small" align="center">작성자</TableCell>
                        <TableCell size="small" align="center">등록일</TableCell>
                        <TableCell size="small" align="center">조회수</TableCell>
                    </TableRow>
                </TableHead>
                <TableContents data={boardList} queryClient={queryClient} setBoardNo={setBoardNo} />
            </Table>
            <Paging
                code={boardCode}
                size={40}
                count={10}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalCount={totalCount} />
        </TableContainer >
    );
};

export default BoardList;

type boardListItem = {
    no: number,
    subject: string,
    writer: string,
    mm_id: string,
    usr_no: number,
    contents: string,
    reg_date: Date,
    view_cnt: number,
    cmt_cnt: number,
    is_notice: number,
    parent_no: number,
    pswd: string
}
