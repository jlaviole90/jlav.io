# Eightfold.ai Resume Tailoring Guide

## How Eightfold Match Score Works

Eightfold's Match Score is a supervised ML model (not pure LLM) that scores candidates 0-5 in half-point intervals. Scores >= 4.0 are "high match" and get significantly more visibility to recruiters. The system uses three steps:

### Step 1: Deep Semantic Embeddings
- Every resume and job description is embedded into high-dimensional vector space using pretrained language models
- Captures meaning beyond keywords — "Machine Learning Engineer at fintech" clusters near "Data Scientist at insurance"
- However, **exact phrase matches still score higher** than semantically similar phrases in cosine similarity

### Step 2: Structured Feature Extraction
Four key feature categories:

**Skill Overlap (most important for tailoring)**
- Cosine similarity between job's skill vector and candidate's complete skill vector
- **Recent skill measurement**: Separate score using ONLY skills from most recent experiences
- This means **skills in your current/most recent role are weighted more heavily** than older roles
- Both breadth (ever used the skill) and freshness (using it now) are scored independently

**Title Progression & Seniority Fit**
- Embeds job titles into vectors and computes similarity
- Uses RNNs trained on hundreds of millions of career trajectories to predict your next likely title
- If your trajectory predicts the target title, you score higher even without an exact match
- Example: "Support Engineer" → "QA Engineer" → "Backend Engineer" predicts "Senior Backend Engineer"

**Industry & Company Similarity**
- Employer names are embedded into vectors — "Google" clusters near "Microsoft", far from "KFC"
- Predicts what company you'd likely join next based on career trajectory
- Stronger signal if your past companies are similar to the hiring company

**Ideal Candidate Matching**
- Recruiters can upload "ideal candidate" profiles
- System computes similarity between your profile and those reference profiles
- Can also auto-find ideal candidates from past hiring decisions

### Step 3: Explainable Inference
- Blends hundreds of features into a calibrated prediction
- Trained on tens of millions of historical candidate-position pairs with known outcomes
- Predicts probability of engagement and hiring success
- Scaled to 0-5 star rating displayed to recruiters

## Tailoring Strategy

### Principles
1. **Use exact phrases from the job description** — semantic similarity helps but exact matches score highest in cosine similarity
2. **Concentrate target skills in recent roles** — the recency score is a separate, independent signal
3. **Mention each target skill in 2-3 different contexts** — strengthens the overall skill vector without looking like keyword stuffing
4. **Natural integration only** — Eightfold extracts structured features, so skills buried in awkward phrasing may not be extracted properly
5. **Skills section is prime real estate** — directly extracted and matched against job requirements
6. **Don't remove existing strong skills** — the system scores breadth too, and removing real skills weakens the overall vector

### Where to Place Target Skills (Priority Order)
1. **Skills grid** — Add a new row if needed for hard skills that don't fit existing categories
2. **Most recent role description** (italic summary) — Highest recency weight
3. **Most recent role bullets** — Still high recency
4. **Summary section** — Good for soft skills and general technical terms
5. **Second most recent role** — Reinforces the skill appears across multiple contexts
6. **Older roles** — Only if it makes sense; low recency weight but adds to lifetime skill vector

### Hard Skills Integration Patterns
- "Large scale distributed systems" → Role descriptions ("architected a large scale distributed system"), skills grid
- "Automated testing" → Bullets about quality/reliability ("with automated testing to ensure..."), skills grid as "Automated Testing / CI/CD Pipelines"
- "Cloud computing" → Role descriptions ("cloud computing platform"), summary, skills grid as "Cloud Computing / OO Design"
- "OO design" → Bullets about architecture ("using OO design principles"), summary ("from OO design through deployment"), skills grid
- Technology-specific terms → Weave into role tech stack listings naturally

### Soft Skills Integration Patterns
- "Communication" → Summary ("Strong communicator"), bullets ("Communicated directly with...")
- "Quick learner" / "Learning new technologies" → Summary ("Quick to learn new technologies"), role descriptions ("quickly learned new technologies")
- "Collaboration" → Bullets about cross-team work
- "Leadership" → Already present in title and bullets, reinforce in skills grid

### Line Spacing
- The tailored version uses 11pt line height (vs 12pt on the main resume) to accommodate the extra skills row
- If the tailored version is tight on space, the section divider height (14pt) can be reduced to 13pt
- `pdf.ln(2)` spacing between sections can be reduced to `pdf.ln(1)` if needed

## Process for Each New Application

1. User provides the list of missing skill terms from the Eightfold analysis
2. Read `gen_resume_tailored.py` as the starting point (reset it from `gen_resume.py` if needed)
3. Categorize each term as hard or soft skill
4. Add hard skills to the skills grid (new row or replace least relevant existing entries)
5. Weave each term into at least 2 locations in recent role descriptions and bullets
6. Place soft skills in the summary and role descriptions
7. Generate and verify it fits on one page
8. Output to `~/Downloads/JOSHUA_LAVIOLETTE_resume_tailored.pdf`

## Performance Benchmarks from Eightfold Research
- Match Score ROC AUC: 0.85 (vs 0.77 for general-purpose LLMs)
- High match hires (>= 4.0): 50% more promotions within 2 years
- High match hires: 78% 12-month retention vs 73% for lower scores
- System is trained on tens of millions of candidate-position pairs
- Fairness: minimum race-wise impact ratio of 0.957

## Sources
- https://eightfold.ai/engineering-blog/ai-powered-talent-matching-the-tech-behind-smarter-and-fairer-hiring/
- https://eightfold.ai/engineering-blog/retaining-and-growing-talent-through-skills-based-hiring-insights-from-eightfold-ais-match-score/
