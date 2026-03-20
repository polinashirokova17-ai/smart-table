// src/components/filtering.js
import {createComparison, defaultRules} from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field;
            const input = action.parentElement.querySelector('input');
            if (input) {
                input.value = '';
                state[fieldName] = '';
            }
        }

        // @todo: #4.3 — настроить компаратор
        const compare = createComparison(defaultRules);
        
        // Подготавливаем состояние для сравнения диапазона суммы
        const filterState = {...state};
        
        // Преобразуем totalFrom и totalTo в массив для правила arrayAsRange
        if (filterState.totalFrom !== undefined || filterState.totalTo !== undefined) {
            const from = filterState.totalFrom !== '' ? Number(filterState.totalFrom) : '';
            const to = filterState.totalTo !== '' ? Number(filterState.totalTo) : '';
            filterState.total = [from, to];
        }
        
        // Удаляем исходные поля, чтобы они не мешали сравнению
        delete filterState.totalFrom;
        delete filterState.totalTo;

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, filterState));
    }
}