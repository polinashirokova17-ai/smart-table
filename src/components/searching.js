export function initSearching(searchField) {
    return (query, state, action) => {
        const searchValue = state[searchField];
        
        if (searchValue && searchValue.trim()) {
            return Object.assign({}, query, {
                search: searchValue.trim()
            });
        }
        
        return query;
    }
}