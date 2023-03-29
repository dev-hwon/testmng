import React, { useCallback, useEffect, useState } from 'react';
import type { ReactElement } from "react";
import DashboardLayout from "../../layouts/Dashboard";
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import {
    Box,
    Button,
    TextField,
    NativeSelect,
    Typography,
    Paper,
    Breadcrumbs as MuiBreadcrumbs,
    Link
} from '@mui/material';
import BoardForm from '../../components/board/BoardForm';
import BoardPaging from '../../components/board/BoardPaging';
import BoardAdd from '../../components/board/BoardAdd';
import BootstrapInput from '../../components/board/BootStrapInput';
import useAuth from "../../hooks/useAuth";
import AuthGuard from '../../components/guards/AuthGuard';
import CmtForm from '../../components/board/CmtForm';
import Swal from '../../common/Swal';
import { Helmet } from 'react-helmet-async';
import NextLink from "next/link";
import BookmarkStar from '../../common/BookmarkStar';
import CommonKey from '../../common/CommonKey';
import { useQueryClient } from 'react-query';
import PageGuard from '../../components/guards/PageGuard';

const { SwalAlert } = Swal();

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const SEL_ALL_CODE = "SEL_ALL_CODE";
const SEL = "SEL";
const DET = "DET";
const url = '/api/board/boardList';

// boardCode 출력
const SelectBoardCode = (props: any) => {
    const queryClient = useQueryClient();
    const {
        data,
        boardCode,
        getBoardCode,
        setShowForm,
        setShowAddForm,
        setSearchValue,
        setCurrentPage
    } = props;
    const { getRenewUrl } = GetUrl();

    // useEffect(() => {
    //     setSelBoardName(boardCode);
    // }, [boardCode])

    const dataItem = [];
    for (let i = 0; i < data.length; i++) {
        dataItem.push(data[i]);
        if (boardCode == data[i].board_code) {
            queryClient.setQueryData(CommonKey.BOARD_NAME, data[i].board_name);
        }
    }
    const listItem = dataItem.map((item) => (
        <option key={item.board_code} value={item.board_code}>
            {item.board_name}
        </option >
    ))

    const handleChange = (e: any) => {
        let name = '';
        for (let i = 0; i < data.length; i++) {
            if (e.target.value == data[i].board_code) {
                name = data[i].board_name;
                queryClient.setQueryData(CommonKey.BOARD_NAME, name);
            }
        }
        getRenewUrl(Number(e.target.value), name.replace(/[^\w\s가-힣]/g, ""), "list");
        getBoardCode();
        setShowForm(false);
        setShowAddForm(false);
        setSearchValue('');
        setCurrentPage(1);
    };

    return (
        <NativeSelect
            value={queryClient.getQueryData(CommonKey.BOARD_CODE)}
            onChange={(e) => handleChange(e)}
            sx={{ width: 200 }}
            size="small"
            className="header"
            input={<BootstrapInput />}
            style={{display: "none"}}
        >
            {listItem}
        </NativeSelect>
    )
}

// boardList 출력
const TableContents = (props: any) => {
    const { data, getBoardDetail } = props;
    const dataItem = [];
    for (let i = 0; i < data.length; i++) {
        dataItem.push(data[i]);
    }

    const listItem = dataItem.map((item, i) => (
        < TableRow key={item.no} >
            <TableCell size="small" align="center">{item.is_notice == 0 ? item.no : <b>[공지]</b>}</TableCell>
            <TableCell size="small" onClick={() => getBoardDetail(item.no)}
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

const GetUrl = () => {
    // const [pageUrl, setPageUrl] = useState('');
    const [urlFlag, setUrlFlag] = useState(false);
    const getRenewUrl = useCallback((code: number, name: string, type: string) => {
        if (typeof window !== "undefined") {
            let renewURL = window.location.href;
            renewURL = renewURL.split('?')[0];
            renewURL += '?board_code=' + code;
            window.history.replaceState(null, '', renewURL);
            setUrlFlag(!urlFlag);
        }
    }, [urlFlag]);
    return { urlFlag, getRenewUrl }
}

// boardCode, boardList data 가져오기
const GetBoard = () => {
    const [boardCodeList, setBoardCodeList] = useState<boardCodeList>(Object);
    const [boardList, setBoardList] = useState<boardListItem>(Object);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [pageSize, setPageSize] = useState(0);
    const [boardCode, setBoardCode] = useState<number>(9999);
    const [boardDetailNo, setBoardDetailNo] = useState(0);
    const [boardDetailItem, setBoardDetailItem] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const queryClient = useQueryClient();

    const getBoardCodeList = useCallback(() => {
        const params = {
            type: SEL_ALL_CODE,
        }
        const dataPromise = axios.get(url, { params });
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                let data = obj.data;
                if (data.result == 0) {
                    setBoardCodeList(data.data);
                } else {
                }
            } else {
                SwalAlert("다시 시도해주세요. (getBoardCodeList error)", "warning");
                return;
            }
        });
    }, []);

    const getBoardCode = useCallback(() => {
        if (typeof window !== "undefined") {
            // console.log(window.location.search);
            const query = window.location.search;
            const urlParams = new URLSearchParams(query);
            setBoardCode(Number(urlParams.get('board_code')));
            queryClient.setQueryData(CommonKey.BOARD_CODE, Number(urlParams.get('board_code')));
            queryClient.setQueryData(CommonKey.BOARD_NO, Number(urlParams.get('no')));
            setBoardDetailNo(Number(urlParams.get('no')));
            setCurrentPage(1);
            setShowForm(false);
            setShowAddForm(false);
        }

    }, [queryClient]);

    const getBoardList = useCallback((code: number, page: number, search_key: string, search_value: string) => {
        const params = {
            type: SEL,
            board_code: code,
            currentPage: page,
            search_key,
            search_value
        };
        const dataPromise = axios.get(url, { params });
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                let data = obj.data;
                if (data.result == 0) {
                    setBoardList(data.data);
                    setTotalPage(data.totalPage);
                    setStartPage(data.startPage);
                    setEndPage(data.endPage);
                    setPageSize(data.pageSize);
                } else {
                    SwalAlert("다시 시도해주세요. (getBoardList error)", "warning");
                }
            }
        })
    }, []);

    const getBoardDetail = useCallback((no: any) => {
        if (typeof window !== "undefined") {
            let renewURL = window.location.href;
            renewURL = renewURL.split('&no')[0];
            if (no != 0) {
                renewURL += '&no=' + no;
            }
            window.history.replaceState(null, '', renewURL);
            // setUrlFlag(!urlFlag);
        }

        if (no != 0) {
            const params = {
                type: DET,
                emloc_no: no,
            }
            const dataPromise = axios.get(url, { params });
            dataPromise.then(function (obj: any) {
                if (obj && obj.data) {
                    let data = obj.data;
                    if (data.result == 0) {
                        setBoardDetailItem(data.data);
                        setShowForm(true);
                        setShowAddForm(false);
                        window.scrollTo(0, 0);
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
    }, []);

    return {
        boardCodeList,
        boardList,
        currentPage,
        totalPage,
        startPage,
        endPage,
        pageSize,
        boardCode,
        boardDetailNo,
        boardDetailItem,
        showForm,
        showAddForm,
        setCurrentPage,
        setBoardCode,
        getBoardCodeList,
        getBoardList,
        getBoardCode,
        getBoardDetail,
        setShowForm,
        setShowAddForm
    }
}

const BoardList = () => {

    const {
        boardCodeList,
        boardList,
        currentPage,
        totalPage,
        startPage,
        endPage,
        pageSize,
        boardCode,
        boardDetailNo,
        boardDetailItem,
        showForm,
        showAddForm,
        setCurrentPage,
        setBoardCode,
        getBoardCodeList,
        getBoardList,
        getBoardCode,
        getBoardDetail,
        setShowForm,
        setShowAddForm
    } = GetBoard();
    // const { urlFlag, getRenewUrl } = GetUrl();
    const { user } = useAuth();

    const [searchKey, setSearchKey] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [addFormFlag, setAddFormFlag] = useState(0); // 0: insert, 1: update

    let boardName = useQueryClient().getQueryData(CommonKey.BOARD_NAME);
    boardName = typeof boardName == 'undefined' ? '' : boardName;

    useEffect(() => {
        if (user) {
            //qc.setQueryData(CommonKey.PAGE_CURRENT, 1);
            setSearchValue('');
            getBoardCode();
            getBoardCodeList();
            getBoardDetail(boardDetailNo);
        }
    }, [user, getBoardCode, getBoardCodeList, getBoardDetail, boardDetailNo]);

    useEffect(() => {
        getBoardCode();
        //setCurrentPage(1);
        getBoardList(boardCode, currentPage, "", "");
        setShowForm(false);
        setSearchValue('');
        window.scrollTo(0, 0);
    }, [boardCode, currentPage, setCurrentPage, getBoardList, getBoardCode, setShowForm, setSearchValue]);

    const btnClickSearch = () => {
        if (searchKey == "" || searchValue == "") {
            SwalAlert("검색어를 입력하세요.", "warning");
            return;
        }
        getBoardList(boardCode, 1, searchKey, searchValue);
    }

    const btnClickAdd = () => {
        if (typeof window !== "undefined") {

            let renewURL = window.location.href;
            renewURL = renewURL.split('&no')[0];
            window.history.replaceState(null, '', renewURL);
            // setUrlFlag(!urlFlag);
        }
        setAddFormFlag(0);
        setShowAddForm(true);
        setShowForm(false);
        window.scrollTo(0, 0);
    }

    const handleKeyPress = (e: any) => {
        if (e.key == 'Enter') {
            btnClickSearch();
        }
    }

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
                {showForm &&
                    <Box>
                        <BoardForm
                            boardDetailItem={boardDetailItem}
                            boardCodeList={boardCodeList}
                            boardCode={boardCode}
                            currentPage={currentPage}
                            getBoardList={getBoardList}
                            setShowForm={setShowForm}
                            setShowAddForm={setShowAddForm}
                            setAddFormFlag={setAddFormFlag}
                            searchKey={searchKey}
                            searchValue={searchValue}
                            user={user} />
                        <CmtForm
                            boardDetailItem={boardDetailItem}
                            boardCode={boardCode}
                            currentPage={currentPage}
                            getBoardList={getBoardList}
                            user={user} />
                    </Box>
                }
                {showAddForm &&
                    <BoardAdd
                        addFormFlag={addFormFlag}
                        boardDetailItem={boardDetailItem}
                        boardCodeList={boardCodeList}
                        boardCode={boardCode}
                        boardName={boardName}
                        user={user}
                        getBoardList={getBoardList}
                        setShowForm={setShowForm}
                        setShowAddForm={setShowAddForm} />
                }
                <Box className='board__controller'>
                    <SelectBoardCode
                        data={boardCodeList}
                        currentPage={currentPage}
                        boardCode={boardCode}
                        setBoardCode={setBoardCode}
                        setCurrentPage={setCurrentPage}
                        getBoardList={getBoardList}
                        getBoardCode={getBoardCode}
                        setShowForm={setShowForm}
                        setShowAddForm={setShowAddForm}
                        setSearchValue={setSearchValue} />
                    {/* <NativeSelect
                        size="small"
                        onChange={(e) => setSearchKey(e.target.value as string)}
                        input={<BootstrapInput />}
                        defaultValue={''}>
                        <option value="">선택하세요.</option>
                        <option value="no">게시번호</option>
                        <option value="writer">작성자</option>
                        <option value="subject">제목</option>
                        <option value="contents">내용</option>
                    </NativeSelect> */}
                    <TextField
                        select
                        sx={(theme) => ({bgcolor : theme.palette.background.paper})}
                        size="small"
                        onChange={(e) => setSearchKey(e.target.value as string)}
                        SelectProps={{
                            native: true
                        }}
                        >
                        <option value="">선택하세요.</option>
                        <option value="no">게시번호</option>
                        <option value="writer">작성자</option>
                        <option value="subject">제목</option>
                        <option value="contents">내용</option>
                    </TextField>
                    <TextField
                        id="searchText"
                        size="small"
                        variant="outlined"
                        sx={(theme) => ({bgcolor : theme.palette.background.paper, width: 250, marginLeft: 1 })}
                        className=""
                        style={{ marginTop: "0px" }}
                        onChange={(e) => setSearchValue(e.target.value as string)}
                        onKeyPress={(e) => handleKeyPress(e)} />
                    <Button
                        variant="contained"
                        sx={{ width: 80, marginLeft: 1 }}
                        style={{ verticalAlign: 'top' }}
                        onClick={btnClickSearch}>검색</Button>
                    <Button
                        variant="contained"
                        style={{ width: 100, marginTop: 0, float: "right" }}
                        onClick={btnClickAdd}
                    >글쓰기</Button>
                </Box>

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
                        <TableContents
                            data={boardList}
                            getBoardDetail={getBoardDetail} />
                    </Table>
                    <BoardPaging
                        data={boardList}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        startPage={startPage}
                        endPage={endPage}
                        totalPage={totalPage}
                        pageSize={pageSize}
                    />
                </TableContainer >
            </PageGuard>
        </AuthGuard>
    )
}
export default BoardList;

BoardList.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>
}

type boardCodeList = {
    board_code: number,
    board_name: string
}

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
const TopnotiList = styled.ul`
    padding:20px;
    list-style:none;
    line-height: 1.6;
    margin:0;
    >li {
        position: relative;
        padding-left: 12px;
        &.important {
            color: ${(props) => props.theme.palette.primary.main};
        }
        &:before {
            content: "-";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            padding: 0 2px;
        }
    }
`;