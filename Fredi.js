const fs = require('fs');
const pdf = require('pdf-parse');
const XLSX = require('xlsx');

const pdfPath = "C:\Users\Enrique\OneDrive\Escritorio\Fredy\PDF\fadeco.pdf";

const excelPath = "C:\Users\Enrique\OneDrive\Escritorio\Fredy\Excel";

const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function(data) {

    const lines = data.text.split('\n');
    let tables = [];
    let currentTable = [];

    lines.forEach(line => {
        if (line.trim() !== '') {
            const row = line.split(/\s+/).filter(cell => cell !== '');
            currentTable.push(row);
        } else {
            if (currentTable.length > 0) {
                tables.push(currentTable);
                currentTable = [];
            }
        }
    });

    if (currentTable.length > 0) {
        tables.push(currentTable);
    }

    const wb = XLSX.utils.book_new();

    tables.forEach((table, index) => {
        const ws = XLSX.utils.aoa_to_sheet(table);
        XLSX.utils.book_append_sheet(wb, ws, `Tabla_${index + 1}`);
    });

    XLSX.writeFile(wb, excelPath);
    console.log(`El archivo Excel ha sido guardado en: ${excelPath}`);
}).catch(error => {
    console.error('Error al procesar el PDF:', error);
});
