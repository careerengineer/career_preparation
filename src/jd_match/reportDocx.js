import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { SECTION_LABELS } from './matchEngine.js';

const NAVY = '0E2750';
const GOLD = 'C9A86A';
const SUB = '565F72';

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatDate(d) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function buildItemParagraphs(item, index) {
  const paragraphs = [
    new Paragraph({
      spacing: { before: 240, after: 80 },
      children: [
        new TextRun({ text: `${index + 1}. `, bold: true, color: NAVY }),
        new TextRun({ text: item.requirement, bold: true, color: NAVY }),
      ],
    }),
  ];

  if (!item.matches || item.matches.length === 0) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: '매칭된 경험/자소서를 찾지 못했습니다.', color: SUB, italics: true }),
        ],
      }),
    );
    return paragraphs;
  }

  item.matches.forEach((m) => {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: `[${m.score}% 일치] `, bold: true, color: GOLD }),
          new TextRun({ text: m.label, bold: true }),
        ],
      }),
      new Paragraph({
        spacing: { after: 120 },
        indent: { left: 200 },
        children: [new TextRun({ text: m.appeal, color: SUB })],
      }),
    );
  });

  return paragraphs;
}

export function exportMatchReportDocx(report, meta = {}) {
  const now = new Date();
  const company = meta.company || '지원기업';
  const candidateCount = report.candidateCount ?? 0;

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: 'CareerEngineer', bold: true, color: GOLD, size: 24 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.TITLE,
      spacing: { after: 240 },
      children: [new TextRun({ text: '직무 매칭 리포트', bold: true, color: NAVY })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: `지원 기업/직무: ${company}`, color: SUB })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: `생성일: ${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
          color: SUB,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 240 },
      children: [new TextRun({ text: `분석된 경험/자소서 수: ${candidateCount}건`, color: SUB })],
    }),
  ];

  (report.sections || []).forEach((section) => {
    if (!section.items || section.items.length === 0) return;
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 160 },
        border: { bottom: { color: GOLD, space: 4, style: 'single', size: 6 } },
        children: [
          new TextRun({ text: SECTION_LABELS[section.key] || section.key, bold: true, color: NAVY }),
        ],
      }),
    );
    section.items.forEach((item, idx) => {
      children.push(...buildItemParagraphs(item, idx));
    });
  });

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `직무매칭리포트_${company}_${formatDate(now)}.docx`);
  });
}
