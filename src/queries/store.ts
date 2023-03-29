import axios from "axios";
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "react-query"
import CommonKey from "../common/CommonKey";
import { getAll } from "./Board";
const url = '/api/board/boardList';

export const Store = () => {
    const qc = useQueryClient();
    const store = {
        boardList: (params: any) => {
            const { data: getBoardList, isSuccess: getBoardSuccess } = useQuery([CommonKey.BOARD_LIST, params], () =>
                axios.get(url, { params })
            )
            return { getBoardList, getBoardSuccess }
        },
        setData: (key: string, value: any) => {
            return qc.setQueryData(key, value)
        },

        getData: (key: string) => {
            return qc.getQueryData(key)
        }

    }

    return { qc, store }
}

const params = {
    type: "SEL",
    board_code: 381,
    currentPage: 1,
    search_key: '',
    search_value: ''
}






