export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field;
            const input = action.parentElement.querySelector('input');
            if (input) {
                input.value = '';
                state[fieldName] = '';
            }
        }

        const filter = {};
        
        if (elements.searchBySeller?.value) {
            filter['filter[seller_id]'] = elements.searchBySeller.value;
        }
        
        const totalFrom = document.querySelector('input[name="totalFrom"]')?.value;
        const totalTo = document.querySelector('input[name="totalTo"]')?.value;
        
        if (totalFrom) filter['filter[total_from]'] = totalFrom;
        if (totalTo) filter['filter[total_to]'] = totalTo;

        return Object.keys(filter).length ? { ...query, ...filter } : query;
    }

    return {
        updateIndexes,
        applyFiltering
    }
}