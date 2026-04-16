import {makeIndex} from "./lib/utils.js";

export function initData(sourceData) {
    const sellers = makeIndex(sourceData.sellers, 'id', v => `${v.first_name} ${v.last_name}`);
    const customers = makeIndex(sourceData.customers, 'id', v => `${v.first_name} ${v.last_name}`);
    const data = sourceData.purchase_records.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

    // переменные для кеширования данных
    let cachedSellers;
    let cachedCustomers;
    let lastResult;
    let lastQuery;

    // функция для приведения строк в тот вид, который нужен нашей таблице
    const mapRecords = (data) => data.map(item => {
        if (!cachedSellers || !cachedCustomers) {
            throw new Error('Indexes not loaded');
        }

        return {
            id: item.receipt_id,
            date: item.date,
            seller: cachedSellers[item.seller_id],
            customer: cachedCustomers[item.customer_id],
            total: item.total_amount
        }
    });

    // функция получения индексов
    const getIndexes = async () => {
        if (!cachedSellers || !cachedCustomers) {
            [cachedSellers, cachedCustomers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(res => res.json()),
                fetch(`${BASE_URL}/customers`).then(res => res.json()),
            ]);
        }

        return { sellers: cachedSellers, customers: cachedCustomers };
    }

    // функция получения записей о продажах с сервера
    const getRecords = async (query, isUpdated = false) => {
        const qs = new URLSearchParams(query);
        const nextQuery = qs.toString();

        if (lastQuery === nextQuery && !isUpdated) {
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
    };

    return {
        getIndexes,
        getRecords
    }
}