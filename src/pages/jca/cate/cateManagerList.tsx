import { ThemeProps } from "../../../types/theme";
import { withTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import AuthGuard from "../../../components/guards/AuthGuard";
import PageGuard from "../../../components/guards/PageGuard";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "../../../layouts/Dashboard";
import BookmarkStar from "../../../common/BookmarkStar";
import {
    Divider as MuiDivider,
    Typography,
    Grid
} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { spacing } from "@mui/system";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },

    '&:last-child td, &:last-child th': {
        border: 50,
    },
}));

const Divider = styled(MuiDivider)(spacing);

function CateManagerList(props: any) {
    const cateManagerData = props.data.result;
    const theme = props;
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="left" width="5%">NO</StyledTableCell>
                        <StyledTableCell align="left" width="7%">이름</StyledTableCell>
                        <StyledTableCell align="left" width="7%">직급</StyledTableCell>
                        <StyledTableCell align="left" width="15%">이메일</StyledTableCell>
                        <StyledTableCell align="left">카테명</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cateManagerData && cateManagerData.map((data: any, index: number) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row" align="left">{index + 1}</StyledTableCell>
                            <StyledTableCell align="left">{data.mm_nm}</StyledTableCell>
                            <StyledTableCell align="left">{data.position}</StyledTableCell>
                            <StyledTableCell align="left">{data.mm_email}</StyledTableCell>
                            <StyledTableCell align="left">{data.cate_nm}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

const CateManager = ({ theme }: ThemeProps) => {
    const [cateManager, setCateManager] = useState([]);

    useEffect(() => {
        const dataPromise = axios.get('/api/cate/cateManager');
        dataPromise.then(function (obj: any) {
            setCateManager((obj && obj.data && obj.data.cateManagerData) ? obj.data.cateManagerData : '');
        });
    }, []);

    return (
        <DashboardLayout>
            <AuthGuard>
                <PageGuard>
                    <Helmet title="카테고리 담당자 리스트" />
                    <Typography variant="h3" gutterBottom display="inline">
                        카테고리 담당자 리스트
                    </Typography>
                    <BookmarkStar pageNo={33} />
                    <Divider my={6} />
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <CateManagerList data={cateManager} />
                        </Grid>
                    </Grid>
                </PageGuard>
            </AuthGuard>
        </DashboardLayout>
    )
}
export default withTheme(CateManager);
