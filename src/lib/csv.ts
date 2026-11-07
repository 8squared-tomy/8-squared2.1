type CsvValue = string | number | boolean | null | undefined;

export type CsvColumn<T> = {
  header: string;
  value: (row: T) => CsvValue;
};

// Guard against spreadsheet formula injection, but keep real negative numbers
// (e.g. -5) readable instead of escaping every leading minus sign.
function needsFormulaPrefix(text: string): boolean {
  if (/^[=+@\t\r]/.test(text)) return true;
  return /^-/.test(text) && !/^-\d+(\.\d+)?$/.test(text);
}

function escapeCell(value: CsvValue): string {
  let text = value === null || value === undefined ? '' : String(value);
  if (needsFormulaPrefix(text)) {
    text = `'${text}`;
  }
  return `"${text.replace(/"/g, '""')}"`;
}

export function buildCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((column) => escapeCell(column.header)).join(',');
  const body = rows.map((row) => columns.map((column) => escapeCell(column.value(row))).join(','));
  return [header, ...body].join('\r\n');
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob(['\uFEFF', content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoking synchronously can abort the download in Firefox and Safari.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
