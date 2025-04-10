
const table = document.getElementsByClassName("table1")[0];
if (table) {
    const header = [...[...table.childNodes].find(node => node.tagName === 'THEAD').childNodes].find(node => node instanceof HTMLTableRowElement);
    const a = document.createElement('a');
    a.innerText = " 👉 Click here to sort by ratings 👈";
    a.style.cursor = 'pointer';
    header.cells[0].appendChild(a);
    a.addEventListener('click', async () => {
        a.remove();
        const loadingIndicator = document.createTextNode(" (...)");
        header.cells[0].appendChild(loadingIndicator);
        const tbody = [...table.childNodes].find(node => node.tagName === 'TBODY');
        const domParser = new DOMParser;
        await Promise.all([...tbody.rows].map(async row => {
            const titleCell = row.cells[0];
            const url = [...titleCell.childNodes].find(node => node.tagName === "A").href;
            const doc = domParser.parseFromString(await (await fetch(url)).text(), "text/html");
            const rating = parseFloat(doc.getElementsByClassName('current-rating')[0].childNodes[0].innerText);
            titleCell.appendChild(document.createTextNode(` (${
                new Array(Math.round(rating)).fill('⭐').join('')
            })`));
            row.rating = rating;
        }));
        const sorted = [...tbody.children].sort((a, b) => b.rating - a.rating);
        for (const elem of sorted) {
            tbody.appendChild(elem);
        }
        loadingIndicator.remove();
        header.cells[0].appendChild(document.createTextNode(" (sorted by ratings 👍)"));
    });
}
