import { useState } from "react";
import './Pagination.css';

function buildPageNumbers(currentPage, totalPages){
    const pages = [];
    pages.push(
        1, 
        totalPages, 
        currentPage, 
        currentPage - 1, 
        currentPage + 1,)
    pages.sort((a,b) => a - b);
    const sortedPages = [...new Set(pages)].filter(item => (item > 0 && item <= totalPages));
    console.log('sortedPages:', sortedPages);
    for(let i = 0; i < sortedPages.length - 1; i++){
        if((sortedPages[i+1] - sortedPages[i]) > 1){
            sortedPages.splice(i+1, 0, '...');
            i++;
        }
    }
    return sortedPages;
}

function Pagination() {
    const totalPages = 24;
    const [currentPage, setCurrentPage] = useState(1);
    const pageNumbers = buildPageNumbers(currentPage, totalPages);

    return (
        <div className="page-numbers">
            {currentPage != 1 && <button onClick={() => setCurrentPage(prev => prev - 1)}>prev</button>}
            {pageNumbers.map(page => (
                page === currentPage ? (
                    <button onClick={() => setCurrentPage(page)}>[{page}]</button>
                ) : (
                    <button onClick={() => setCurrentPage(page)}>{page}</button>
                )
            ))}
            {currentPage != totalPages && <button onClick={() => setCurrentPage(prev => prev + 1)}>next</button>}
        </div>
    )
}

export default Pagination;