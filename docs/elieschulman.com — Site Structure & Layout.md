# elieschulman.com — Revised Site Structure & Layout

*Designed around the Mirror Principle relational taxonomy + Maimonides Library*

---

## Top Navigation

Five items — clean and simple:

| Label | Route | Purpose |
|---|---|---|
| **Home** | `/` | Hero + featured works + taxonomy preview |
| **Writing Map** | `/writing/` | Relational taxonomy overview — the map of the body of work |
| **Maimonides** | `/maimonides/` | First-class library: 3 books + 22 ebook volumes + essays |
| **About** | `/about/` | Author bio (from approved False Dichotomies bio) |
| **Subscribe** | `/contact/` or footer | Email + Substack link |

The relational taxonomy lives inside **Writing Map**, not in the top nav. This keeps the global navigation clean while making the taxonomy the organizing principle of the writing.

---

## Sitemap

```
elieschulman.com/
│
├── /  (Home)
│     Hero · Featured books · Taxonomy preview · Substack CTA
│
├── /writing/  (Writing Map — the taxonomy)
│     │
│     ├── /writing/self/  (Person with Self)
│     │     Intelligence, consciousness, language, silent sitting, inner life
│     │
│     ├── /writing/marriage/  (Husband and Wife)
│     │     Ezer Knegdo, marriage as mirror, money/conflict essays
│     │
│     ├── /writing/family/  (Parent and Child)
│     │     Biography, family history, generational material
│     │
│     ├── /writing/teaching/  (Teacher and Student)
│     │     Source sheets, T-groups, Pirkei Avot, learning architecture
│     │
│     └── /writing/community/  (Jew and Jew · Jew and Non-Jew)
│           18Forty, Bashevkin, translation as bridge, communal essays
│
├── /writing/paths/  (Curated Reading Paths)
│     Cross-cutting through-lines as themed reading journeys
│
├── /maimonides/  (Maimonides Library)
│     │
│     ├── /maimonides/books/
│     │     Emes · Everything Changes · Davar
│     │
│     ├── /maimonides/foundations/
│     │     22 completed ebook volumes (Yesodei HaTorah 1:1–1:12 + 2:1–2:10)
│     │
│     ├── /maimonides/mada/
│     │     Mada Series — Ibn Tibbon reframings of Yesodei HaTorah
│     │
│     └── /maimonides/essays/
│         Standalone Rambam essays, source sheets, apparatus
│
├── /about/  (Author bio)
│
└── /contact/  (Email + Substack)
```

---

## The Narrative Arc

The taxonomy moves from self outward:

**Self → Marriage → Family → Teaching → Community**

This is not arbitrary. It mirrors how the work itself moves — from the inner life of a person, through their most intimate relationships, into the generational chain, then into learning and teaching, and finally into the communal and universal. The Writing Map page makes this arc visible as the structure of the work.

---

## Page Layouts

### Home (`/`)

```
┌─────────────────────────────────────────────────┐
│  NAV: Home · Writing Map · Maimonides · About · Subscribe  │
├─────────────────────────────────────────────────┤
│                                                 │
│  [HERO — midnight gradient]                     │
│                                                 │
│  eyebrow: Writer · Educator · Translator        │
│  h1: Making the hidden structure of language,  │
│      judgment, and learning visible.            │
│  subtitle: One-sentence framing of the body     │
│           of work as a connected whole.          │
│                                                 │
│  [CTA: Enter the Writing Map →]                 │
│  [secondary: Read Emes Chapter 1 (free PDF)]    │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  FEATURED BOOKS                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ Emes     │ │ Intell.  │ │ Ezer     │         │
│  │ cover    │ │ Is Artif.│ │ Knegdo   │         │
│  │ Free Ch1 │ │ Upcoming │ │ Excerpt  │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  THE WRITING MAP (taxonomy preview)             │
│                                                 │
│  Self → Marriage → Family → Teaching → Community│
│                                                 │
│  Each label is a link to its section.           │
│  One-line description under each.               │
│  Item count badge (e.g., "28 pieces").          │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  MAIMONIDES LIBRARY (preview)                   │
│  "3 published books · 22 ebook volumes"         │
│  [Enter the library →]                          │
│                                                 │
├─────────────────────────────────────────────────┤
│  FOOTER: email · Substack · © 2026              │
└─────────────────────────────────────────────────┘
```

### Writing Map (`/writing/`)

```
┌─────────────────────────────────────────────────┐
│  [page-header — midnight gradient]              │
│                                                 │
│  eyebrow: Writing                               │
│  h1: The Writing Map                            │
│  lede: This body of work moves from the inner   │
│        life of a person, through intimate        │
│        relationships, into teaching and         │
│        community. Each section is a relationship │
│        that the writing examines.               │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  THE ARC (visual sequence)                      │
│                                                 │
│  ┌─────┐    ┌─────────┐    ┌────────┐          │
│  │ Self│ →  │ Marriage│ →  │ Family │  →       │
│  │28   │    │ 11      │    │ 4      │          │
│  └─────┘    └─────────┘    └────────┘          │
│                                                 │
│  ┌──────────┐    ┌──────────┐                  │
│  │ Teaching │ →  │ Community│                  │
│  │ 26       │    │ 13       │                  │
│  └──────────┘    └──────────┘                  │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  READING PATHS (through-lines)                   │
│  [Pain & the Cannon] [Silent Sitting]           │
│  [AI as Catalyst] [Language & Translation]      │
│                                                 │
├─────────────────────────────────────────────────┤
│  FOOTER                                         │
└─────────────────────────────────────────────────┘
```

### Taxonomy Category Page (template for all 5)

Each of the five relational categories uses the same page layout:

```
┌─────────────────────────────────────────────────┐
│  [page-header]                                   │
│                                                 │
│  eyebrow: Writing / [Category]                  │
│  h1: [Category name]                            │
│  lede: [One-paragraph framing of what this      │
│        relationship examines in the writing]     │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  BOOKS & MANUSCRIPTS                            │
│  ┌──────────────────────────────────────┐       │
│  │ [Title]                               │       │
│  │ [Type: book / manuscript] [Status]    │       │
│  │ [Theme tags: T S G A]                 │       │
│  │ [Description]                         │       │
│  │ [Read excerpt →] [Download PDF →]     │       │
│  └──────────────────────────────────────┘       │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ESSAYS                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ [Title]  │ │ [Title]  │ │ [Title]  │         │
│  │ [tags]   │ │ [tags]   │ │ [tags]   │         │
│  │ [desc]   │ │ [desc]   │ │ [desc]   │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  SOURCE SHEETS & TEACHING MATERIALS              │
│  (collapsed/secondary — shown if present)        │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  RELATED READING PATHS                          │
│  [chip] [chip] [chip]                           │
│                                                 │
├─────────────────────────────────────────────────┤
│  FOOTER                                         │
└─────────────────────────────────────────────────┘
```

### Category Content Mapping

#### Self (`/writing/self/`) — 28 items
**Framing:** The inner life — intelligence, consciousness, language, and the practice of sitting before what appears.

**Books:**
- Intelligence Is Artificial (complete review edition — upcoming)
- שעה אחת קודם — The Quiet Before (manuscript)
- combined_grammar_book (verbs, agents, illusion of a doer)

**Essays:**
- Every Reader Is a Translator (+ Substack version)
- Translator's House
- No Such Thing as Emes — for David Bashevkin
- The Egypt Option (parsha essay)
- עיֵף וְיָגֵעַ — The Weariness That Precedes Every Attack
- Post-War Speech v1
- Eyelids Open and Eyelids Closed: The Phenomenology of Seeing and Knowing

**Cross-link:** Emes book → appears in both Self and Maimonides Library

#### Marriage (`/writing/marriage/`) — 11 items
**Framing:** Marriage as mirror — how the closest relationship reveals what a person cannot see alone.

**Books:**
- Ezer Knegdo — A Marriage of Mirrors (Part I: The Attitudes)

**Essays:**
- The Reframe — Couples as Co-Founders
- Dollar Signs as Vocabulary
- The Beta Partnership: Our Story
- Chapter 1: It's 100% Your Responsibility

**Guide:**
- The Partnership Framework: A Facilitation Guide for Couples

#### Family (`/writing/family/`) — 4 items
**Framing:** The generational chain — what passes between parent and child, and what cannot be said directly.

**Pieces:**
- Biographical Interview Responses
- Conversation with Abba, Goldie in the Succah
- Schwartz family research (consolidated)

#### Teaching (`/writing/teaching/`) — 26 items
**Framing:** Learning as relational — the curriculum is the group itself, and the teacher is not separate from what is being taught.

**Source Sheets:**
- Teacher and Student — Mishneh Torah Torah Study 4:2
- Lo Habayashan Lameid
- Pirkei Avot 1:2 — love peace and rodef peace

**Essays:**
- The Human Equation: A Relational Approach to Learning
- The Conditions for Learning — Pirkei Avot Reframe
- A Brief History of T-Groups
- The Power of T-Groups and Experiential Learning

**Cross-link:** T-group and facilitation materials overlap with Cohort Learning Labs

#### Community (`/writing/community/`) — 13 items
**Framing:** The space between Jew and Jew, and between Jew and non-Jew — where shared words do not guarantee shared meaning.

**Essays:**
- No Such Thing as Emes — for David Bashevkin (Jew↔Jew read)
- Every Reader Is a Translator (bridge candidate)
- supplement_L14_kiruv_without_the_sell
- 18Forty AI distribution and growth plan

**Research:**
- Schwartz JewishGen final assessment
- Barranquilla Jewish Community
- Yad Vashem record research

---

### Reading Paths (`/writing/paths/`)

Through-lines become curated reading journeys — not a separate taxonomy, but themed sequences that cut across the relational categories:

| Path | Theme Code | Description | Pieces |
|---|---|---|---|
| **Pain & the Cannon** | T | Moving toward the problem — Rabbi Akiva and beloved suffering | Cannon's Call V1+V2, Beyond Avoidance, Unlikely Path to Freedom |
| **Silent Sitting** | S | The practice of pausing before what appears | The Quiet Before, yisheh ebooks, nonduality tracker, grammar book |
| **AI as Catalyst** | A | AI exposes that thought, word, and productivity are not uniquely human | cognitive_labor_consolidated, Essential Skills, AI & Workflow |
| **Language & Translation** | T, S | How words carry assumptions and how translation reveals them | Every Reader Is a Translator, Phenomenology of Translation, Emes, Davar |

Each path is a single page with a short intro, then a numbered sequence of pieces with brief context for why each follows the next.

---

### Maimonides Library (`/maimonides/`)

A first-class section — too large (108 items) to be buried inside the relational taxonomy.

```
┌─────────────────────────────────────────────────┐
│  [page-header]                                   │
│                                                 │
│  eyebrow: Maimonides Library                    │
│  h1: A writing project organized around         │
│      Rambam's words.                            │
│  lede: Three published books, twenty-two        │
│        ebook volumes, and a series of essays    │
│        examining what translation reveals.      │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  PUBLISHED BOOKS                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ Emes     │ │ Everyth. │ │ Davar    │         │
│  │ Changes  │ │ (in prog)│ │          │         │
│  │ [PDF]    │ │ [PDF]    │ │          │         │
│  │ [EPUB]   │ │ [EPUB]   │ │          │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  FOUNDATIONS EBOOK PROJECT                      │
│  22 completed volumes on Yesodei HaTorah        │
│                                                 │
│  Book 1 — Foundations of the Torah, Ch. 1      │
│  ┌─────────────────────────────────────────┐    │
│  │ 1.1  What Holds Up the World     [PDF]  │    │
│  │ 1.2  If the Foundation Vanished   [PDF]  │    │
│  │ 1.3  The World Could Disappear    [PDF]  │    │
│  │ 1.5  The Power Without End       [PDF]  │    │
│  │ 1.6  What It Means to Know       [PDF]  │    │
│  │ 1.7  One Without Comparison      [PDF]  │    │
│  │ 1.8  No Body, No Shape           [PDF]  │    │
│  │ 1.9  Words That Point Beyond     [PDF]  │    │
│  │ 1.10 How Moses Asked to Know     [PDF]  │    │
│  │ 1.11 Beyond Place and Time       [PDF]  │    │
│  │ 1.12 When Scripture Speaks of    [PDF]  │    │
│  │       God's Emotions                     │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Book 2 — Foundations of the Torah, Ch. 2      │
│  ┌─────────────────────────────────────────┐    │
│  │ 2.1  Love and Awe Are Commanded  [PDF]  │    │
│  │ 2.2  The Path Begins With Wonder [PDF]  │    │
│  │ 2.3  Three Kinds of Created Being [PDF] │    │
│  │ 2.4  Angels Are Not Their Images [PDF]  │    │
│  │ 2.5  Difference Without Bodies   [PDF]  │    │
│  │ 2.6  Above Does Not Mean Higher  [PDF]  │    │
│  │ 2.7  Names of the Angels         [PDF]  │    │
│  │ 2.8  Knowledge Has Levels         [PDF]  │    │
│  │ 2.9  Nothing Is Hidden           [PDF]  │    │
│  │ 2.10 Knowledge Is Not Something  [PDF]  │    │
│  │       God Has                            │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  MADA SERIES                                    │
│  Ibn Tibbon reframings of Yesodei HaTorah       │
│  - Series Introduction: The Carrying-Across     │
│  - Volume 1 (1:1) — Reframings CURATED          │
│  - Volumes 2–5 (1:2–1:5) — in progress         │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  STANDALONE ESSAYS                              │
│  - Until He Knew — Abraham and the Mishneh Torah│
│  - Maimonides on God, Language, Attributes     │
│  - The Two Worlds Within                        │
│  - The Shape That Knows                         │
│  - Dialogue Between Maimonides and the Buddha   │
│  - Dialogue Between an Atheist and Maimonides   │
│  - Thoughts on Maimonides' Philosophy of Lang.  │
│  - Maimonides did not conceive of progress      │
│                                                 │
├─────────────────────────────────────────────────┤
│  FOOTER                                         │
└─────────────────────────────────────────────────┘
```

---

## Theme Tags

Every piece across the site carries one or more theme tags, shown as small colored chips:

| Tag | Code | Color | Meaning |
|---|---|---|---|
| **Torah** | T | gold | Through-line: going toward the problem / cannon |
| **Silent Sitting** | S | deep navy | Vehicle: silent sitting / non-duality |
| **Group** | G | warm ivory border | Vehicle: group method / T-group |
| **AI** | A | muted teal | AI as catalyst |

These are filterable — clicking a tag shows all pieces with that theme across all categories.

---

## Publication Visibility

Not all 227 items should be public. Each piece needs a visibility status:

| Status | What it means | Example |
|---|---|---|
| **Public now** | Ready to show with link/description | Emes Chapter 1, published Foundations volumes |
| **Public with edit** | Needs light editing before public display | Essays from Perplexity sessions |
| **Mention only** | Title + description, no full text | Drafts, in-progress manuscripts |
| **Private** | Not shown on public site | Marriage/family personal material, spine notes, infrastructure |
| **Research only** | Source material, not writing | Soloveitchik corpus, Torah scans, external references |

Priority for public launch: published books, completed Foundations volumes, polished essays, source sheets.

---

## Design System (unchanged)

- **Colors:** Midnight (#0f1b2d), deep navy (#1a2744), warm ivory (#f5f0e8), cream (#faf7f2), gold (#c9a84c)
- **Fonts:** Cormorant Garamond (headings), Inter (body)
- **Layout:** Section-based, max-width 960px content, full-bleed headers
- **Cards:** White background, gold left-border accent, rounded corners
- **Mobile:** Single column, collapsible nav, full-width cards
- **Accessibility:** Skip links, focus styles, reduced motion, semantic HTML
