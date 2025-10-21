

## The Problem: Generic Learning 

Students struggle to get accurate, personalized explanations from generic sources like search engines or static textbooks. These resources don't adapt to a student's current knowledge, pace, or specific needs. This leads to wasted time, confusion, and disengagement, especially for learners without access to a personal tutor.


## The Solution: The AI RAG Tutor

I'm building an AI RAG Tutor Agent to provide instant, tailored academic support. It uses a retrieval-augmented generation (RAG) system to pull accurate, evidence-based answers from curated educational materials and deliver them through an interactive dialogue. 

Key Technical ApproachThe "Brain" (Agents): 

- A Tutor Agent handles direct student interaction, and a Reflection Agent reviews interactions to ensure quality and pedagogical consistency. They use **Agentic Reasoning** to dynamically decide when to search for context, switch tools, or stop, making interactions fast and precise.

- The Pipeline (Tech Stack):

    * Orchestration: LangGraph manages the multi-agent workflow.

    * APIs: FastAPI is the high-performance backend. 

    * Interface: React provides modularity and intuitive frontend.
    
- Data Sources: The tutor uses student-uploaded documents (notes, PDFs) as its primary knowledge base, supplemented by real-time academic content via the **external** Tavily **web search API**.

- Quality Check: LangSmith and Ragas are used for continuous monitoring and evaluation of model accuracy and reasoning.


## Data Strategy

To ensure high-quality answers, I focus on contextual accuracy: 

- Chunking: Using a Recursive Character Text Splitter helps keep educational concepts semantically whole (splitting by paragraph/sentence first). This preserves the context and leads to more coherent answers.

- Knowledge Base: The system prioritizes context from the student's uploaded files and rounds it out with current, trustworthy information from the Tavily search tool.


## Evaluation

For Ragas evaluation result see evaluation.ipynb notebook

## Improvements

My plan for the second half of the course is to make the AI RAG Tutor Agent more accurate, adaptable, and engaging.

Here are the four key improvements:

- Hybrid Retrieval: Combining the reranker with semantic search to ensure answers are both accurate and highly relevant to the student.

- Smarter Agents: Refining the multi-agent system so the Tutor gets better at reasoning (knowing when to search or switch tools), and the Reflection agent provides more actionable feedback.

- Advanced Evaluation: Integrating RAGAS metrics and user feedback to systematically track answer quality, context usage, and student satisfaction.

- Enhanced Frontend: Improving the React interface with interactive explanations, progress tracking, and visual cues to make the tutor more intuitive and fun to use.