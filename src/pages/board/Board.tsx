import React, { ReactElement, useEffect, useState } from 'react';
import DashboardLayout from "../../layouts/Dashboard";
import { 
    Box,
    Typography,
    Link,
    Paper
 } from '@mui/material';
import NextLink from "next/link";
import { Helmet } from 'react-helmet-async';
import AuthGuard from '../../components/guards/AuthGuard';
import PageGuard from '../../components/guards/PageGuard';
import {
    Breadcrumbs,
    TopnotiList
} from '../../components/board/BoardStyled';
import BookmarkStar from '../../common/BookmarkStar';
import axios from 'axios';
import BoardList from '../../components/board/BoardList';
import CommonKey from '../../common/CommonKey';
import useAuth from '../../hooks/useAuth';
import { useQueryClient } from 'react-query';
import BoardDetail from '../../components/board/BoardDetail';

const apiUrl = '/api/board/getBoardCode';

const Board = () => {
    const queryClient = useQueryClient();
    const [boardCode, setBoardCode] = useState('');
    const [boardName, setBoardName] = useState('');
    const [boardNo, setBoardNo] = useState(0);
    const { user } = useAuth();
    
    useEffect(() => {
        if (user) {
            if (typeof window != "undefined") {
                const query = window.location.search;
                const urlParams = new URLSearchParams(query);
                queryClient.setQueryData(CommonKey.BOARD_CODE, Number(urlParams.get('code')));
                queryClient.setQueryData(CommonKey.BOARD_NO, Number(urlParams.get('no')));
            

                const code = Number(queryClient.getQueryData(CommonKey.BOARD_CODE));
                const no = Number(queryClient.getQueryData(CommonKey.BOARD_NO));

                const params = {
                    board_code: code
                };

                if (code != 0 || ( code !=0 && no == 0)) {
                    const dataPromise = axios.get(apiUrl, { params });
                    dataPromise.then(function (obj: any) {
                        if (obj && obj.data) {
                            const data = obj.data;
                            if (data.result == 0) {
                                setBoardCode(data.data.board_code);
                                setBoardName(data.data.board_name);
                                queryClient.setQueryData(CommonKey.BOARD_NAME, data.board_name);
                            }
                        }
                    });
                }
                setBoardNo(no);
            }
        }
    }, [user, queryClient, setBoardNo]);
    return (
        <AuthGuard>
            <PageGuard>
                <Box className='board__noti'>
                    <Helmet title={String(boardName)} />
                    <Typography variant="h3" gutterBottom display="inline">
                        {String(boardName)}
                    </Typography>
                    <BookmarkStar pageNo={25} />
                    <Breadcrumbs aria-label="Breadcrumb" mt={2}>
                        <NextLink href="/" passHref>
                            <Link>사내게시판</Link>
                        </NextLink>
                        <Typography>{String(boardName)}</Typography>
                    </Breadcrumbs>
                    <Paper elevation={0} sx={{ "margin":"1rem 0 0"}}>
                        <TopnotiList>
                            <li className='important'>회사에서 허용하지 않은 개인별 PC의 불법 소프트웨어로 인한 금전적 책임은 당사자에게 돌아갑니다.</li>
                            <li className='important'>자신의 PC내의 불법 여부 점검 확인이 필요한 분은 김범일 과장에게 필히 의뢰바랍니다.</li>
                            <li>개인 PC의 해킹사고(의심사례) 발생시 조진배 책임에게 즉시 신고바랍니다(해킹사고 신고의무화)</li>
                        </TopnotiList>
                    </Paper>
                </Box>
                {boardNo != 0 ? <BoardDetail boardNo={boardNo} /> : <></>}
                <BoardList boardCode={boardCode}  setBoardNo={setBoardNo} />
            </PageGuard>
        </AuthGuard>
    );
};

export default Board;

Board.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>
}