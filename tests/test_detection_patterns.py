"""Tests for framework detection logic."""

import json
import pytest
from pathlib import Path

FIXTURES = Path(__file__).parent / "fixtures"


def detect_framework_from_package_json(content: str) -> str:
    """Simulate the framework detection logic from SKILL.md."""
    data = json.loads(content)
    deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}

    if "next" in deps:
        return "nextjs"
    if "express" in deps:
        return "express"
    return "unknown"


def detect_framework_from_requirements(content: str) -> str:
    """Simulate Python framework detection."""
    lower = content.lower()
    if "fastapi" in lower:
        return "fastapi"
    if "flask" in lower:
        return "flask"
    return "unknown"


class TestNodeDetection:
    def test_detects_nextjs(self):
        content = (FIXTURES / "nextjs_package.json").read_text()
        assert detect_framework_from_package_json(content) == "nextjs"

    def test_detects_express(self):
        content = (FIXTURES / "express_package.json").read_text()
        assert detect_framework_from_package_json(content) == "express"

    def test_unknown_node_project(self):
        content = json.dumps({"dependencies": {"react": "19.0.0"}})
        assert detect_framework_from_package_json(content) == "unknown"

    def test_next_in_devdeps(self):
        content = json.dumps({"devDependencies": {"next": "15.0.0"}})
        assert detect_framework_from_package_json(content) == "nextjs"

    def test_next_takes_priority_over_express(self):
        content = json.dumps({"dependencies": {"next": "15.0.0", "express": "4.0.0"}})
        assert detect_framework_from_package_json(content) == "nextjs"


class TestPythonDetection:
    def test_detects_flask(self):
        content = (FIXTURES / "flask_requirements.txt").read_text()
        assert detect_framework_from_requirements(content) == "flask"

    def test_detects_fastapi(self):
        content = (FIXTURES / "fastapi_requirements.txt").read_text()
        assert detect_framework_from_requirements(content) == "fastapi"

    def test_unknown_python_project(self):
        assert detect_framework_from_requirements("requests==2.31.0\nnumpy==1.26.0") == "unknown"

    def test_case_insensitive(self):
        assert detect_framework_from_requirements("Flask==3.0.0") == "flask"
        assert detect_framework_from_requirements("FastAPI==0.100.0") == "fastapi"
