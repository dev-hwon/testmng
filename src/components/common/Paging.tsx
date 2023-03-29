import React, { useEffect, useState } from 'react';

const Paging = (props: any) => {
    const { code, size, count, totalCount, currentPage, setCurrentPage} = props;
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [prev, setPrev] = useState(0);
    const [next, setNext] = useState(0);
    const [pageList, setPageList] = useState(Array);

    useEffect(() => {
        let totalP = totalCount / size + 1; 
        let startP = Math.floor((currentPage - 1) / count) * count + 1;
        let endP = startP + count - 1;

        // if(totalPage < currentPage){
        //     currentPage = totalPage;
        // }
        if(endP > totalP){
            endP = totalP;
        }
        setStartPage(startP);
        setEndPage(endP);
        setTotalPage(totalP);
        window.scrollTo(0, 0);
    }, [code, totalCount, size, count, currentPage, setStartPage, setEndPage, setTotalPage]);
    
    useEffect(() => {
        let prevP = startPage - 1;
        let nextP = endPage + 1;
        const dataItem = [];
        for (let i = startPage; i <= endPage; i++) {
            dataItem.push(i);
        }
        setPageList(dataItem);
        setPrev(prevP);
        setNext(nextP);
    }, [startPage, endPage, setPageList, setPrev, setNext])
    
    return (
        <div className="board_paging" >
            <ul>
                {startPage == 1 ? "" : <li onClick={() => setCurrentPage(prev)}>이전</li>}
                {pageList.map((item, i) => (
                    <li key={i}
                        className={currentPage == item ? 'active' : ''}
                        onClick={() => setCurrentPage(item)}> {item}
                    </ li>
                ))}
                {endPage == totalPage ? "" : <li onClick={() => setCurrentPage(next)}>다음</li>}
            </ul>
        </div >
    )
}

export default Paging;