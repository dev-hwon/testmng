import React, { useEffect, useState } from 'react';
import { Rating } from "@mui/material";
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import swal from "sweetalert";

async function fetchBookMark(sawonno: string) {
    const data = await axios.get('/api/dashboard/bookmark?sawonno=' + sawonno);
    return data;
}

const BookmarkStar = (props: any) => {
    const { user } = useAuth();
    const [starFlag, setStarFlag] = useState(0);
    const pageNo = props.pageNo;
    const [isFirst, setIsFirst] = useState(true);

    const clickBookMark = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (user) {
            e.preventDefault();
            updateBookmark(pageNo, starFlag, user.sawonno);
        } else {
            swal("", "로그인 정보를 찾을 수 없습니다.", "warning");
        }
    }

    const updateBookmark = (pageno: number, flag: number, sawonno: string) => {
        const apiNm: string = flag == 0 ? 'bookmarkInsert' : 'bookmarkDelete';
        axios.get('/api/dashboard/' + apiNm + '?sawonno=' + sawonno + '&itm_no=' + pageno);
        if (flag === 0) {
            swal("", "북마크가 등록되었습니다.", "success");
            setStarFlag(1);
        } else {
            swal("", "북마크가 해제되었습니다.", "success");
            setStarFlag(0);
        }
    }

    // 초기값
    if (user && isFirst) {
        setIsFirst(false);
        const dataPromise = fetchBookMark(user.sawonno);
        dataPromise.then(function (obj: any) {
            if (obj && obj.data) {
                obj.data.bookMarkData && obj.data.bookMarkData.map((data: any, index: number) => {
                    if (pageNo == data.itm_no) {
                        setStarFlag(1);
                    }
                });
            }
        });
    }

    return (
        <Rating name="customized-color" defaultValue={0} value={starFlag || 0} max={1} onClick={clickBookMark} /> 
    )
}

export default BookmarkStar