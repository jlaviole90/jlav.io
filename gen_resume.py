import sys

sys.path.insert(0, ".pip_libs")

from fpdf import FPDF


class ResumePDF(FPDF):
    def __init__(self):
        super().__init__("P", "pt", "Letter")
        self.set_auto_page_break(auto=False)
        self.set_margins(40, 36, 40)

    def section_divider(self, title):
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(17, 17, 17)
        self.cell(0, 13, title.upper(), new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(170, 170, 170)
        self.line(
            self.l_margin,
            self.get_y() - 1.5,
            self.w - self.r_margin,
            self.get_y() - 1.5,
        )

    def job_header(self, title, company, date):
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(26, 26, 26)
        tw = self.get_string_width(title)
        self.cell(tw + 2, 11, title)
        self.set_font("Helvetica", "", 8.5)
        self.set_text_color(68, 68, 68)
        sep_w = self.get_string_width(" | ")
        self.cell(sep_w, 11, " | ")
        self.set_font("Helvetica", "I", 8.5)
        cw = self.get_string_width(company)
        self.cell(cw + 2, 11, company)
        self.set_font("Helvetica", "", 8.5)
        self.set_text_color(85, 85, 85)
        self.cell(0, 11, date, align="R", new_x="LMARGIN", new_y="NEXT")

    def role_description(self, text):
        self.set_font("Helvetica", "I", 8.5)
        self.set_text_color(51, 51, 51)
        self.multi_cell(0, 11, text, new_x="LMARGIN", new_y="NEXT")

    def client_label(self, text):
        self.set_font("Helvetica", "BI", 8)
        self.set_text_color(51, 51, 51)
        self.cell(0, 11, text, new_x="LMARGIN", new_y="NEXT")

    def bullet(self, text):
        self.set_font("Helvetica", "", 8.5)
        self.set_text_color(51, 51, 51)
        x = self.get_x()
        self.cell(8, 11, "-")
        self.set_x(x + 8)
        self.multi_cell(0, 11, text, new_x="LMARGIN", new_y="NEXT")

    def project_bullet(self, name, text):
        self.set_text_color(51, 51, 51)
        x = self.get_x()
        self.set_font("Helvetica", "", 8.5)
        self.cell(8, 11, "-")
        self.set_x(x + 8)
        saved_margin = self.l_margin
        self.l_margin = x + 8
        self.set_font("Helvetica", "B", 8.5)
        self.write(11, f"{name} -- ")
        self.set_font("Helvetica", "", 8.5)
        self.write(11, text)
        self.l_margin = saved_margin
        self.ln(11)

    def skill_row(self, items):
        col_w = (self.w - self.l_margin - self.r_margin) / len(items)
        self.set_font("Helvetica", "", 8.5)
        self.set_text_color(51, 51, 51)
        y = self.get_y()
        for i, item in enumerate(items):
            self.set_xy(self.l_margin + i * col_w, y)
            self.cell(col_w, 11, item)
        self.set_y(y + 11)


def build():
    pdf = ResumePDF()
    pdf.add_page()

    # Name
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(26, 26, 26)
    pdf.cell(0, 20, "Joshua Laviolette", new_x="LMARGIN", new_y="NEXT")

    # Subtitle
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(68, 68, 68)
    pdf.cell(0, 11, "Senior Software Engineer", new_x="LMARGIN", new_y="NEXT")

    # Contact
    pdf.set_font("Helvetica", "", 7.5)
    pdf.set_text_color(85, 85, 85)
    pdf.cell(
        0,
        9,
        "(262) 995-4394 | jlaviole90@gmail.com | linkedin.com/in/joshualaviolette | jlav.io",
        new_x="LMARGIN",
        new_y="NEXT",
    )

    pdf.ln(5)

    # Summary
    pdf.section_divider("Summary")
    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(
        0,
        11,
        (
            "Senior software engineer building at the intersection of supply chain, "
            "healthcare, and agentic AI. Thrives on autonomy and moves fast -- turning "
            "ambiguous requirements into production-ready systems end-to-end. Combines strong "
            "technical judgment with creativity and relentless ownership, whether leading "
            "teams, shipping as a sole contributor, or architecting multi-phase LLM pipelines."
        ),
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(5)

    # Skills
    pdf.section_divider("Skills")
    pdf.skill_row(
        [
            "Java / Spring Boot / .NET",
            "Agentic AI / LLM Tool-Use / RAG / Embeddings",
            "System Design / Performance Tuning",
        ]
    )
    pdf.skill_row(
        [
            "Python / TypeScript / Go / Rust",
            "AWS / Azure / GCP",
            "Agile / Technical Leadership",
        ]
    )
    pdf.skill_row(
        [
            "Angular / React / Next.js / Node.js",
            "REST API Design / Microservices",
            "Third-Party Integrations / OAuth",
        ]
    )
    pdf.skill_row(
        [
            "PostgreSQL / Oracle / Redis / NoSQL",
            "Docker / Kubernetes / Terraform / CI/CD",
            "Event-Driven Architecture / Kafka",
        ]
    )
    pdf.ln(5)

    # Experience
    pdf.section_divider("Experience")

    pdf.job_header(
        "Senior Software Engineer", "Zeal IT Consultants", "Apr 2024 - Present"
    )
    pdf.role_description(
        "Embedded consultant leading architecture, technical delivery, and mentorship across "
        "concurrent client engagements. Enabling Chicago market expansion for the "
        "Dallas-based firm through a series of AI-focused executive leadership events "
        "and networking opportunities."
    )

    pdf.client_label("Client: McKesson (Jan 2025 - Apr 2026)")
    pdf.role_description(
        "Architected a greenfield eligibility engine processing 1M+ daily prescriptions "
        "across 4,500+ pharmacy locations, replacing critical nodes in a 30-year-old "
        "monolith. Tech lead on the modernization team for a 20,000+ user platform. "
        "Java 8/17, Angular."
    )
    pdf.bullet(
        "Consolidated multiple legacy data sources into unified APIs, reducing network "
        "overhead and providing end-to-end transaction visibility that gave technicians "
        "and customers full insight into processing decisions for the first time."
    )
    pdf.bullet(
        "Established a resilient integration layer using circuit breakers, retries, and "
        "multi-tenant authentication, ensuring backward compatibility while enabling "
        "modern capabilities."
    )
    pdf.bullet(
        "Partnered with the product team to translate business requirements into technical "
        "specifications, aligning priorities and delivery timelines between product "
        "and engineering. Delivered on schedule after multiple prior team attempts had stalled."
    )

    pdf.client_label("Client: Qualbe Marketing Group (Apr 2024 - Oct 2025)")
    pdf.role_description(
        "Sole developer who redesigned the end-to-end customer experience, driving 2x "
        "revenue growth and 3x site traffic over an 18-month engagement initially scoped "
        "for six months. Angular, Go, .NET, Node.js, Azure Functions."
    )
    pdf.bullet(
        "Delivered customer-facing checkout systems for dental discount plans across "
        "1dental.com, careington1.com, and compliance sites, handling multiple providers, "
        "pricing models, and payment flows end-to-end."
    )
    pdf.bullet(
        "Engineered a domain resolution service redirecting 80+ legacy affiliate subdomains "
        "to the modernized platform with preserved attribution codes, maintaining the "
        "integrity of the affiliate ecosystem against expectations."
    )
    pdf.bullet(
        "Orchestrated third-party integrations supporting multi-brand checkout, affiliate "
        "tracking, and provider search across consumer, wholesale, and Spanish-language sites."
    )

    pdf.job_header("Software Developer - Supply Chain", "Uline", "Jun 2022 - Apr 2024")
    pdf.role_description(
        "Led a team of five in modernizing a monolithic supply chain service into "
        "microservices, improving visibility and compliance across 5 distribution "
        "centers and 25+ warehouses. Java, Angular."
    )
    pdf.bullet(
        "Implemented an integration framework between Manhattan WMS and the modernized "
        "architecture, enabling real-time warehouse data flow for domestic and "
        "international transfers."
    )
    pdf.bullet(
        "Eliminated duplicate transaction processing by implementing idempotent purchase "
        "order tracking across distributed systems."
    )

    pdf.job_header(
        "Software Engineering Intern", "UW-Parkside App Factory", "Sep 2021 - May 2022"
    )
    pdf.role_description(
        "Built a public-facing kiosk application displaying real-time solar panel "
        "performance data for the City of Menasha, Wisconsin. Java, React."
    )

    pdf.job_header(
        "Freelance Web Developer",
        "634 Properties (634properties.com)",
        "2020 - Present",
    )
    pdf.role_description(
        "Full ownership of web presence for a property company spanning 6 locations "
        "across 4 states. Grew monthly visitors from under 100 to over 10,000 at peak "
        "through multiple redesigns and targeted digital advertising campaigns. "
        "Go, Next.js, Node.js, React, Angular."
    )
    pdf.bullet(
        "Integrated third-party APIs for automated property listings, enabling real-time "
        "inventory display for prospective buyers and renters."
    )

    pdf.ln(5)

    # Personal Projects
    pdf.section_divider("Personal Projects")

    pdf.project_bullet(
        "Spellweaver",
        "Agentic system that autonomously constructs optimized MTG decks from a user's "
        "card collection. Multi-phase AI pipeline combining vector similarity search for "
        "synergy discovery, LLM-driven strategy planning, and a multi-turn Claude tool-use "
        "loop for iterative card selection -- all constrained to owned cards and format "
        "legality. Python, Anthropic Claude, Voyage AI, Qdrant, Redis, FastAPI, Docker.",
    )
    pdf.project_bullet(
        "Backyard Birder",
        "Real-time bird species identification pipeline processing live camera feeds "
        "through motion detection, object detection, and a fine-tuned image classifier "
        "with regional and seasonal confidence adjustment. Runs autonomously on a "
        "Raspberry Pi 5. Python, PyTorch, FastAPI, PostgreSQL, Docker.",
    )
    pdf.project_bullet(
        "Webalytics",
        "Multi-tenant web analytics platform with sub-second query performance. Go API "
        "with ClickHouse for columnar event storage, PostgreSQL with row-level security, "
        "and Redis for real-time aggregation. Published open-source NPM packages. "
        "Docker, Terraform, AWS.",
    )

    pdf.ln(5)

    # Education
    pdf.section_divider("Education")
    pdf.job_header(
        "B.S. Computer Science",
        "University of Wisconsin - Parkside",
        "Jun 2019 - May 2022",
    )

    pdf.ln(5)

    # Certifications
    pdf.section_divider("Certifications")
    pdf.job_header(
        "Certified Claude Architect - Foundations (CCA-F)",
        "Anthropic",
        "May 2026",
    )

    y_final = pdf.get_y()
    page_h = 792
    print(
        f'Final Y: {y_final:.0f} / {page_h} ({"FITS" if y_final < page_h - 30 else "OVERFLOW"})'
    )
    print(f"Pages: {pdf.page_no()}")
    pdf.output("/Users/joshualaviolette/Downloads/JOSHUA_LAVIOLETTE_resume.pdf")
    print("PDF generated: ~/Downloads/JOSHUA_LAVIOLETTE_resume.pdf")


if __name__ == "__main__":
    build()
