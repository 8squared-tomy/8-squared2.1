export type PdfColumn<T> = {
  header: string;
  value: (row: T) => string | number | boolean | null | undefined;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cellText(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Exports rows as a printable A4 table and opens the browser print dialog, where
 * "Save as PDF" produces a real PDF file. Rendering through the browser keeps
 * Arabic names and RTL layout correct, which a hand-rolled PDF writer with the
 * built-in Latin fonts could not do.
 */
export function exportPdfTable<T>({
  filename,
  title,
  subtitle,
  columns,
  rows,
  rtl,
}: {
  filename: string;
  title: string;
  subtitle?: string;
  columns: PdfColumn<T>[];
  rows: T[];
  rtl?: boolean;
}): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const isRtl = rtl ?? document.documentElement.getAttribute('dir') === 'rtl';
  const generated = new Date().toLocaleString(isRtl ? 'ar' : 'en-GB');
  const head = columns.map((column) => `<th>${escapeHtml(column.header)}</th>`).join('');
  const body = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((column) => `<td>${escapeHtml(cellText(column.value(row)))}</td>`)
          .join('')}</tr>`,
    )
    .join('');

  const html = `<!doctype html>
<html lang="${isRtl ? 'ar' : 'en'}" dir="${isRtl ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(filename.replace(/\.pdf$/i, ''))}</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; color: #14110b; margin: 0; }
  header { margin-bottom: 10px; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  .meta { font-size: 11px; color: #5c5445; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  thead { display: table-header-group; }
  tr { page-break-inside: avoid; }
  th, td { border: 1px solid #b9ad93; padding: 5px 6px; text-align: start; vertical-align: top; }
  th { background: #f0e7d2; font-weight: 700; }
  tbody tr:nth-child(even) { background: #faf6ec; }
  footer { margin-top: 10px; font-size: 10px; color: #5c5445; }
</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(title)}</h1>
    <p class="meta">${subtitle ? `${escapeHtml(subtitle)} · ` : ''}${escapeHtml(generated)}</p>
  </header>
  <table>
    <thead><tr>${head}</tr></thead>
    <tbody>${body || `<tr><td colspan="${columns.length}">—</td></tr>`}</tbody>
  </table>
  <footer>8squared · ${rows.length} ${isRtl ? 'سجل' : 'records'}</footer>
  <script>window.onload = function () { window.focus(); window.print(); };</script>
</body>
</html>`;

  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.position = 'fixed';
  frame.style.insetInlineEnd = '0';
  frame.style.bottom = '0';
  frame.style.width = '0';
  frame.style.height = '0';
  frame.style.border = '0';
  document.body.appendChild(frame);

  const frameDoc = frame.contentDocument;
  const frameWindow = frame.contentWindow;
  if (!frameDoc || !frameWindow) {
    frame.remove();
    return;
  }

  frameDoc.open();
  frameDoc.write(html);
  frameDoc.close();

  // The print dialog is modal, so the iframe can only be removed afterwards.
  const cleanup = () => window.setTimeout(() => frame.remove(), 1500);
  frameWindow.addEventListener('afterprint', cleanup, { once: true });
  window.setTimeout(cleanup, 120000);
}
