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
            "Senior software engineer who thrives on autonomy and moves fast. Turns ambiguous "
            "business requirements into production-ready systems, operating end-to-end from "
            "architecture through deployment. Combines strong technical judgment with creativity "
            "and relentless ownership - whether leading teams, shipping as a sole contributor, "
            "or navigating unfamiliar domains. Consistently delivers high-impact results across "
            "concurrent engagements."
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
        "Supporting Chicago market expansion for the Dallas-based firm, growing local brand "
        "presence through professional networking and co-organizing a private executive event "
        "featuring a panel on AI in the software development lifecycle."
    )

    pdf.client_label("Client: McKesson (Jan 2025 - Present)")
    pdf.bullet(
        "Architected a greenfield prescription eligibility engine replacing critical nodes "
        "within a 200+ step workflow embedded in a 30-year-old Java/Swing monolith, "
        "streamlining routing for 1M+ daily prescriptions across 4,500+ pharmacy locations."
    )
    pdf.bullet(
        "Partnered with the customer-facing product team to translate business requirements "
        "into technical specifications, aligning priorities, compliance expectations, "
        "and delivery timelines between product and engineering."
    )
    pdf.bullet(
        "Consolidated multiple legacy data sources into unified APIs, reducing network "
        "overhead and providing end-to-end transaction visibility that gave technicians "
        "and customers full insight into processing decisions for the first time."
    )
    pdf.bullet(
        "Established a resilient integration layer between the new microservice and the "
        "legacy system using circuit breakers, retries, and multi-tenant authentication, "
        "ensuring backward compatibility while enabling modern capabilities."
    )
    pdf.bullet(
        "Spearheaded technical direction as embedded tech lead for a platform serving 20,000+ "
        "users: mentored junior developers, led architecture discussions, reviewed PRs, "
        "and coordinated across product, architecture, and data insights teams."
    )

    pdf.client_label("Client: Qualbe Marketing Group (Apr 2024 - Oct 2025)")
    pdf.bullet(
        "Drove 2x revenue growth and 3x site traffic as the sole developer on an 18-month "
        "engagement initially scoped for six months."
    )
    pdf.bullet(
        "Delivered customer-facing checkout systems for dental discount plans across "
        "1dental.com, careington1.com, and compliance sites, handling multiple providers, "
        "pricing models, and payment flows end-to-end."
    )
    pdf.bullet(
        "Orchestrated a broad set of third-party integrations and custom design to support "
        "multi-brand checkout, affiliate tracking, and provider search across consumer, "
        "wholesale, and Spanish-language sites."
    )
    pdf.bullet(
        "Engineered a domain resolution service redirecting 80+ legacy affiliate subdomains "
        "to the modernized platform with preserved attribution codes, maintaining the "
        "integrity of the affiliate ecosystem against expectations."
    )
    pdf.bullet(
        "Leveraged AI-assisted development tools early to accelerate delivery, streamline "
        "code review, and rapidly onboard into unfamiliar codebases and third-party ecosystems."
    )

    pdf.job_header("Software Developer - Supply Chain", "Uline", "Jun 2022 - Apr 2024")
    pdf.bullet(
        "Led a team of five in decomposing a monolithic service into two microservices "
        "and a standalone application, improving operational visibility and legislative "
        "compliance across 5 distribution centers and 25+ warehouses."
    )
    pdf.bullet(
        "Implemented an integration framework between Manhattan WMS and the modernized "
        "microservices architecture, enabling real-time warehouse data flow for domestic "
        "and international transfers."
    )
    pdf.bullet(
        "Eliminated duplicate transaction processing by implementing idempotent purchase "
        "order tracking across distributed systems."
    )

    pdf.job_header("Software Engineering Intern", "UW-Parkside App Factory", "Sep 2021 - May 2022")
    pdf.bullet(
        "Created a public-facing kiosk application displaying real-time solar panel "
        "performance data for the City of Menasha, Wisconsin."
    )

    pdf.job_header("Freelance Web Developer", "634 Properties (634properties.com)", "2020 - Present")
    pdf.bullet(
        "Redesigned and maintained the web platform through multiple iterations for a "
        "property company spanning 6 locations across 4 states, growing monthly visitors "
        "from under 100 to over 10,000 at peak."
    )
    pdf.bullet(
        "Integrated third-party APIs for automated property listings, enabling real-time "
        "inventory display for prospective buyers and renters."
    )
    pdf.bullet(
        "Planned and executed digital advertising campaigns contributing to a sustained "
        "10x increase in web viewership."
    )

    pdf.ln(2)

    # Personal Projects
    pdf.section_divider("Personal Projects")

    pdf.bullet(
        "Created Discord bots in Go serving hundreds of users across multiple servers, "
        "including a data collection bot that processed hundreds of thousands of messages "
        "to feed a local LLM training pipeline and a chatbot powered by the resulting model."
    )
    pdf.bullet(
        "Deployed a live bird feeder camera stream on jlav.io using RTMP-to-HLS conversion "
        "on a Raspberry Pi with Nginx, exposed via Tailscale Funnel with passphrase-protected "
        "access through a Vercel serverless function."
    )
    pdf.bullet(
        "Designed jlav.io as an interactive Angular 19 portfolio featuring scroll-driven "
        "animations, a terminal-themed dashboard, dynamic GitHub project listings via "
        "serverless API, and a full web-based resume."
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
