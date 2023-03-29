import React from 'react';
import { useQueryClient } from 'react-query';
import CommonKey from '../../common/CommonKey';

const BoardPaging = (props: any) => {
    const { data, currentPage, totalPage, startPage, endPage, pageSize, setCurrentPage } = props;
    const qc = useQueryClient();
    // const currentPage = Number(qc.getQueryData(CommonKey.PAGE_CURRENT));
    // const startPage = Number(qc.getQueryData(CommonKey.PAGE_START));
    // const endPage = Number(qc.getQueryData(CommonKey.PAGE_END));
    // const totalPage = Number(qc.getQueryData(CommonKey.PAGE_TOTAL));

    const prev = startPage - 1;
    const next = endPage + 1;
    const dataItem = [];

    for (let i = startPage; i <= endPage; i++) {
        dataItem.push(i);
    }

    //console.log(currentPage);
    const pageItem = dataItem.map((item) => (
        <li key={item}
            className={currentPage == item ? 'active' : ''}
            onClick={() => setCurrentPage(item)}> {item}</ li>

    ))

    return (
        <div className="board_paging" >
            <ul>
                {startPage == 1 ? "" : <li onClick={() => setCurrentPage(prev)}>이전</li>}
                {pageItem}
                {endPage == totalPage ? "" : <li onClick={() => setCurrentPage(next)}>다음</li>}
            </ul>
        </div >
    )
}

export default BoardPaging;