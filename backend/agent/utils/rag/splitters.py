from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(chunk_size=750, chunk_overlap=20)
child_splitter = RecursiveCharacterTextSplitter(chunk_size=200)
