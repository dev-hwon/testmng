import {
    Box,
    Button,
    Link,
    Paper,
    Typography
} from '@mui/material';
import React, { ReactElement, useEffect, useState } from 'react';
import BookmarkStar from '../../common/BookmarkStar';
import NextLink from "next/link";
import { Breadcrumbs, TopnotiList } from '../../components/board/BoardStyled';
import AuthGuard from '../../components/guards/AuthGuard';
import PageGuard from '../../components/guards/PageGuard';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from "../../layouts/Dashboard";
import MenuList from '../../components/setting/menu/MenuList';
import InsMenuLayer from '../../components/setting/menu/InsMenuLayer';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MenuGroupList from '../../components/setting/menu/MenuGroupList';
import useAuth from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import CommonKey from '../../common/CommonKey';

const SettingMenu = () => {
    const [grNo, setGrNo] = useState(0);
    const [folderNo, setFolderNo] = useState(0);
    const [insPopOpen, setInsPopOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!(user && user.partcode.includes('102205312'))) {
            router.push(CommonKey.PERMISSION_DENIED);
        }
    }, [router, user]);

    const onOpenInsLayer = () => {
         setInsPopOpen(true);
    }

    const onCloseInsLayer = () => {
        setInsPopOpen(false);
    }

    return (
       <AuthGuard>
            <Box className='board__noti'>
                <Helmet title="메뉴 관리" />
                <Typography variant="h3" gutterBottom display="inline">
                    메뉴관리
                </Typography>
                <BookmarkStar pageNo={25} />
                <Breadcrumbs aria-label="Breadcrumb" mt={2}>
                    <NextLink href="/" passHref>
                        <Link>사내게시판</Link>
                    </NextLink>
                    <Typography>메뉴관리</Typography>
                </Breadcrumbs>
                <Paper elevation={0} sx={{ "margin":"1rem 0 0"}}>
                    <TopnotiList>
                        <li className='important'>게시판 형태의 메뉴인 경우 게시물이 존재하지 않아야 삭제가 가능합니다.</li>
                    </TopnotiList>
                </Paper>
            </Box>
            <Box >
                <Button className='menu_box_insert'
                    variant="contained"
                    size="small"
                    onClick={onOpenInsLayer}
                    startIcon={<AddRoundedIcon />}
                > 메뉴 추가
                </Button>
                <MenuGroupList
                    grNo={grNo}
                    setGrNo={setGrNo}
                    folderNo={folderNo}
                    setFolderNo={setFolderNo}/>
            </Box>
            <MenuList
                grNo={grNo}
                folderNo={folderNo}
                reload={reload}
                setReload={setReload} />
            <InsMenuLayer
                reload={reload}
                setReload={setReload}
                insPopOpen={insPopOpen}
                onCloseInsLayer={onCloseInsLayer} />
        </AuthGuard>
    );
};

export default SettingMenu;

SettingMenu.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>
}