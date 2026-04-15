import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();
    
    let pageCount = 1;

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

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

        // Если страница изменилась, обновляем состояние
        if (page !== state.page) {
            const pageInput = pages.querySelector(`input[value="${page}"]`);
            if (pageInput) {
                pageInput.checked = true;
            }
        }

        return Object.assign({}, query, {
            limit,
            page
        });
    }

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);
        
        // Убеждаемся, что page в допустимых пределах
        page = Math.min(page, pageCount);
        page = Math.max(1, page);

        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));

        const startRow = total === 0 ? 0 : (page - 1) * limit + 1;
        const endRow = Math.min(page * limit, total);
        
        fromRow.textContent = startRow;
        toRow.textContent = endRow;
        totalRows.textContent = total;
    }

    return {
        updatePagination,
        applyPagination
    };
}