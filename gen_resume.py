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
        self.cell(tw + 2, 12, title)
        self.set_font("Helvetica", "", 8.5)
        self.set_text_color(68, 68, 68)
        sep_w = self.get_string_width(" | ")
        self.cell(sep_w, 12, " | ")
        self.set_font("Helvetica", "I", 8.5)
        cw = self.get_string_width(company)
        self.cell(cw + 2, 12, company)
        self.set_font("Helvetica", "", 8.5)
        self.set_text_color(85, 85, 85)
        self.cell(0, 12, date, align="R", new_x="LMARGIN", new_y="NEXT")

    def client_label(self, text):
        self.set_font("Helvetica", "B", 8.5)
        self.set_text_color(34, 34, 34)
        self.cell(0, 11, text, new_x="LMARGIN", new_y="NEXT")

    def bullet(self, text):
        self.set_font("Helvetica", "", 8.5)
        self.set_text_color(51, 51, 51)
        x = self.get_x()
        self.cell(8, 4, "-")
        self.set_x(x + 8)
        self.multi_cell(0, 10.5, text, new_x="LMARGIN", new_y="NEXT")

    def skill_row(self, items):
        col_w = (self.w - self.l_margin - self.r_margin) / len(items)
        self.set_font("Helvetica", "", 8.5)
        self.set_text_color(51, 51, 51)
        y = self.get_y()
        for i, item in enumerate(items):
            self.set_xy(self.l_margin + i * col_w, y)
            self.cell(col_w, 10.5, item)
        self.set_y(y + 10.5)


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
        "4707 Wilson Road, Kenosha, WI 53142 | (262) 995-4394 | jlaviole90@gmail.com | linkedin.com/in/joshualaviolette | jlav.io",
        new_x="LMARGIN",
        new_y="NEXT",
    )

    pdf.ln(3)

    # Summary
    pdf.section_divider("Summary")
    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(
        0,
        10.5,
        (
            "Full-stack software engineer specializing in enterprise integrations, API design, "
            "and modernizing legacy systems. Experienced across the full development lifecycle "
            "from architecture through deployment, with a track record of translating complex "
            "business requirements into scalable, maintainable solutions. Actively leverages AI "
            "tooling to accelerate development workflows, improve code quality, and multiply "
            "individual output across concurrent engagements."
        ),
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(2)

    # Skills
    pdf.section_divider("Skills")
    pdf.skill_row(
        [
            "Java / Spring Boot / .NET",
            "Angular / React / Next.js / Node.js",
            "Python / TypeScript / Go / Rust",
        ]
    )
    pdf.skill_row(
        [
            "PostgreSQL / Oracle / Redis / NoSQL",
            "AWS / Azure / GCP",
            "Docker / Kubernetes / Terraform / CI/CD",
        ]
    )
    pdf.skill_row(
        [
            "REST API Design / Microservices",
            "Event-Driven Architecture / Kafka",
            "AI Integration / LLM / ML",
        ]
    )
    pdf.skill_row(
        [
            "System Design / Performance Tuning",
            "Third-Party Integrations / OAuth",
            "Agile / Technical Leadership",
        ]
    )
    pdf.ln(2)

    # Experience
    pdf.section_divider("Experience")

    pdf.job_header("Senior Software Engineer", "Zeal IT Consultants", "Apr 2024 - Present")
    pdf.bullet(
        "Supporting Chicago market expansion for the Dallas-based firm, building local brand "
        "presence through professional networking and co-organizing a private executive event "
        "featuring a panel on AI in the software development lifecycle."
    )

    pdf.client_label("Client: McKesson (Jan 2025 - Present)")
    pdf.bullet(
        "Architected and built a greenfield prescription eligibility checking engine, "
        "replacing a set of critical nodes within a 200+ decision/action workflow "
        "engine embedded in a 30-year-old Java/Swing monolith, streamlining "
        "prescription routing for a pharmacy network that serves a substantial "
        "share of locations across the country."
    )
    pdf.bullet(
        "Worked directly with the customer-facing product team to translate business "
        "requirements into technical specifications, bridging the gap between product vision "
        "and the development team to ensure alignment on priorities, compliance expectations, "
        "and delivery timelines."
    )
    pdf.bullet(
        "Designed APIs that consolidated multiple legacy data sources, reducing network "
        "overhead and creating data visibility for technicians and customers with "
        "first-ever detailed eligibility history views."
    )
    pdf.bullet(
        "Built a resilient integration layer between the new microservice and the legacy system "
        "using circuit breakers, retries, and multi-tenant authentication, ensuring backward "
        "compatibility while enabling modern capabilities."
    )
    pdf.bullet(
        "Served as tech lead: mentored entry-level developers, led architecture discussions, "
        "reviewed PRs, and coordinated across product, architecture, and data insights teams "
        "as a consultant embedded in the business."
    )

    pdf.client_label("Client: Qualbe Marketing Group (Apr 2024 - Oct 2025)")
    pdf.bullet(
        "Increased brand revenue and site traffic by 2x and 3x, respectively. "
        "Retained by the client for 18 months due to volume and quality of delivered work, "
        "despite being initially scoped for a 6-month engagement."
    )
    pdf.bullet(
        "Sole developer on the engagement: independently designed, built, and deployed "
        "customer-facing checkout systems for dental discount plans (1dental.com, "
        "careington1.com, and compliance sites), handling multiple providers, pricing "
        "models, and payment flows."
    )
    pdf.bullet(
        "Integrated a broad set of third-party services and custom design to support "
        "multi-brand checkout, affiliate tracking, and provider search across consumer, "
        "wholesale, and Spanish-language sites - owning every feature end-to-end from "
        "requirements through production deployment."
    )
    pdf.bullet(
        "Engineered a domain resolution service that redirected 80+ "
        "legacy affiliate subdomains to the modernized platform with preserved affiliate "
        "attribution codes, preserving the integrity of the affiliate ecosystem despite "
        "expectations it would be lost."
    )
    pdf.bullet(
        "Adopted AI-assisted development tools early to accelerate feature delivery, "
        "streamline code review, and rapidly onboard into unfamiliar codebases and "
        "third-party ecosystems."
    )

    pdf.job_header("Software Developer - Supply Chain", "Uline", "Jun 2022 - Apr 2024")
    pdf.bullet(
        "Led a team of five in refactoring a monolithic service into microservices, enabling "
        "operations teams to maintain visibility and legislative compliance for domestic and "
        "international transfers."
    )
    pdf.bullet(
        "Built an integration framework between Manhattan WMS and a modernized microservices "
        "architecture for warehouse management."
    )
    pdf.bullet(
        "Implemented idempotent purchase order transaction tracking to prevent duplicate "
        "updates across distributed systems."
    )

    pdf.job_header("Software Engineering Intern", "UW-Parkside App Factory", "Sep 2021 - May 2022")
    pdf.bullet(
        "Developed a public-facing kiosk application displaying real-time solar panel data "
        "for the City of Menasha, Wisconsin."
    )

    pdf.job_header("Freelance Web Developer", "634 Properties (634properties.com)", "2020 - Present")
    pdf.bullet(
        "Developed and maintained the company website through multiple full redesigns, "
        "evolving the platform alongside changing business needs and branding."
    )
    pdf.bullet(
        "Integrated third-party APIs for property listings, enabling automated and "
        "up-to-date inventory display for prospective buyers and renters."
    )
    pdf.bullet(
        "Planned and executed digital advertising campaigns that drove a 10x increase "
        "in web viewership."
    )

    pdf.ln(2)

    # Personal Projects
    pdf.section_divider("Personal Projects")

    pdf.bullet(
        "Built multiple Discord bots in Go for server analytics and AI, including a "
        "data collection bot that provides engagement insights and feeds cleaned "
        "conversation data into a local LLM training pipeline, and a chatbot powered "
        "by the resulting fine-tuned model."
    )
    pdf.bullet(
        "Built a live bird feeder camera stream on jlav.io using RTMP-to-HLS conversion "
        "on a Raspberry Pi with Nginx, exposed via Tailscale Funnel, with "
        "passphrase-protected access through a Vercel serverless function."
    )
    pdf.bullet(
        "Designed and built jlav.io as an interactive Angular 19 portfolio featuring "
        "scroll-driven animations, a terminal-themed dashboard, dynamic GitHub project "
        "listings via serverless API, and a full web-based resume."
    )

    pdf.ln(2)

    # Education
    pdf.section_divider("Education")
    pdf.job_header("B.S. Computer Science", "University of Wisconsin - Parkside", "Jun 2019 - May 2022")

    pdf.job_header("Dual Enrollment, IT Fundamentals & Networking", "Lakeview Technology Academy", "Graduated 2017")

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
