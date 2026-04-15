export function initSearching(searchField) {
    return (query, state, action) => {
        return state[searchField] ? { ...query, search: state[searchField] } : query;
    }
}