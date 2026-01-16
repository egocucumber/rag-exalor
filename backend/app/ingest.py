import shutil
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .database import get_vectorstore

UPLOAD_DIR = "/app/documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def ingest_document(file):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=1000, chunk_overlap=200
    )
    doc_splits = text_splitter.split_documents(docs)
    
    vectorstore = get_vectorstore()
    vectorstore.add_documents(doc_splits)
    
    return {"status": "success", "chunks": len(doc_splits)}