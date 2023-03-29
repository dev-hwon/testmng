import axios from "axios";
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "react-query"
import CommonKey from "../common/CommonKey"

const SEL_ALL_CODE = "SEL_ALL_CODE";
const SEL = "SEL";
const DET = "DET";
const url = '/api/board/boardList';

export const getBoardListt = () => {

    const queryClient = useQueryClient();
    const boardCode = queryClient.getQueryData(CommonKey.BOARD_CODE);
    const currentPage = queryClient.getQueryData(CommonKey.PAGE_CURRENT);
    const searchKey = queryClient.getQueryData(CommonKey.BOARD_SEARCHKEY);
    const searchValue = queryClient.getQueryData(CommonKey.BOARD_SEARCHVALUE);

    const params = {
        type: SEL,
        board_code: boardCode,
        currentPage: typeof currentPage != 'undefined' ? currentPage : 1,
        search_key: typeof searchKey != 'undefined' ? searchKey : '',
        search_value: typeof searchValue != 'undefined' ? searchValue : ''
    }
    //console.log(params);
    const boardList = useQuery(CommonKey.BOARD_LIST, () =>
        axios.get(url, { params }),

    );

    const result = boardList.data;
    if (result && result.data.result == 0) {
        //console.log(result.data.data);
        queryClient.setQueryData(CommonKey.PAGE_TOTAL, result.data.totalPage);
        queryClient.setQueryData(CommonKey.PAGE_START, result.data.startPage);
        queryClient.setQueryData(CommonKey.PAGE_END, result.data.endPage);
        queryClient.setQueryData(CommonKey.PAGE_SIZE, result.data.pageSize);
        return result.data
    }
}

export const getBoardCodeList = () => {

    const params = {
        type: SEL_ALL_CODE,
    }
    const boardCodelist = useQuery(CommonKey.BOARD_LIST, () => axios.get(url, { params }));

    if (boardCodelist.data) {
        return boardCodelist.data.data
    }
}

export const getAll = (params: any) => {
    return useQuery([CommonKey.BOARD_LIST], async () => {
        const { data } = await axios.get(url, { params });
        return data;
    },
        {
            refetchOnWindowFocus: false
        }
    )
}

export const getAllTest = (params: any) => {
    const qc = useQueryClient();
    const { data: getAllList, isSuccess } = useQuery([CommonKey.BOARD_LIST], async () => {
        const { data } = await axios.get(url, { params });
        return data;
    })

    const getTest = useCallback(() => {
        const items = [];
        if (isSuccess) {
            for (let i = 0; i < getAllList.data.length; i++) {
                items.push(getAllList.data[i]);
            }
        }
        return items
    }, [getAllList])

    const getBoardData = {
        currentPage: qc.getQueryData(CommonKey.PAGE_CURRENT),
        startPage: qc.getQueryData(CommonKey.PAGE_START),
        endPage: qc.getQueryData(CommonKey.PAGE_END),
        totalPage: qc.getQueryData(CommonKey.PAGE_TOTAL),
        setCurrentPage: (param: Number) => qc.setQueryData(CommonKey.PAGE_CURRENT, param),
        setStartPage: (param: Number) => qc.setQueryData(CommonKey.PAGE_START, param),
        setEndPage: (param: Number) => qc.setQueryData(CommonKey.PAGE_END, param),
        setTotalPage: (param: Number) => qc.setQueryData(CommonKey.PAGE_TOTAL, param),
        getList: useCallback(() => {
            const items = [];
            if (isSuccess) {
                for (let i = 0; i < getAllList.data.length; i++) {
                    items.push(getAllList.data[i]);
                }
            }
            qc.invalidateQueries(CommonKey.PAGE_CURRENT);
            qc.invalidateQueries(CommonKey.PAGE_START);
            qc.invalidateQueries(CommonKey.PAGE_END);
            qc.invalidateQueries(CommonKey.PAGE_TOTAL);
            return items
        }, [getAllList]),

    }

    return { getTest, getBoardData }
}