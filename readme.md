# 🤖 Autonomous AI Agent

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-REST%20API-green)
![Gemini](https://img.shields.io/badge/LLM-Gemini-orange)
![Groq](https://img.shields.io/badge/Fallback-Groq-red)
![Pydantic](https://img.shields.io/badge/Pydantic-v2-success)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

An autonomous multi-step AI agent built with **Python** and **FastAPI** that understands a user's natural language request, creates its own execution plan, generates a structured business document, reviews its own output, and exports the final result as **DOCX**, **PDF**, **TXT**, and **Markdown**.

---

# 🚀 Project Overview

This project demonstrates an autonomous AI workflow where multiple specialized agents collaborate to solve a user's request.

Instead of directly generating a document, the system performs several reasoning stages:

1. Analyze the request
2. Build an execution plan
3. Generate the document
4. Review its own work
5. Improve the document if necessary
6. Export the final document into multiple formats

The project exposes everything through a **FastAPI REST API**.

---

# ✨ Features

- ✅ Autonomous AI Workflow
- ✅ Multi-Agent Architecture
- ✅ Natural Language Understanding
- ✅ Automatic Task Planning
- ✅ Business Document Generation
- ✅ Reflection / Self Review
- ✅ Gemini + Groq Fallback
- ✅ Retry Logic with Exponential Backoff
- ✅ FastAPI REST API
- ✅ Swagger Documentation
- ✅ Request Validation using Pydantic
- ✅ DOCX Export
- ✅ PDF Export
- ✅ TXT Export
- ✅ Markdown Export
- ✅ Structured JSON Models

---

# 🏗 Architecture

```
                User Request
                      │
                      ▼
               FastAPI Endpoint
                      │
                      ▼
              ┌────────────────┐
              │   Orchestrator │
              └────────────────┘
                      │
      ┌───────────────┼───────────────┐
      ▼               ▼               ▼
  Analyzer        Planner         Executor
      │               │               │
      └───────────────┼───────────────┘
                      ▼
               Reflection Agent
                      │
                      ▼
              Document Generator
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
      DOCX           PDF           TXT
                      │
                      ▼
                 API Response
```

---

# 🔄 Agent Workflow

### 1️⃣ Analyzer

The Analyzer receives the natural language request and extracts structured information.

Output:

- Document Type
- Goal
- Provided Information
- Missing Information
- Business Assumptions

---

### 2️⃣ Planner

The Planner converts the analysis into an autonomous execution plan.

Example:

```
1. Define project scope
2. Identify stakeholders
3. Estimate budget
4. Perform risk analysis
5. Create timeline
...
```

---

### 3️⃣ Executor

The Executor follows the generated plan and creates the complete business document using the LLM.

---

### 4️⃣ Reflection Agent

The Reflection Agent reviews the generated document and checks:

- Completeness
- Grammar
- Professional tone
- Consistency
- Missing sections
- Readability

If improvements are required, it rewrites the document before final delivery.

---

# 📂 Project Structure

```
autonomous-ai-agent/
│
├── app/
│   ├── agents/
│   ├── models/
│   ├── prompts/
│   ├── routes/
│   ├── tools/
│   ├── utils/
│   ├── generated_docs/
│   ├── api.py
│   ├── config.py
│   └── main.py
│
├── docs/
│   └── generated/
│
├── tests/
│
├── requirements.txt
├── README.md
└── .env
```

---

# ⚙ Technologies Used

- Python 3.13
- FastAPI
- Gemini API
- Groq API
- Pydantic
- ReportLab
- python-docx
- Uvicorn

---

# 📦 Installation

Clone the repository

```bash
git clone <repository_url>
```

Create virtual environment

```bash
python -m venv venv
```

Activate

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Create a `.env` file.

```
GEMINI_API_KEY=your_key

GROQ_API_KEY=your_key

GEMINI_MODEL=gemini-2.5-flash

GROQ_MODEL=llama-3.3-70b-versatile
```

---

# ▶ Running the API

```bash
uvicorn app.main:app --reload
```

Swagger UI

```
http://127.0.0.1:8000/docs
```

---

# 📌 API Endpoint

```
POST /agent
```

Example Request

```json
{
    "request":"Create a business proposal for launching an AI healthcare startup."
}
```

---

# ✅ Example Response

```json
{
    "status":"Success",
    "document_type":"Business Proposal",
    "execution_time":"34.21 sec",
    "generated_files":{
        "docx":"docs/generated/....docx",
        "pdf":"docs/generated/....pdf",
        "txt":"docs/generated/....txt",
        "md":"docs/generated/....md"
    }
}
```

---

# 📄 Generated Documents

The system automatically exports

- DOCX
- PDF
- TXT
- Markdown

Each execution generates timestamped files.

Example

```
docs/generated/

execution_report_20260712_031851.docx

execution_report_20260712_031851.pdf

execution_report_20260712_031851.txt

execution_report_20260712_031851.md
```

---

# 🧠 Engineering Improvements

This project implements multiple engineering improvements.

## ✅ Multi-Step Planning

The AI first creates its own execution plan before generating the document.

---

## ✅ Reflection / Self Review

The generated document is reviewed by another AI step.

If improvements are needed, the document is rewritten.

---

## ✅ Retry Logic

Gemini requests automatically retry up to three times using exponential backoff.

```
Attempt 1

↓

Attempt 2

↓

Attempt 3
```

---

## ✅ Fallback Logic

If Gemini is unavailable or exceeds quota,

the router automatically switches to Groq.

```
Gemini

↓

Failure

↓

Groq

↓

Success
```

---

## ✅ Request Validation

Pydantic validates incoming requests before execution.

---

# 🧪 Test Cases

## Standard Request

```
Create a business proposal for launching an AI healthcare startup.
```

---

## Complex Request

```
Prepare a complete project plan for migrating a medium-sized e-commerce company to AWS.

The company has around 250 employees.

Budget has not been finalized.

The migration deadline is flexible.

Some business requirements are missing.

Make reasonable assumptions wherever necessary.

Include a risk assessment, migration timeline, estimated costs, responsibilities, and recommendations.
```

---

# 📈 Future Improvements

- Conversation Memory
- RAG Integration
- Tool Calling
- Multi-Agent Parallel Execution
- Vector Database
- Authentication
- Docker Deployment
- CI/CD Pipeline
- Streaming Responses
- Multi-language Support

---

# 🎯 Assignment Requirements Coverage

| Requirement | Status |
|------------|--------|
| Autonomous Agent | ✅ |
| FastAPI | ✅ |
| Multi-step Planning | ✅ |
| Reflection | ✅ |
| Retry Logic | ✅ |
| Fallback Logic | ✅ |
| Word Document Generation | ✅ |
| REST API | ✅ |
| Request Validation | ✅ |
| Two Test Cases | ✅ |

---

# 👨‍💻 Author

**Himanshu**

B.Tech Artificial Intelligence & Machine Learning

Python • Machine Learning • FastAPI • Autonomous AI Agents

---

## ⭐ If you found this project useful, consider giving it a star.