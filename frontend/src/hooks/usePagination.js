import { useCallback } from "react";
import { useState } from "react";

export const usePagination = (total) => {

    const [pagination, setPagination] = useState({currentPage: 1, itemsPerPage: 20});
    const totalPages = Math.ceil(total / pagination.itemsPerPage);
    const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;

    function changeCurrentPage(page){
        setPagination(prev => ({...prev, currentPage:page}))
    }

    const changeItemsPerPage = useCallback((count) => {
        setPagination(prev => ({...prev, itemsPerPage:count}))
    }, [])


    return {pagination, totalPages, offset, changeCurrentPage, changeItemsPerPage};
}

export default usePagination;