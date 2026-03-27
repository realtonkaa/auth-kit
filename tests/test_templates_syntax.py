"""Verify all template files have valid syntax."""

import ast
import re
import pytest
from pathlib import Path

TEMPLATES = Path(__file__).parent.parent / "templates"


def get_python_templates():
    """Find all .py template files."""
    return list(TEMPLATES.glob("**/*.py"))


def get_js_templates():
    """Find all .js/.ts/.tsx template files."""
    return list(TEMPLATES.glob("**/*.js")) + list(TEMPLATES.glob("**/*.ts")) + list(TEMPLATES.glob("**/*.tsx"))


class TestPythonSyntax:
    @pytest.mark.parametrize("path", get_python_templates(), ids=lambda p: str(p.relative_to(TEMPLATES)))
    def test_python_file_parses(self, path):
        """Every Python template must be valid syntax."""
        source = path.read_text(encoding="utf-8")
        try:
            ast.parse(source)
        except SyntaxError as e:
            pytest.fail(f"Syntax error in {path}: {e}")

    @pytest.mark.parametrize("path", get_python_templates(), ids=lambda p: str(p.relative_to(TEMPLATES)))
    def test_python_has_header_comment(self, path):
        """Every Python template should have an AUTH-KIT header comment."""
        source = path.read_text(encoding="utf-8")
        assert "AUTH-KIT TEMPLATE" in source, f"{path} missing AUTH-KIT header comment"


class TestJSSyntax:
    @pytest.mark.parametrize("path", get_js_templates(), ids=lambda p: str(p.relative_to(TEMPLATES)))
    def test_js_has_header_comment(self, path):
        """Every JS/TS template should have an AUTH-KIT header comment."""
        source = path.read_text(encoding="utf-8")
        assert "AUTH-KIT TEMPLATE" in source, f"{path} missing AUTH-KIT header comment"

    @pytest.mark.parametrize("path", get_js_templates(), ids=lambda p: str(p.relative_to(TEMPLATES)))
    def test_js_no_obvious_errors(self, path):
        """Basic check: no unclosed braces or empty files."""
        source = path.read_text(encoding="utf-8")
        assert len(source.strip()) > 0, f"{path} is empty"
        # Check balanced braces (rough check)
        opens = source.count("{")
        closes = source.count("}")
        # Allow some mismatch for template literals but not huge gaps
        assert abs(opens - closes) <= 3, f"{path} has mismatched braces: {opens} open, {closes} close"
