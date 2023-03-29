import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { ThemeProps } from "../../types/theme";
import {
    Card as MuiCard,
    CardHeader,
    List,
    ListItemButton,
    ListItemIcon,
} from "@mui/material";
import {
    Link,
    Button,
    Avatar as MuiAvatar,
    CardContent as MuiCardContent,
    Divider as MuiDivider,
    ListItemButton as MuiListItemButton,
    ListItemText as MuiListItemText,
    Paper as MuiPaper,
} from "@mui/material";
import { spacing } from "@mui/system";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import axios from "axios";


const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CustomListItemText = styled(MuiListItemText)`
    margin-left: 10px;
`;

function FolderList(props: any) {
    const noticeData = props.data;
    const theme = props;
    const router = useRouter();
    return (
        <List>
            {noticeData && noticeData.map((data: any, index: number) => (
            <ListItemButton key={index} href={'/board/Board?code=381&no=' + data.no} >
                <ListItemIcon sx={{ "alignItems" : "center" }} >
                    <ArrowRightIcon />
                    {/* <Link href={'/board/BoardList?board_code=381&board_name=공지사항&type=menu&no=' + data.no}> */}
                    <CustomListItemText primary={data.subject} />
                    {/* </Link> */}
                </ListItemIcon>
            </ListItemButton>
            ))}
        </List>
    );
}

const Notice = ({ theme }: ThemeProps) => {
    const [noticeDom, setNotice] = useState();

    useEffect(() => {
        const dataPromise = axios.get('/api/dashboard/notice');
        dataPromise.then(function (obj: any) {
            setNotice((obj && obj.data.noticeData && obj.data.noticeData.data) ? obj.data.noticeData.data : '');
        });
    }, []);
    return (
        <Card>
            <CardHeader
                title="공지사항"
                action={
                    <Button href='/board/Board?code=381' variant="text" color="primary" size="small" >
                        더보기
                    </Button>
                }
            />
            <Divider color={"#ddd"} />
            <FolderList data={noticeDom} />
        </Card>
    )
}
export default withTheme(Notice);
