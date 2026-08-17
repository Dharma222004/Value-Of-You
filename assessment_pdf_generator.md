# Assessment PDF Report Generator

## METADATA
```
version: 1.0
purpose: Generate structured assessment PDF reports via Claude API + ReportLab
input: JSON (candidate scores from website)
output: PDF file (structured, styled, readable)
model: claude-sonnet-4-6
pdf_lib: reportlab
```

---

## 1. PDF_STRUCTURE

### PAGE_1: HEADER + SCORE_GRID
```
HEADER:
  - candidate_name     → large bold, left
  - test_id            → inline with phone, email (small, teal)
  - test_date          → below contact row

SCORE_GRID:
  - layout: 2-column grid
  - each_card:
      top:    section_label (small, gray)
      center: score (large, bold, color-coded)
      bottom: "/ 100" (small)
      right:  color_dot (green | yellow | red)
  - below_card: subsection scores as labeled progress bars (3 per row)
```

### PAGE_2: SECTION_DETAIL_BLOCKS
```
SECTION_BLOCK (repeat per test):
  - header_row:
      left:  section_label (bold, white text on teal bg)
      right: score_badge (white text, same teal bg)
  - subsection_row (3 columns):
      each: label + horizontal_bar + score/100
  - cefr_badge: shown only for english / email_writing sections
  - personality: percentile bars + radar chart (if applicable)
```

### PAGE_3+: INSIGHTS
```
INSIGHT_CARD (repeat per test):
  - section_header (reuse SECTION_BLOCK header)
  - what_it_measures: 1 sentence plain English
  - performance_summary: 2–3 sentences (tone based on score)
  - suggestions_to_improve: 2–4 bullets (actionable, specific)
```

### PAGE_OPTIONAL: RESPONSES
```
RESPONSE_CARD:
  - question_box: gray background
  - candidate_response: bordered box, Courier New font
  - error_summary_table:
      columns: error_type | count
      types: Grammar | Spelling | Style | Etiquette | Typographical
  - code_analysis (if coding question):
      time_complexity | test_case_pass_pct | compilation_status
```

### PAGE_LAST: LEARNING_RESOURCES
```
RESOURCES:
  - grouped by section_label
  - each_item: resource_title + type (Tutorial | Video | Web | Book)
```

---

## 2. COLOR_SYSTEM

| token           | hex       | usage                                      |
|-----------------|-----------|---------------------------------------------|
| COLOR_TEAL      | #003d4d   | header bg, section title bars, accents      |
| COLOR_GREEN     | #2e7d32   | score ≥ 70 (high)                          |
| COLOR_YELLOW    | #e65100   | score 30–69 (mid)                           |
| COLOR_RED       | #c62828   | score < 30 (low)                            |
| COLOR_DARK      | #1a1a2e   | all body text                               |
| COLOR_GRAY      | #f5f5f5   | card background                             |
| COLOR_LGRAY     | #e0e0e0   | dividers, borders                           |
| COLOR_WHITE     | #ffffff   | page background, text on teal headers       |
| COLOR_SUB       | #555555   | sub-labels, captions                        |

### SCORE_COLOR_RULE
```python
def score_color(s):
    return COLOR_GREEN if s >= 70 else COLOR_YELLOW if s >= 30 else COLOR_RED
```

### TYPOGRAPHY
```
font_title:  Helvetica-Bold, 22pt → candidate name, section headers
font_body:   Helvetica, 9pt      → paragraphs, descriptions
font_small:  Helvetica, 8pt      → labels, captions, dates
font_score:  Helvetica-Bold, 20pt → large score display
font_code:   Courier New, 8.5pt  → code blocks, email responses
```

### LAYOUT
```
page_size:    A4
margins:      15mm all sides
card_border:  0.5pt, COLOR_LGRAY
card_bg:      COLOR_GRAY (#f5f5f5)
bar_height:   6px
bar_radius:   2px
```

---

## 3. SYSTEM_PROMPT

> Paste this exactly as the `system` parameter in your Claude API call.
> User message = raw JSON of candidate data.

```
You are an assessment report generator.

Receive a JSON object with candidate info and test scores.
Return ONLY valid JSON — no markdown, no explanation, no code fences.

OUTPUT SCHEMA:
{
  "candidate": {
    "name": string,
    "test_id": string,
    "phone": string,
    "email": string,
    "test_date": string
  },
  "sections": [
    {
      "id": string,
      "label": string,
      "score": number,
      "cefr": string | null,
      "subsections": [
        { "label": string, "score": number }
      ],
      "what_it_measures": string,
      "performance_summary": string,
      "suggestions": [string],
      "resources": [
        { "title": string, "type": "Tutorial|Video|Web|Book" }
      ]
    }
  ],
  "personality": {
    "traits": [
      {
        "label": string,
        "score": number,
        "low_label": string,
        "high_label": string,
        "bullets": [string]
      }
    ]
  },
  "responses": [
    {
      "section_id": string,
      "question": string,
      "candidate_response": string,
      "errors": { "Grammar": number, "Spelling": number, "Style": number }
    }
  ]
}

RULES:
- what_it_measures: exactly 1 sentence, plain English, no jargon
- performance_summary: 2–3 sentences
    score >= 70 → positive, commendable tone
    score 30–69 → neutral, constructive tone
    score < 30  → encouraging, improvement-focused tone
- suggestions: 2–4 items, each a single actionable sentence
- personality bullets: 3–4 factual trait descriptions, no "you should"
- cefr: include only for english and email_writing sections, else null
- if a field is missing from input: use null — NEVER invent scores
- resources: 2–3 per section, real titles only, relevant to the section
```

---

## 4. INPUT_SCHEMA

> Send this as the user message to Claude (replace placeholder values).

```json
{
  "candidate": {
    "name": "{{CANDIDATE_NAME}}",
    "test_id": "{{TEST_ID}}",
    "phone": "{{PHONE}}",
    "email": "{{EMAIL}}",
    "test_date": "{{DATE}}"
  },
  "scores": {
    "computer_science": {
      "total": 0,
      "subsections": {
        "OS and Computer Architecture": 0,
        "DBMS": 0,
        "Computer Networks": 0
      }
    },
    "logical_ability": {
      "total": 0,
      "subsections": {
        "Inductive Reasoning": 0,
        "Deductive Reasoning": 0,
        "Abductive Reasoning": 0
      }
    },
    "computer_programming": {
      "total": 0,
      "subsections": {
        "Basic Programming": 0,
        "Data Structures": 0,
        "OOP and Complexity Theory": 0
      }
    },
    "quantitative_ability": {
      "total": 0,
      "subsections": {
        "Basic Mathematics": 0,
        "Advanced Mathematics": 0,
        "Applied Mathematics": 0
      }
    },
    "english_comprehension": {
      "total": 0,
      "cefr": "B2",
      "subsections": {
        "Grammar": 0,
        "Vocabulary": 0,
        "Comprehension": 0
      }
    },
    "machine_learning": {
      "total": 0,
      "subsections": {
        "Data Analysis and Statistics": 0,
        "Predictive Modelling": 0,
        "Advanced Machine Learning": 0
      }
    },
    "email_writing": {
      "total": 0,
      "cefr": "B2",
      "subsections": {
        "Etiquette": 0,
        "Content": 0,
        "Grammar": 0
      }
    },
    "automata": {
      "total": 0,
      "subsections": {
        "Programming Ability": 0,
        "Programming Practices": 0,
        "Functional Correctness": 0
      }
    },
    "automata_fix": {
      "total": 0,
      "subsections": {
        "Code Reuse": 0,
        "Logical Error": 0,
        "Syntactical Error": 0
      }
    }
  },
  "personality": {
    "Extraversion":         { "score": 0, "low": "Reserved",     "high": "Sociable"     },
    "Conscientiousness":    { "score": 0, "low": "Spontaneous",  "high": "Diligent"     },
    "Agreeableness":        { "score": 0, "low": "Competitive",  "high": "Cooperative"  },
    "Openness to Experience":{ "score": 0,"low": "Conventional", "high": "Inquisitive"  },
    "Emotional Stability":  { "score": 0, "low": "Sensitive",    "high": "Resilient"    },
    "Polychronicity":       { "score": 0, "low": "Focused",      "high": "Multitasking" }
  },
  "responses": [
    {
      "section": "email_writing",
      "question": "{{EMAIL_QUESTION_TEXT}}",
      "response": "{{CANDIDATE_EMAIL_TEXT}}"
    }
  ]
}
```

---

## 5. PYTHON_CODE

### report_generator.py

```python
# pip install reportlab anthropic
import json
import anthropic
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer,
    Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

# ── Colors ────────────────────────────────────────────────────────────
C_TEAL   = colors.HexColor("#003d4d")
C_GREEN  = colors.HexColor("#2e7d32")
C_YELLOW = colors.HexColor("#e65100")
C_RED    = colors.HexColor("#c62828")
C_DARK   = colors.HexColor("#1a1a2e")
C_GRAY   = colors.HexColor("#f5f5f5")
C_LGRAY  = colors.HexColor("#e0e0e0")
C_WHITE  = colors.white

def score_color(s):
    return C_GREEN if s >= 70 else C_YELLOW if s >= 30 else C_RED

# ── Styles ────────────────────────────────────────────────────────────
def make_styles():
    defs = {
        "title":    ("Helvetica-Bold", 22, C_DARK,  TA_LEFT,  2, 4),
        "heading":  ("Helvetica-Bold", 13, C_TEAL,  TA_LEFT,  8, 3),
        "body":     ("Helvetica",       9, C_DARK,  TA_LEFT,  2, 2),
        "small":    ("Helvetica",       8, colors.HexColor("#555555"), TA_LEFT, 1, 1),
        "score_lg": ("Helvetica-Bold", 20, C_DARK,  TA_CENTER,2, 2),
        "score_sm": ("Helvetica-Bold",  9, C_DARK,  TA_LEFT,  1, 1),
        "label":    ("Helvetica-Bold",  8, colors.HexColor("#555555"), TA_LEFT, 1, 1),
        "bullet":   ("Helvetica",       9, C_DARK,  TA_LEFT,  2, 2),
        "white_hd": ("Helvetica-Bold", 11, C_WHITE, TA_LEFT,  3, 3),
    }
    return {
        name: ParagraphStyle(
            name,
            fontName=font, fontSize=size, textColor=color,
            alignment=align, spaceBefore=sb, spaceAfter=sa
        )
        for name, (font, size, color, align, sb, sa) in defs.items()
    }

S = make_styles()

# ── Helpers ───────────────────────────────────────────────────────────
def spacer(h=4):
    return Spacer(1, h * mm)

def hr_line():
    return HRFlowable(width="100%", thickness=0.5,
                      color=C_LGRAY, spaceAfter=3, spaceBefore=3)

def score_bar(score, width=120, height=6):
    pct   = max(0, min(100, score)) / 100
    col   = score_color(score)
    fill  = max(1, int(width * pct))
    empty = width - fill
    t = Table([["", ""]], colWidths=[fill * mm / 5, empty * mm / 5],
              rowHeights=[height])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (0, 0), col),
        ("BACKGROUND",    (1, 0), (1, 0), C_LGRAY),
        ("LEFTPADDING",   (0, 0), (-1, -1), 0),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 0),
        ("TOPPADDING",    (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return t

# ── BLOCK: Header ─────────────────────────────────────────────────────
def build_header(candidate):
    name = candidate.get("name", "")
    info = (f'Test ID: {candidate.get("test_id","")}  ·  '
            f'{candidate.get("phone","")}  ·  {candidate.get("email","")}')
    date = f'Test Date: {candidate.get("test_date","")}'
    t = Table(
        [[Paragraph(name, S["title"])],
         [Paragraph(info, S["small"])],
         [Paragraph(date, S["small"])]],
        colWidths=[180 * mm]
    )
    t.setStyle(TableStyle([
        ("BOX",           (0, 0), (-1, -1), 0.5, C_LGRAY),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
        ("TOPPADDING",    (0, 0), (0,  0),  8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return [t, spacer(4)]

# ── BLOCK: Score Grid ─────────────────────────────────────────────────
def build_score_grid(sections):
    cards = []
    for sec in sections:
        score = sec["score"]
        col   = score_color(score)
        card  = Table(
            [[Paragraph(sec["label"], S["label"])],
             [Paragraph(str(score),   S["score_lg"])],
             [Paragraph("/ 100",      S["small"])]],
            colWidths=[85 * mm],
            rowHeights=[6 * mm, 10 * mm, 5 * mm]
        )
        card.setStyle(TableStyle([
            ("BACKGROUND",  (0, 0), (-1, -1), C_GRAY),
            ("BOX",         (0, 0), (-1, -1), 0.5, C_LGRAY),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("TEXTCOLOR",   (0, 1), (0,  1),  col),
        ]))
        cards.append(card)

    rows = []
    for i in range(0, len(cards), 2):
        pair = cards[i:i+2]
        if len(pair) == 1:
            pair.append(Spacer(85 * mm, 1))
        row = Table([pair], colWidths=[88 * mm, 88 * mm])
        row.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
        rows.extend([row, spacer(2)])
    return rows

# ── BLOCK: Section Detail ─────────────────────────────────────────────
def build_section_detail(sec):
    score = sec["score"]
    hdr = Table(
        [[Paragraph(sec["label"],        S["white_hd"]),
          Paragraph(f'{score} / 100',    S["white_hd"])]],
        colWidths=[150 * mm, 30 * mm]
    )
    hdr.setStyle(TableStyle([
        ("BACKGROUND",  (0, 0), (-1, -1), C_TEAL),
        ("LEFTPADDING", (0, 0), (0,  -1), 6),
        ("RIGHTPADDING",(1, 0), (1,  -1), 6),
        ("ALIGN",       (1, 0), (1,  -1), "RIGHT"),
    ]))

    subs = sec.get("subsections", [])
    sub_rows = []
    for i in range(0, len(subs), 3):
        chunk = subs[i:i+3]
        while len(chunk) < 3:
            chunk.append({"label": "", "score": 0})
        cells = []
        for sub in chunk:
            if not sub["label"]:
                cells.append("")
                continue
            cell = Table(
                [[Paragraph(sub["label"], S["label"])],
                 [score_bar(sub["score"])],
                 [Paragraph(f'{sub["score"]} / 100', S["score_sm"])]],
                colWidths=[58 * mm]
            )
            cell.setStyle(TableStyle([
                ("LEFTPADDING",   (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]))
            cells.append(cell)
        sub_rows.append(cells)

    sub_table = Table(sub_rows, colWidths=[60 * mm, 60 * mm, 60 * mm])
    sub_table.setStyle(TableStyle([
        ("BOX",    (0, 0), (-1, -1), 0.5, C_LGRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return KeepTogether([hdr, sub_table, spacer(3)])

# ── BLOCK: Insight Card ───────────────────────────────────────────────
def build_insight(sec):
    items = [
        build_section_detail(sec),
        spacer(2),
        Paragraph(sec.get("what_it_measures", ""),   S["small"]),
        spacer(1),
        Paragraph(sec.get("performance_summary", ""), S["body"]),
        spacer(2),
    ]
    for tip in sec.get("suggestions", []):
        items.append(Paragraph(f"• {tip}", S["bullet"]))
    items.append(spacer(4))
    return KeepTogether(items)

# ── BLOCK: Personality ────────────────────────────────────────────────
def build_personality(personality):
    hdr = Table(
        [[Paragraph("Personality", S["white_hd"])]],
        colWidths=[180 * mm]
    )
    hdr.setStyle(TableStyle([
        ("BACKGROUND",  (0, 0), (-1, -1), C_TEAL),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ]))
    blocks = [hdr, spacer(3)]

    for trait in personality.get("traits", []):
        score = trait["score"]
        row = Table(
            [[Paragraph(trait["label"], S["heading"]),
              Paragraph(f'Percentile: {score}', S["small"])]],
            colWidths=[140 * mm, 40 * mm]
        )
        row.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
        bar_row = Table(
            [[Paragraph(trait.get("low_label",  ""), S["small"]),
              score_bar(score, width=140, height=8),
              Paragraph(trait.get("high_label", ""), S["small"])]],
            colWidths=[25 * mm, 130 * mm, 25 * mm]
        )
        blocks.extend([row, bar_row])
        for b in trait.get("bullets", []):
            blocks.append(Paragraph(f"• {b}", S["bullet"]))
        blocks.append(hr_line())
    return blocks

# ── BLOCK: Responses ──────────────────────────────────────────────────
def build_responses(responses):
    blocks = []
    for resp in responses:
        hdr = Paragraph(
            f'Response — {resp.get("section_id", "")}', S["heading"]
        )
        q   = Paragraph(resp.get("question", ""),           S["small"])
        ans = Paragraph(resp.get("candidate_response", ""), S["body"])
        blocks.extend([hdr, q, spacer(1), ans, spacer(4)])
    return blocks

# ── MAIN PDF BUILDER ──────────────────────────────────────────────────
def build_pdf(report: dict, output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=15*mm, rightMargin=15*mm,
        topMargin=15*mm,  bottomMargin=15*mm
    )
    story = []
    sections = report["sections"]

    story += build_header(report["candidate"])
    story += build_score_grid(sections)
    story.append(spacer(4))

    for sec in sections:
        story.append(build_section_detail(sec))

    if "personality" in report:
        story += build_personality(report["personality"])

    story.append(Paragraph("Insights", S["heading"]))
    story.append(hr_line())
    for sec in sections:
        story.append(build_insight(sec))

    if report.get("responses"):
        story += build_responses(report["responses"])

    doc.build(story)
    print(f"PDF saved → {output_path}")

# ── CLAUDE API CALL ───────────────────────────────────────────────────
SYSTEM_PROMPT = """
You are an assessment report generator.
Receive a JSON object with candidate info and test scores.
Return ONLY valid JSON — no markdown, no explanation, no code fences.
[paste full prompt from section 3 here]
"""

def generate_report(user_data: dict) -> dict:
    client = anthropic.Anthropic()          # reads ANTHROPIC_API_KEY env var
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": json.dumps(user_data)}]
    )
    return json.loads(resp.content[0].text.strip())

# ── ENTRY POINT ───────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    input_file  = sys.argv[1] if len(sys.argv) > 1 else "input.json"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "report.pdf"

    with open(input_file) as f:
        user_data = json.load(f)

    report = generate_report(user_data)
    build_pdf(report, output_file)
```

---

## 6. BACKEND_INTEGRATION

### FastAPI endpoint
```python
from fastapi import FastAPI
from fastapi.responses import FileResponse
import tempfile

app = FastAPI()

@app.post("/download-report")
async def download_report(user_data: dict):
    report      = generate_report(user_data)
    tmp         = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
    build_pdf(report, tmp.name)
    return FileResponse(
        tmp.name,
        media_type="application/pdf",
        filename=f'report_{user_data["candidate"]["name"]}.pdf'
    )
```

### Frontend (React)
```js
const downloadReport = async (assessmentData) => {
  const res  = await fetch("/download-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assessmentData)
  });
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "assessment_report.pdf";
  a.click();
  URL.revokeObjectURL(url);
};
```

---

## 7. RULES_AND_NOTES
```
ANTHROPIC_API_KEY → set as env variable on server, never expose to frontend
tokens_per_report → ~800–1200 (low cost)
caching           → cache PDF by test_id to avoid repeated Claude calls
pdf_library       → replace build_pdf() for any other lib; keep Claude call as-is
install           → pip install reportlab anthropic
run               → python report_generator.py input.json report.pdf
```
