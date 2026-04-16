import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // Добавляем шаблоны до таблицы (в обратном порядке для prepend)
    before.reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    // Добавляем шаблоны после таблицы
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    // Обработка событий
    root.container.addEventListener('change', () => {
        onAction(undefined);
    });

    root.container.addEventListener('reset', () => {
        setTimeout(() => {
            onAction(undefined);
        }, 0);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });
            
            return row.container;
        });
        
        // Проверяем наличие элемента rows
        if (root.elements.rows) {
            root.elements.rows.replaceChildren(...nextRows);
        } else {
            // Если rows нет, ищем tbody
            const tbody = root.container.querySelector('tbody');
            if (tbody) {
                tbody.replaceChildren(...nextRows);
            }
        }
    }

    return {...root, render};
}