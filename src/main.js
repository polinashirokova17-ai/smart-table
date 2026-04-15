import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";
import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";

const api = initData(sourceData);

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    return {
        ...state,
        rowsPerPage: parseInt(state.rowsPerPage),
        page: parseInt(state.page ?? 1)
    };
}

async function render(action) {
    let state = collectState();
    let query = {};
    
    query = applySorting(query, state, action);
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applyPagination(query, state, action);
    
    const { total, items } = await api.getRecords(query);
    updatePagination(total, query);
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const { applyPagination, updatePagination } = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        el.querySelector('input').value = page;
        el.querySelector('input').checked = isCurrent;
        el.querySelector('span').textContent = page;
        return el;
    }
);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);
const applySearching = initSearching('search');

async function init() {
    const indexes = await api.getIndexes();
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
    render();
}

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);
init();