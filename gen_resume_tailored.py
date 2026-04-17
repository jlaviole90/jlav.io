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

    pdf.ln(2)

    # Summary
    pdf.section_divider("Summary")
    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(
        0,
        11,
        (
            "Senior software engineer who thrives on autonomy and moves fast. Turning ambiguous "
            "business requirements into production-ready systems, operating end-to-end from "
            "architecture through deployment. Combining strong technical judgment with creativity "
            "and relentless ownership, whether leading teams, shipping as a sole contributor, "
            "or rapidly learning unfamiliar domains. Consistently delivering high-impact results "
            "across concurrent engagements at enterprise scale."
        ),
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(1)

    # Skills
    pdf.section_divider("Skills")
    pdf.skill_row(
        [
            "Java / JVM / Spring Boot",
            "Angular / React / Next.js / Node.js",
            "Python / TypeScript / Go / Rust",
        ]
    )
    pdf.skill_row(
        [
            "PostgreSQL / Redis / NoSQL",
            "AWS / Azure / GCP",
            "Docker / Kubernetes / Terraform",
        ]
    )
    pdf.skill_row(
        [
            "GraphQL / REST API / Microservices",
            "Jenkins / GitHub Actions / Build Systems",
            "Gradle / Dependency Management",
        ]
    )
    pdf.skill_row(
        [
            "System Design / Developer Productivity",
            "CI/CD Pipelines / Build Automation",
            "Agile / Technical Leadership",
        ]
    )
    pdf.ln(1)

    # Experience
    pdf.section_divider("Experience")

    pdf.job_header(
        "Senior Software Engineer", "Zeal IT Consultants", "Apr 2024 - Present"
    )
    pdf.role_description(
        "Embedded consultant leading architecture, technical delivery, and mentorship across "
        "concurrent client engagements. Collaborating cross-functionally with product, "
        "engineering, and leadership teams. Enabling Chicago market expansion for the "
        "Dallas-based firm through recurring executive leadership events."
    )

    pdf.client_label("Client: McKesson (Jan 2025 - Apr 2026)")
    pdf.role_description(
        "Architected a greenfield eligibility engine processing 1M+ daily prescriptions "
        "across 4,500+ pharmacy locations, replacing critical nodes in a 30-year-old "
        "monolith. Tech lead on the modernization team for a 20,000+ user platform, "
        "standing up CI/CD pipelines and microservice architecture. Java 8/17, Gradle, Angular, Jenkins."
    )
    pdf.bullet(
        "Consolidated multiple legacy data sources into unified GraphQL and REST APIs, "
        "reducing network overhead and providing end-to-end transaction visibility that "
        "gave technicians and customers full insight into processing decisions for the first time."
    )
    pdf.bullet(
        "Managed Gradle build configurations and dependency resolution across multiple "
        "repositories, establishing repeatable builds with dependency locking and automated "
        "integration testing to ensure reliable deployments."
    )
    pdf.bullet(
        "Established a resilient integration layer using circuit breakers, retries, and "
        "multi-tenant authentication across relational and non-relational data stores, "
        "ensuring backward compatibility while enabling modern capabilities."
    )
    pdf.bullet(
        "Collaborated cross-functionally with product to translate business requirements into "
        "technical specifications, aligning priorities and delivery timelines. Delivered on "
        "schedule after multiple prior team attempts had stalled."
    )

    pdf.client_label("Client: Qualbe Marketing Group (Apr 2024 - Oct 2025)")
    pdf.role_description(
        "Sole developer who redesigned the end-to-end customer experience, driving 2x "
        "revenue growth and 3x site traffic. Owned the full CI/CD pipeline and deployment "
        "automation across multiple environments. Angular, Go, .NET, Node.js, Azure Functions."
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

    pdf.job_header("Software Developer - Supply Chain", "Uline", "Jun 2022 - Apr 2024")
    pdf.role_description(
        "Led a team of five in modernizing a monolithic supply chain service into "
        "microservices, establishing CI/CD pipelines and automated build processes "
        "across the new architecture. Improved visibility and compliance across 5 "
        "distribution centers and 25+ warehouses. Java, Angular, Jenkins."
    )
    pdf.bullet(
        "Implemented an integration framework between Manhattan WMS and the modernized "
        "microservice architecture, managing cross-repository dependency updates to enable "
        "real-time warehouse data flow for domestic and international transfers."
    )
    pdf.bullet(
        "Eliminated duplicate transaction processing by implementing idempotent purchase "
        "order tracking across distributed systems with relational and non-relational stores."
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
        "through multiple redesigns and targeted digital campaigns. "
        "Go, Next.js, Node.js, React, Angular."
    )

    pdf.ln(1)

    # Personal Projects
    pdf.section_divider("Personal Projects")

    pdf.bullet(
        "Built a multi-modal bird species identification system combining a fine-tuned "
        "EfficientNet-B4 classifier with YOLOv8 object detection and Bayesian confidence "
        "adjustment using eBird regional statistics. Real-time pipeline with CI/CD-driven "
        "container deployments on a Raspberry Pi 5. Python, PyTorch, FastAPI, PostgreSQL, "
        "TorchServe, Docker."
    )
    pdf.bullet(
        "Designed jlav.io as an interactive Angular 19 portfolio with automated CI/CD "
        "deployments via Vercel, a live HLS bird camera stream, ML-powered sightings "
        "browser, and dynamic GitHub project listings via serverless API."
    )
    pdf.bullet(
        "Created Discord bots in Go serving hundreds of users across multiple servers, "
        "including a data collection bot that processed hundreds of thousands of messages "
        "to feed a local LLM training pipeline and a chatbot powered by the resulting model."
    )

    pdf.ln(1)

    # Education
    pdf.section_divider("Education")
    pdf.job_header(
        "B.S. Computer Science",
        "University of Wisconsin - Parkside",
        "Jun 2019 - May 2022",
    )

    pdf.job_header(
        "Dual Enrollment, IT Fundamentals & Networking",
        "Lakeview Technology Academy",
        "Graduated 2017",
    )

    y_final = pdf.get_y()
    page_h = 792
    print(
        f'Final Y: {y_final:.0f} / {page_h} ({"FITS" if y_final < page_h - 30 else "OVERFLOW"})'
    )
    print(f"Pages: {pdf.page_no()}")
    pdf.output("/Users/joshualaviolette/Downloads/JOSHUA_LAVIOLETTE_resume_tailored.pdf")
    print("PDF generated: ~/Downloads/JOSHUA_LAVIOLETTE_resume_tailored.pdf")


if __name__ == "__main__":
    build()
