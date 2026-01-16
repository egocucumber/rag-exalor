import os
from typing import TypedDict, List
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, END
from .database import get_vectorstore

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

class GraphState(TypedDict):
    question: str
    generation: str
    documents: List[str] 

def retrieve(state):
    """Ищет документы в базе"""
    print("--- RETRIEVE ---")
    vectorstore = get_vectorstore()
    retriever = vectorstore.as_retriever(
    search_type="mmr", 
    search_kwargs={"k": 5, "fetch_k": 20}
    )
    docs = retriever.invoke(state["question"])
    return {"documents": docs, "question": state["question"]}

def generate(state):
    """Генерирует ответ по документам"""
    print("--- GENERATE ---")
    question = state["question"]
    docs = state["documents"]
    
    print(f"🔍 Найдено документов: {len(docs)}")
    for i, doc in enumerate(docs):
        print(f"📄 Doc {i+1}: {doc.page_content[:150]}...\n")    
    context = "\n\n".join([doc.page_content for doc in docs])
    
    prompt = f"""
    Ты помощник по документации. Используй ТОЛЬКО следующий контекст для ответа на вопрос.
    Если в контексте нет ответа, скажи "Я не нашел информации в документах".
    
    КОНТЕКСТ:
    {context}
    
    ВОПРОС: {question}
    """
    
    msg = [HumanMessage(content=prompt)]
    response = llm.invoke(msg)
    return {"generation": response.content}

def create_rag_graph():
    workflow = StateGraph(GraphState)
    
    workflow.add_node("retrieve", retrieve)
    workflow.add_node("generate", generate)
    
    workflow.set_entry_point("retrieve")
    workflow.add_edge("retrieve", "generate")
    workflow.add_edge("generate", END)
    
    return workflow.compile()