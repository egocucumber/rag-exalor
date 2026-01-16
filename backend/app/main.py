from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .ingest import ingest_document
from .rag_graph import create_rag_graph

app = FastAPI(title="ExaLore API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Эндпоинт для загрузки PDF"""
    return await ingest_document(file)

@app.post("/chat")
async def chat(request: ChatRequest):
    """Эндпоинт для вопроса к базе знаний"""
    graph = create_rag_graph()
    result = graph.invoke({"question": request.question})
    return {"answer": result["generation"]}