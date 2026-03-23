import sys
sys.path.insert(0, '.pip_libs')

from fpdf import FPDF

class ResumePDF(FPDF):
    def __init__(self):
        super().__init__('P', 'pt', 'Letter')
        self.set_auto_page_break(auto=True, margin=44)
        self.set_margins(48, 44, 48)

    def section_divider(self, title):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(17, 17, 17)
        self.cell(0, 16, title.upper(), new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(170, 170, 170)
        self.line(self.l_margin, self.get_y() - 2, self.w - self.r_margin, self.get_y() - 2)

    def job_header(self, title, date):
        self.set_font('Helvetica', 'B', 10.5)
        self.set_text_color(26, 26, 26)
        tw = self.get_string_width(title)
        self.cell(tw + 2, 15, title)
        self.set_font('Helvetica', '', 9.5)
        self.set_text_color(85, 85, 85)
        self.cell(0, 15, date, align='R', new_x="LMARGIN", new_y="NEXT")

    def company_line(self, text):
        self.set_font('Helvetica', 'I', 9.5)
        self.set_text_color(68, 68, 68)
        self.cell(0, 12, text, new_x="LMARGIN", new_y="NEXT")

    def client_label(self, text):
        self.set_font('Helvetica', 'B', 9.5)
        self.set_text_color(34, 34, 34)
        self.cell(0, 14, text, new_x="LMARGIN", new_y="NEXT")

    def bullet(self, text):
        self.set_font('Helvetica', '', 9.5)
        self.set_text_color(51, 51, 51)
        x = self.get_x()
        self.cell(10, 5, '-')
        self.set_x(x + 10)
        self.multi_cell(0, 12.5, text, new_x="LMARGIN", new_y="NEXT")

    def skill_row(self, items):
        col_w = (self.w - self.l_margin - self.r_margin) / 3
        self.set_font('Helvetica', '', 9.5)
        self.set_text_color(51, 51, 51)
        y = self.get_y()
        for i, item in enumerate(items):
            self.set_xy(self.l_margin + i * col_w, y)
            self.cell(col_w, 13, item)
        self.set_y(y + 13)

    def project_header(self, title, tech):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(26, 26, 26)
        tw = self.get_string_width(title)
        self.cell(tw + 4, 14, title)
        self.set_font('Helvetica', '', 9)
        self.set_text_color(100, 100, 100)
        self.cell(0, 14, tech, align='R', new_x="LMARGIN", new_y="NEXT")


def build():
    pdf = ResumePDF()
    pdf.add_page()

    # Name
    pdf.set_font('Helvetica', 'B', 22)
    pdf.set_text_color(26, 26, 26)
    pdf.cell(0, 26, 'Joshua Laviolette', new_x="LMARGIN", new_y="NEXT")

    # Subtitle
    pdf.set_font('Helvetica', '', 12)
    pdf.set_text_color(68, 68, 68)
    pdf.cell(0, 14, 'Software Engineer', new_x="LMARGIN", new_y="NEXT")

    # Contact
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(85, 85, 85)
    pdf.cell(0, 12, '(262) 995-4394  |  jlaviole90@gmail.com  |  linkedin.com/in/joshualaviolette  |  jlav.io', new_x="LMARGIN", new_y="NEXT")

    pdf.ln(6)

    # Summary
    pdf.section_divider('Summary')
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(0, 12.5, (
        'Full-stack software engineer specializing in enterprise integrations, API design, '
        'and modernizing legacy systems. Experienced across the full development lifecycle '
        'from architecture through deployment, with a track record of translating complex '
        'business requirements into scalable, maintainable solutions. Actively leverages AI '
        'tooling to accelerate development workflows, improve code quality, and multiply '
        'individual output across concurrent engagements.'
    ), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # Skills
    pdf.section_divider('Skills')
    pdf.skill_row(['Java / Spring Boot', 'Angular / TypeScript', 'Python / Go / Rust'])
    pdf.skill_row(['REST API Design', 'PostgreSQL / Oracle / NoSQL', 'AWS / Azure Cloud'])
    pdf.skill_row(['AI / ML / LLM Training', 'AI-Assisted Development', 'Kafka / Async Messaging'])
    pdf.skill_row(['CI/CD / Docker', 'Third-Party Integrations', 'Agile / Scrum'])
    pdf.ln(4)

    # Experience
    pdf.section_divider('Experience')

    pdf.job_header('Senior Software Engineer', 'Apr 2024 - Present')
    pdf.company_line('Zeal IT Consultants')

    pdf.client_label('Client: McKesson (Jan 2025 - Present)')
    pdf.bullet(
        'Architected and built a greenfield prescription eligibility checking engine using '
        'Spring Boot and PostgreSQL, replacing a set of critical nodes within a 200+ '
        'decision/action workflow engine embedded in a 30-year-old Java/Swing monolith.'
    )
    pdf.bullet(
        'Worked directly with the customer-facing product team to translate business '
        'requirements into technical specifications, bridging the gap between product vision '
        'and the development team to ensure alignment on priorities, compliance expectations, '
        'and delivery timelines.'
    )
    pdf.bullet(
        'Designed APIs for primary and secondary eligibility that consolidated multiple legacy '
        'data sources, reducing network overhead and improving data visibility for technicians '
        'and customers with first-ever eligibility history views.'
    )
    pdf.bullet(
        'Built a resilient integration layer between the new microservice and the legacy system '
        'using circuit breakers, retries, and multi-tenant authentication, ensuring backward '
        'compatibility while enabling modern capabilities.'
    )
    pdf.bullet(
        'Served as tech lead: mentored entry-level developers, led architecture discussions, '
        'reviewed PRs, and coordinated across product, architecture, and data insights teams '
        'as a consultant embedded in the business.'
    )

    pdf.client_label('Client: Qualbe Marketing Group (Apr 2024 - Oct 2025)')
    pdf.bullet(
        'Designed, built, and deployed customer-facing checkout systems for dental discount '
        'plans (1dental.com, careington1.com) using Angular, Go, and Node.js, handling '
        'multiple providers, pricing models, and payment flows.'
    )
    pdf.bullet(
        'Integrated a broad set of third-party services to support multi-brand checkout, '
        'affiliate tracking, and provider search across consumer, wholesale, and '
        'Spanish-language sites.'
    )
    pdf.bullet(
        'Engineered an Azure Functions-based domain resolution service that redirected 80+ '
        'legacy affiliate subdomains to the modernized platform with preserved affiliate '
        'attribution codes.'
    )
    pdf.bullet(
        'Retained by the client for 18 months due to volume and quality of delivered work, '
        'despite being initially scoped for a 6-month engagement. Managed both the Qualbe '
        'and McKesson engagements concurrently for 10 months, consistently delivering '
        'high-quality results on both.'
    )
    pdf.bullet(
        'Adopted AI-assisted development tools early to accelerate feature delivery, '
        'streamline code review, and rapidly onboard into unfamiliar codebases and '
        'third-party ecosystems, directly contributing to the pace that earned the '
        'extended engagement.'
    )

    pdf.job_header('Software Developer - Supply Chain', 'Jun 2022 - Apr 2024')
    pdf.company_line('Uline')
    pdf.bullet(
        'Led a team of five in refactoring a monolithic service into microservices, enabling '
        'operations teams to maintain visibility and legislative compliance for domestic and '
        'international transfers.'
    )
    pdf.bullet(
        'Built an integration framework between Manhattan WMS and a modernized microservices '
        'architecture for warehouse management.'
    )
    pdf.bullet(
        'Implemented idempotent purchase order transaction tracking to prevent duplicate '
        'updates across distributed systems.'
    )
    pdf.bullet(
        'Organized a hackathon and built a system for generating customer orders through '
        'email-based punch-out systems, leveraging machine learning for email categorization '
        'and product suggestions.'
    )

    # Keep internship together on one page
    if pdf.get_y() + 55 > 792 - 44:
        pdf.add_page()

    pdf.job_header('Software Engineering Intern', 'Sep 2021 - May 2022')
    pdf.company_line('UW-Parkside App Factory, Kenosha, WI')
    pdf.bullet(
        'Developed a public-facing kiosk application displaying real-time solar panel data '
        'for the City of Menasha, Wisconsin.'
    )

    pdf.ln(4)

    # Personal Projects
    pdf.section_divider('Personal Projects')

    pdf.project_header('Discord Server Analytics Bot', 'Go')
    pdf.bullet(
        'Built a Discord bot in Go that collects and analyzes server activity, providing '
        'users with detailed insights including post counts, message history, channel '
        'popularity rankings, and per-user engagement statistics.'
    )
    pdf.bullet(
        'Designed a data cleaning and formatting pipeline that transforms raw Discord '
        'conversation data into structured training datasets suitable for LLM fine-tuning.'
    )
    pdf.bullet(
        'Feeds processed data into a local network training pipeline on Raspberry Pi '
        'hardware, handling the full lifecycle from collection through model deployment.'
    )

    pdf.project_header('Discord LLM Chatbot', 'Go / Python')
    pdf.bullet(
        'Deployed a conversational AI chatbot to Discord, powered by a locally trained '
        'LLM fine-tuned on real user conversation data collected by the analytics bot.'
    )
    pdf.bullet(
        'Built the end-to-end pipeline connecting data collection, model training, and '
        'live inference across multiple services on a local network.'
    )

    pdf.project_header('Bird Feeder Live Stream', 'Nginx / HLS / Vercel')
    pdf.bullet(
        'Built a live bird feeder camera stream on jlav.io using a Birdify camera '
        'streaming RTMP to a Raspberry Pi running Nginx for HLS conversion, exposed '
        'publicly via Tailscale Funnel.'
    )
    pdf.bullet(
        'Implemented passphrase-protected access through a Vercel serverless function '
        'that validates credentials server-side before returning the stream URL, '
        'with browser playback handled by hls.js.'
    )

    pdf.project_header('jlav.io - Personal Portfolio', 'Angular / Vercel')
    pdf.bullet(
        'Designed and built a personal portfolio site featuring scroll-driven grid '
        'animations, a terminal-themed typewriter dashboard, dynamic GitHub project '
        'listings via serverless API, and a full interactive resume page.'
    )

    pdf.ln(4)

    # Education
    pdf.section_divider('Education')
    pdf.set_font('Helvetica', 'B', 10.5)
    pdf.set_text_color(26, 26, 26)
    bw = pdf.get_string_width('Bachelor of Science in Computer Science')
    pdf.cell(bw + 4, 14, 'Bachelor of Science in Computer Science')
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(85, 85, 85)
    pdf.cell(0, 14, 'May 2022', align='R', new_x="LMARGIN", new_y="NEXT")
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(68, 68, 68)
    pdf.cell(0, 12, 'University of Wisconsin - Parkside', new_x="LMARGIN", new_y="NEXT")

    print(f'Pages: {pdf.page_no()}')
    pdf.output('/Users/joshualaviolette/Downloads/JOSHUA_LAVIOLETTE_resume.pdf')
    print('PDF generated: ~/Downloads/JOSHUA_LAVIOLETTE_resume.pdf')


if __name__ == '__main__':
    build()
