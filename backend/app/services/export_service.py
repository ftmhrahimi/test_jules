from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
import io

class ExportService:
    @staticmethod
    def generate_report_pdf(report_data):
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()

        # Title
        elements.append(Paragraph(f"PM Validation Report - {report_data.task_id}", styles['Title']))
        elements.append(Spacer(1, 12))

        # Header Info
        header_data = [
            ["Site ID", report_data.site_id or "N/A"],
            ["Category", report_data.category or "N/A"],
            ["Subcategory", report_data.subcategory or "N/A"],
            ["Report Date", report_data.report_date or "N/A"],
            ["Overall Confirmation", f"{report_data.overall_confirmation:.2f}%"]
        ]
        t = Table(header_data, colWidths=[100, 300])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 20))

        # Items Table
        items_data = [["#", "Description", "Result", "AI Verdict"]]
        for item in report_data.items:
            items_data.append([
                item.item_num,
                Paragraph(item.description, styles['Normal']),
                item.reported_result,
                item.ai_verdict
            ])

        t_items = Table(items_data, colWidths=[30, 270, 70, 80])
        t_items.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.gold),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        elements.append(t_items)

        # Summary / Summarization if available
        # (Assuming we store summarization in report model later)

        doc.build(elements)
        buffer.seek(0)
        return buffer
