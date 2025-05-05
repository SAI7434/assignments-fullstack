# Intelligent Resume Parser

A full-stack application that extracts structured data from unstructured resumes using an LLM and applies validation to ensure accuracy and consistency.

---

## 🔍 Features

- Paste plain-text resumes and extract structured data
- Extracts:
  - Skills & Proficiency
  - Work Experience (Role, Company, Duration)
  - Education (Degree, Institution, Year)
- Uses OpenRouter LLM API for parsing
- Validation layer for consistency and standardization
- Clean UI for displaying results

---

## 🧠 Parsing Approach & Validation Strategy

### Parsing Strategy

1. User pastes resume text in frontend.
2. Backend sends resume content to OpenRouter API with a structured prompt.
3. LLM returns structured JSON with extracted fields.

### Validation Strategy

- Check for missing fields and add fallback values.
- Normalize degree names (e.g., "B.Tech", "Bachelor of Technology").
- Convert dates into ISO format.
- Catch API and parsing errors gracefully.

---

## 🛠️ Technical Decisions & Tradeoffs

### Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js
- **LLM**: OpenRouter 

### Tradeoffs

- Chose OpenRouter for free-tier LLM access, but requires stable model names.
- Did not include file upload to keep scope within 4–8 hours.
- Simplified education/experience structure for speed, noted future improvements in comments.

---

## 🧪 Edge Case Handling

- Missing fields: Filled with “Not Provided”
- Unexpected LLM responses: Added fallback parsing logic
- Invalid model errors: Caught and alerted user
- Malformed resumes: Basic formatting guidance shown

---

## 🖥️ Setup Instructions

### Prerequisites

- Node.js 
- npm or yarn
- OpenRouter API Key

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/intelligent-resume-parser.git
cd intelligent-resume-parser


