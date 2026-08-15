import { useState } from 'react';
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
    for(let i = 0; i < sortedPages.length - 1; i++){
        if((sortedPages[i+1] - sortedPages[i]) > 1){
            sortedPages.splice(i+1, 0, '...');
            i++;
        }
    }
    return sortedPages;
}

function Pagination( {currentPage, totalPages, changeCurrentPage} ) {
    const pageNumbers = buildPageNumbers(currentPage, totalPages);
    const [jumpInput, setJumpInput] = useState(null);
    const [inputValue, setInputValue] = useState(null);

    function handleButton(newPage){
        changeCurrentPage(newPage);
    };

    return (
        <div className="page-container">
            <div className="page-numbers">
                
                <button 
                disabled={currentPage === 1}
                onClick={() => handleButton(currentPage - 1)}>
                    {'<'}
                </button>

                {pageNumbers.map((page, index) => (

                    page === '...' ? (
                        jumpInput === index ? (
                           
                            <form
                            key={index}
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleButton(Number(inputValue));
                                setJumpInput(null);
                                setInputValue(null);
                            }}>
                                <input 
                                className='jump-input'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}></input>
                            </form>

                        ) : (
                            <button 
                                key={index}
                                className={page === currentPage ? "active" : ''} 
                                onClick={() => setJumpInput(index)}>
                                {page}
                            </button>
                        )
                        
                    ) : (
                        <button 
                            key={index}
                            className={page === currentPage ? "active" : ''} 
                            onClick={() => handleButton(page)}>
                            {page}
                        </button>
                    )
                    
                    
                ))}
                
                <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handleButton(currentPage + 1)}>{'>'}
                </button>          
                
            </div>
        </div>
    )
}

export default Pagination;