import os
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

PERSIST_DIRECTORY = "/app/chroma_db"

def get_vectorstore():
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    vectorstore = Chroma(
        collection_name="verba_docs",
        embedding_function=embeddings,
        persist_directory=PERSIST_DIRECTORY
    )
    return vectorstore