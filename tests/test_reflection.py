from app.agents.reflection import Reflection

sample_document = """
# Business Proposal

## Executive Summary

Our AI healthcare startup aims to improve diagnostic accuracy
using machine learning.

## Market Analysis

The healthcare AI market is growing rapidly worldwide.

## Business Model

We will offer SaaS subscriptions to hospitals.
"""

reflection = Reflection()

result = reflection.review(sample_document)

print("\n========== REFLECTION ==========\n")

print("Approved:", result.approved)

print("\nFeedback:\n")
print(result.feedback)

print("\n========== IMPROVED DOCUMENT ==========\n")

print(result.improved_content)