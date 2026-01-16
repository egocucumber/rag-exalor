# ExaLore: Intelligent RAG Knowledge Vault

![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-RAG%20Agent-orange)
![Llama 3](https://img.shields.io/badge/Model-Llama--3.3--70b-purple)
![ChromaDB](https://img.shields.io/badge/VectorDB-Chroma-green)

**ExaLore** — это система управления знаниями, основанная на технологии **RAG (Retrieval-Augmented Generation)**.

Приложение позволяет загружать PDF-документы (отчеты, контракты, инструкции), превращать их в векторные представления и вести диалог с содержимым документов на естественном языке. Система использует **Corrective RAG** паттерны для минимизации галлюцинаций.
---
## Ключевые возможности

*   **Умный поиск (Semantic Search):** Использует гибридный поиск (MMR) для нахождения наиболее релевантных фрагментов текста, а не просто совпадений по ключевым словам.
*   **Молниеносный инференс:** Интеграция с **Groq API** (Llama 3.3) обеспечивает генерацию ответов за доли секунды.
*   **Локальная векторизация:** Эмбеддинги создаются локально (`HuggingFace/all-MiniLM-L6-v2`) и хранятся в **ChromaDB**, что обеспечивает приватность данных.
*   **Современный UX/UI:**
    *   Полная поддержка **Dark/Light** тем.
    *   Локализация интерфейса (**Русский / English**).
    *   Рендеринг ответов в **Markdown** (таблицы, списки, код).
    *   Анимации на базе **Framer Motion**.
*   **Docker-Ready:** Полная изоляция окружения. Frontend (Nginx) + Backend (Uvicorn) + VectorDB поднимаются одной командой.

## Технологический стек

### Architecture
Приложение построено на микросервисной архитектуре с использованием Docker Compose.

```mermaid
graph LR
    User[Пользователь] -->|HTTP| Nginx[Frontend (Nginx)]
    Nginx -->|API Request| API[Backend (FastAPI)]
    API -->|Ingest PDF| Ingest[PDF Processor]
    Ingest -->|Embeddings| Chroma[(ChromaDB)]
    API -->|RAG Query| LangGraph[LangGraph Agent]
    LangGraph -->|Retrieve| Chroma
    LangGraph -->|Generate| Groq[Groq API (Llama 3)]
```

### Frontend
*   **React** + **Vite**
*   **Tailwind CSS** (Styling & Dark Mode)
*   **Framer Motion** (Animations)
*   **Axios** (API Communication)
*   **Lucide React** (Iconography)

### Backend
*   **FastAPI** (High-performance Async API)
*   **LangGraph** (Stateful Multi-Agent Orchestration)
*   **LangChain** (RAG Framework)
*   **ChromaDB** (Vector Store)

---

## Установка и запуск

### Предварительные требования
1.  Установленный **Docker** и **Docker Compose**.
2.  API ключ от **[Groq](https://console.groq.com)** (Бесплатно).

### Быстрый старт (Docker)

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/egocucumber/rag-exalor.git
    cd rag-exalore
    ```

2.  **Настройте переменные окружения:**
    Создайте файл `backend/.env` и вставьте ваш API ключ:
    ```bash
    echo "GROQ_API_KEY=gsk_....." > backend/.env
    ```

3.  **Запустите приложение:**
    ```bash
    docker-compose up --build
    ```

4.  **Готово!**
    *   **Frontend:** Откройте [http://localhost:3000](http://localhost:3000)
    *   **API Swagger:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Как использовать

1.  **Загрузка данных:**
    *   В левой панели нажмите "Загрузить PDF" (или перетащите файл).
    *   Дождитесь галочки. Система разбила документ на чанки и векторизовала их.
2.  **Диалог:**
    *   Введите вопрос в чат (например: *"Какие условия гарантии описаны в документе?"*).
    *   ExaLore найдет релевантные части документа и сгенерирует точный ответ.
3.  **Настройки:**
    *   Используйте иконки в шапке сайдбара для переключения темы или языка.

---
