import {makeIndex} from "./lib/utils.js";

export function initData(sourceData) {
    const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';
    
    let sellersCache;
    let customersCache;
    let lastResult;
    let lastQuery;
    
    const getIndexes = async () => {
        if (!sellersCache || !customersCache) {
            const [sellersRes, customersRes] = await Promise.all([
                fetch(`${BASE_URL}/sellers`),
                fetch(`${BASE_URL}/customers`)
            ]);
            sellersCache = await sellersRes.json();
            customersCache = await customersRes.json();
        }
        return { sellers: sellersCache, customers: customersCache };
    }
    
    const mapRecords = (data) => {
        if (!sellersCache || !customersCache) return [];
        return data.map(item => ({
            id: item.receipt_id,
            date: item.date,
            seller: sellersCache[item.seller_id],
            customer: customersCache[item.customer_id],
            total: item.total_amount
        }));
    };
    
    const getRecords = async (query = {}) => {
        await getIndexes();
        
        const qs = new URLSearchParams(query);
        const nextQuery = qs.toString();
        
        if (lastQuery === nextQuery && lastResult) {
            return lastResult;
        }
        
        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        const records = await response.json();
        
        lastQuery = nextQuery;
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };
        
        return lastResult;
    }
    
    return {
        getIndexes,
        getRecords
    }
}