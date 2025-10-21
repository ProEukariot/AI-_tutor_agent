
## Description of a problem

Students often struggle to find accurate, contextual, and easily understandable explanations tailored to their specific learning needs from vast and fragmented educational resources.

## Why this is a problem

In traditional learning environments, students frequently rely on generic search engines or static educational materials that provide fragmented or overly complex information. These sources rarely adapt to a student’s current level of understanding, prior knowledge, or preferred learning pace, leaving many students frustrated or confused. As a result, valuable time is wasted sifting through irrelevant or inconsistent content rather than focusing on mastering concepts.

For many learners—especially those without direct access to personal tutors—this lack of personalized, on-demand academic support creates significant barriers to effective learning. Students may develop misconceptions, lose confidence, or disengage entirely when they can’t get clear answers quickly. A responsive AI tutor that uses retrieval-augmented generation (RAG) to provide accurate, contextual explanations from trusted educational materials directly addresses this gap by delivering tailored, evidence-based guidance whenever it’s needed.

## Solution 

I am building an AI RAG Tutor Agent that provides students with accurate, personalized academic support by retrieving relevant knowledge from curated learning materials and generating adaptive explanations through interactive dialogue. The system uses multi-agent reasoning to guide, explain, and reflect on student learning in real time.

## Tooling Stack

Frontend – React: Used for building an intuitive, responsive student interface. I chose React for its component-based structure and ease of integration with AI backends via APIs.

Backend – FastAPI: Serves as the core API layer for handling user requests and model responses efficiently. I chose FastAPI because of its high performance, asynchronous capabilities, and easy integration with Python-based AI workflows.

RAG Pipeline – LangGraph: Manages the orchestration of retrieval and generation steps. I chose LangGraph because it simplifies building structured, multi-agent workflows and ensures clear reasoning paths for complex interactions.

Retrieval Tool – Tavily: Handles search and retrieval of relevant educational documents. I selected Tavily for its strong performance in real-time information retrieval and seamless integration with RAG systems.

Evaluation and Monitoring – LangSmith and Ragas: Used to track model quality, reasoning transparency, and retrieval accuracy. I chose these tools to continuously evaluate and improve the system’s reliability and response quality.

## Use of Agents and Agentic Reasoning

The system includes two main agents: a Tutor Agent and a Reflection Agent. The Tutor Agent interacts directly with students by answering questions, explaining concepts, and providing personalized learning support. The Reflection Agent reviews previous interactions and the Tutor Agent’s outputs to identify opportunities for improvement and ensure pedagogical consistency.

Agentic reasoning is applied throughout the system to enable dynamic decision-making—such as determining which tool to use (e.g., whether to retrieve additional context from RAG or Tavily) and when to exit the reasoning pipeline early once a confident, high-quality answer has been reached. This allows the agents to act adaptively, optimizing both accuracy and efficiency in student interactions.

## Data Sources and External APIs

The system uses two main data sources: student-uploaded documents and retrieved web content. Uploaded documents (such as lecture notes, PDFs, or study guides) form the primary knowledge base from which the RAG pipeline retrieves relevant information. In addition, the Tavily Web Search API serves as an external data source for supplementing these materials with up-to-date, trustworthy academic content from the web. This combination ensures that the tutor agent can provide both contextually accurate and current explanations tailored to each student’s query.

## Chunking Strategy

I use a Recursive Character Text Splitter as the default chunking strategy. This approach breaks long documents into manageable text segments while preserving semantic coherence by splitting along logical boundaries (such as paragraphs or sentences) before smaller character limits. I chose this method because it maintains the contextual flow of educational content, which improves retrieval accuracy and helps the RAG model generate more coherent and relevant responses for students.

## Evaluation

For Ragas evaluation result see evaluation.ipynb notebook

## Improvements

My main goal for the second half of the course is to make the AI RAG Tutor Agent more accurate, flexible, and enjoyable to use. Here's how I'll do it: 

- Smarter Search (Hybrid Retrieval): I'll combine the current reranker with semantic search. This will ensure the tutor's answers are not only accurate but also perfectly relevant to the student's needs. 

- Better Agent Teamwork (Multi-Agent System): I'm refining the Tutor and Reflection agents. The Tutor will get better at reasoning—knowing exactly when to look up new information or switch tactics—while the Reflection agent provides much more useful feedback to improve the next response. 

- Advanced Evaluation: I'll integrate more advanced RAGAS metrics and student feedback to systematically track answer quality, how the context is used, and overall student satisfaction. 

- Enhanced User Experience (React Frontend): I'll improve the React interface with features like interactive explanations, progress tracking, and visual cues (like confidence scores) to make the tutor more intuitive and engaging for students.