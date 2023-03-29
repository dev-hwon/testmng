import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { ThemeProps } from "../../types/theme";
import {
    Card as MuiCard,
    CardHeader,
    Rating,
    Divider as MuiDivider,
    ListItemText as MuiListItemText,
    ListItemIcon,
    List,
    ListItem
} from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { spacing } from "@mui/system";
import axios from "axios";
import swal from "sweetalert";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CustomListItemText = styled(MuiListItemText)`
    margin-left: 10px;
`;

function FolderList(props: any) {
    const bookmarkData = props.data;
    const sawonno = props.sawonno;

    const clickRating = (itm_no: number) => {
        bookMarkDel(sawonno, itm_no);
    }

    return (
        <List>
            {bookmarkData && bookmarkData.map((data: any, index: number) => (
                <ListItem key={data.itm_no} button component="a" href={data.itm_url}>
                    <Rating name="customized-color" defaultValue={1} value={1} max={1} onClick={(e: React.MouseEvent<Element, MouseEvent>) => { e.preventDefault(); clickRating(data.itm_no) }} />
                    <ListItemIcon>
                        <CustomListItemText primary={data.itm_nm} />
                    </ListItemIcon>
                </ListItem>
            ))}
        </List>
    );
}

const bookMarkDel = (sawonno: string, itm_no: number) => {
    const dataPromise = axios.get('/api/dashboard/bookmarkDelete?sawonno=' + sawonno + '&itm_no=' + itm_no);
    dataPromise.then(function (obj: any) {
        if (obj && obj.data) {
            if (obj.data.result) {
                swal("", "북마크가 해제되었습니다.", "success");
                location.reload();
            }
        }
    });
}

async function fetchBookMark(sawonno: string) {
    const data = await axios.get('/api/dashboard/bookmark?sawonno=' + sawonno);
    return data;
}

const Bookmark = ({ theme }: ThemeProps) => {
    const { user } = useAuth();
    const [bookmark, setBookmark] = useState();
    const [isFirst, setIsFirst] = useState(true);

    if (user && isFirst) {
        setIsFirst(false);
        const dataPromise = fetchBookMark(user.sawonno);
        dataPromise.then(function (obj: any) {
            setBookmark((obj && obj.data) ? obj.data.bookMarkData : '');
        });
    }

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader title="북마크" />
            {user &&
                <>
                    <Divider />
                    <FolderList data={bookmark} sawonno={user.sawonno} />
                </>
            }
        </Card>
    )
}
export default withTheme(Bookmark);