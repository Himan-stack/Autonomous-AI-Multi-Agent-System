from app.agents.orchestrator import Orchestrator

request = (
    "Create a business proposal for launching an AI healthcare startup."
)

orchestrator = Orchestrator()

result = orchestrator.run(request)

print("\n========== FINAL RESULT ==========\n")
    
print("Document Type:")
print(result.analysis.document_type)

print("\nSteps Executed:")
print(len(result.executed_steps))

print("\nReflection Approved:")
print(result.reflection.approved)

print("\nFeedback:")
print(result.reflection.feedback)

print("\n========== FINAL DOCUMENT ==========\n")

print(result.final_document[:2500])   # Print only the first part for readability

print("\nSaved Files")

print("TXT :", result.txt_path)
print("PDF :", result.pdf_path)
print("DOCX:", result.docx_path)