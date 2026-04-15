import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();
    
    let pageCount;
    let currentLimit;
    let currentPage;

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;
        
        currentLimit = limit;
        currentPage = page;

        if (action) {
            switch(action.name) {
                case 'prev':
                    page = Math.max(1, page - 1);
                    break;
                case 'next':
                    page = Math.min(pageCount, page + 1);
                    break;
                case 'first':
                    page = 1;
                    break;
                case 'last':
                    page = pageCount;
                    break;
            }
        }

        return Object.assign({}, query, {
            limit: limit,
            page: page
        });
    }

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);
        
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));
        
        const from = (page - 1) * limit + 1;
        const to = Math.min(page * limit, total);
        
        fromRow.textContent = total > 0 ? from : 0;
        toRow.textContent = total > 0 ? to : 0;
        totalRows.textContent = total;
    }

    return {
        updatePagination,
        applyPagination
    };
}