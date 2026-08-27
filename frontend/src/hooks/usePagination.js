import { useCallback } from "react";
import { useState } from "react";

export const usePagination = (total) => {

    const [pagination, setPagination] = useState({currentPage: 1, itemsPerPage: 20});

    // Calculate the number of pages and the db offset from current page and page size
    const totalPages = Math.ceil(total / pagination.itemsPerPage);
    const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;

    // Change only the current page while keeping the selected page size
    function changeCurrentPage(page){
        setPagination(prev => ({...prev, currentPage:page}))
    }

    // Change the page size without recreating the callback on each render
    const changeItemsPerPage = useCallback((count) => {
        setPagination(prev => ({...prev, itemsPerPage:count}))
    }, [])


    return {pagination, totalPages, offset, changeCurrentPage, changeItemsPerPage};
}

export default usePagination;