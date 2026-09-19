# Ai Master architecture

Ai Master is designed as an orchestrator rather than a magical model containing every AI.

## Router
The first router chooses a task category: general, coding, creative, or web. Replace this heuristic with a model-based router as the project grows.

## Provider adapters
The server keeps provider credentials off the browser. Add adapters for other authorized providers behind the same interface:

- OpenAI
- Anthropic
- Google
- Mistral
- Open-source/self-hosted models
- Other compatible APIs

The app should only call providers for which the user has legitimate access.

## Synthesis
For hard tasks, the router can send the same request to multiple configured models, compare their outputs, and ask a synthesis model to produce one answer. This increases cost and latency, so it should be optional.

## Tools
Web search, code execution, file analysis, image generation, and other capabilities should be exposed as explicit server-side tools. Never put private API keys in client-side JavaScript.

## Reality check
No single app can automatically inherit every AI company's private model intelligence. Ai Master can combine accessible models and tools through their APIs, subject to provider availability, limits, pricing, and terms.
