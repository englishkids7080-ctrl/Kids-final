"""Vercel Serverless entry point for the FastAPI backend.

Vercel's Python runtime serves the ASGI `app` object exposed here.
All API routes already live under the `/api` prefix inside backend/server.py,
and vercel.json rewrites every `/api/*` request to this function.
"""
import os
import sys

# Make the existing backend package importable (it is bundled via
# vercel.json -> builds[].config.includeFiles = "backend/**").
BACKEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from server import app  # noqa: E402  (FastAPI ASGI application)

# `app` is what Vercel looks for. Nothing else is required.
