from app.agents.orchestrator import Orchestrator

request = """
Prepare a complete project plan for migrating a medium-sized e-commerce company to AWS.

The company has around 250 employees.

Budget has not been finalized.

The migration deadline is flexible.

Some business requirements are missing.

Make reasonable assumptions wherever necessary.

Include a risk assessment, migration timeline, estimated costs, responsibilities, and recommendations.
"""

orchestrator = Orchestrator()

result = orchestrator.run(request)

print("\n========== FINAL RESULT ==========\n")

print("Document Type:", result.analysis.document_type)

print("Reflection Approved:", result.reflection.approved)

print("\nGenerated Files")

print(result.docx_path)
print(result.pdf_path)
print(result.txt_path)