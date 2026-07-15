import os
from datetime import datetime

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph

from docx import Document


class DocumentTool:
    """
    Saves the generated report in multiple formats.
    """

    def __init__(self):
        self.output_dir = os.path.join("docs" , "generated")
        os.makedirs(self.output_dir, exist_ok=True)

    def _timestamp(self):
        return datetime.now().strftime("%Y%m%d_%H%M%S")

    def _build_report(
        self,
        user_request,
        analysis,
        planning,
        reflection,
        final_document,
    ):

        report = f"""
==================================================
AUTONOMOUS AI AGENT EXECUTION REPORT
==================================================

Generated At:
{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

==================================================
USER REQUEST
==================================================

{user_request}

==================================================
ANALYSIS
==================================================

Document Type:
{analysis.document_type}

Goal:
{analysis.goal}

Provided Information:
"""

        if analysis.provided_information:
            for item in analysis.provided_information:
                report += f"- {item}\n"
        else:
            report += "None\n"

        report += "\nMissing Information:\n"

        if analysis.missing_information:
            for item in analysis.missing_information:
                report += f"- {item}\n"
        else:
            report += "None\n"

        report += "\nAssumptions:\n"

        if analysis.assumptions:
            for item in analysis.assumptions:
                report += f"- {item}\n"
        else:
            report += "None\n"

        report += """

==================================================
EXECUTION PLAN
==================================================

"""

        for i, step in enumerate(planning.execution_plan, start=1):
            report += f"{i}. {step}\n"

        report += f"""

==================================================
REFLECTION
==================================================

Approved:
{reflection.approved}

Feedback:

{reflection.feedback}

==================================================
FINAL DOCUMENT
==================================================

{final_document}

==================================================
END OF REPORT
==================================================
"""

        return report

    def save(
        self,
        user_request,
        analysis,
        planning,
        reflection,
        final_document,
    ):

        timestamp = self._timestamp()

        report = self._build_report(
            user_request,
            analysis,
            planning,
            reflection,
            final_document,
        )

        txt_path = os.path.join(
            self.output_dir,
            f"execution_report_{timestamp}.txt"
        )

        md_path = os.path.join(
            self.output_dir,
            f"execution_report_{timestamp}.md"
        )

        pdf_path = os.path.join(
            self.output_dir,
            f"execution_report_{timestamp}.pdf"
        )

        docx_path = os.path.join(
            self.output_dir,
            f"execution_report_{timestamp}.docx"
        )

        # TXT
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(report)

        # Markdown
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(report)

        # PDF
        doc = SimpleDocTemplate(pdf_path)
        styles = getSampleStyleSheet()
        story = []

        for line in report.split("\n"):
            safe_line = (
                line.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace(" ", "&nbsp;")
            )
            story.append(Paragraph(safe_line, styles["BodyText"]))

        doc.build(story)

        # DOCX
        document = Document()

        for line in report.split("\n"):
            document.add_paragraph(line)

        document.save(docx_path)

        return {
            "txt": txt_path,
            "md": md_path,
            "pdf": pdf_path,
            "docx": docx_path,
        }