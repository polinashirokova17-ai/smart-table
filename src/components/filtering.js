// src/components/filtering.js

export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            // Очищаем существующие опции, кроме первой (пустой)
            while (elements[elementName].options.length > 1) {
                elements[elementName].remove(1);
            }
            
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    return option;
                })
            );
        });
    }

    const applyFiltering = (query, state, action) => {
        // Обработка очистки поля
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field;
            const input = action.parentElement.querySelector('input');
            if (input) {
                input.value = '';
                state[fieldName] = '';
            }
        }

        const filter = {};
        
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element && element.value) {
                if (key === 'totalFrom' || key === 'totalTo') {
                    // Пропускаем, обработаем отдельно
                    return;
                }
                filter[`filter[${element.name}]`] = element.value;
            }
        });

        // Обработка диапазона total
        const totalFrom = elements.totalFrom?.value;
        const totalTo = elements.totalTo?.value;
        if (totalFrom || totalTo) {
            filter['filter[total]'] = [totalFrom || '', totalTo || ''];
        }

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    }

    return {
        updateIndexes,
        applyFiltering
    };
}