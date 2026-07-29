import { useState } from "react";
import './Pagination.css';

function buildPageNumbers(currentPage, totalPages){
    const pages = [1, totalPages];
    
    if(currentPage <=3){
        //beginning
        pages.push(2,3,4,5);
    } else if (currentPage >= totalPages -2) {
        //end
        pages.push(
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1
        );
    } else {
        //middle
        pages.push(
            currentPage - 1, 
            currentPage, 
            currentPage + 1,)
    }
    
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
        <div className="page-container">
            <div className="page-numbers">
                
                <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}>
                    {'<'}
                </button>

                {pageNumbers.map(page => (
                    <button className={page === currentPage ? "active" : ''} onClick={() => setCurrentPage(page)}>{page}</button>
                ))}
                
                <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}>{'>'}
                </button>
            </div>
        </div>
    )
}

export default Pagination;