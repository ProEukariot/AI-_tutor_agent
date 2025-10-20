from multiprocessing import context
from agent.utils.rag.splitters import text_splitter
import dotenv

dotenv.load_dotenv()

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import asyncio
from langchain_core.messages import HumanMessage
from agent.agent import agent
import fitz
from langchain_core.documents import Document
from agent.utils.rag.vector_store import add_documents

app = FastAPI(title="Agent API", description="FastAPI server for the LangGraph agent")


class ChatRequest(BaseModel):
    message: str


@app.post("/{conversion_id}/chat")
async def chat(conversion_id: str, request: ChatRequest):
    """Streaming chat endpoint that returns real-time updates"""
    try:
        inputs = {"messages": [HumanMessage(request.message)]}

        async def generate_stream():
            async for chunk in agent.astream(
                inputs,
                stream_mode="updates",
                context={"conversion_id": conversion_id},
            ):
                for node, values in chunk.items():
                    chunk_data = {
                        "node": node,
                        "content": values["messages"][-1].content,
                        "timestamp": asyncio.get_event_loop().time(),
                    }
                    yield f"data: {json.dumps(chunk_data)}\n\n"

            yield "data: [DONE]\n\n"

        return StreamingResponse(
            generate_stream(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream",
            },
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/{conversion_id}/upload-documents")
async def upload_files(conversion_id: str, files: List[UploadFile]):
    """Endpoint to upload multiple files to vector store"""
    try:
        for file in files:
            pdf_document = fitz.open(stream=file.file.read(), filetype="pdf")

            for page_num in range(pdf_document.page_count):
                page = pdf_document.load_page(page_num)
                text = page.get_text("text")

                chunks = text_splitter.split_text(text)

                add_documents(
                    conversion_id,
                    [
                        Document(
                            chunk, metadata={"source": file.filename, "page": page_num}
                        )
                        for chunk in chunks
                    ],
                )

        return {"files": len(files)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
