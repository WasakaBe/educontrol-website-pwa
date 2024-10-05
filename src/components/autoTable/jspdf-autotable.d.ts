import { jsPDF } from 'jspdf';

declare module 'jspdf-autotable' {
  interface AutoTableOptions {
    head?: Array<object[]>;
    body: Array<object[]>;
    startY?: number;
    theme?: 'striped' | 'grid' | 'plain';
    styles?: object;
    headStyles?: object;
    bodyStyles?: object;
    footStyles?: object;
    alternateRowStyles?: object;
    columnStyles?: { [key: string]: object };
  }

  export function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => jsPDF;
  }
}