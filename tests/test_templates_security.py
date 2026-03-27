"""Scan templates for security anti-patterns."""

import re
import pytest
from pathlib import Path

TEMPLATES = Path(__file__).parent.parent / "templates"


def get_all_templates():
    """All template files (excluding env.example)."""
    files = []
    for ext in ("*.py", "*.js", "*.ts", "*.tsx"):
        files.extend(TEMPLATES.glob(f"**/{ext}"))
    return files


class TestNoHardcodedSecrets:
    @pytest.mark.parametrize("path", get_all_templates(), ids=lambda p: str(p.relative_to(TEMPLATES)))
    def test_no_hardcoded_secret_key(self, path):
        source = path.read_text(encoding="utf-8")
        # Check for patterns like SECRET_KEY = "actual-secret" (not from env)
        lines = source.split("\n")
        for i, line in enumerate(lines):
            stripped = line.strip()
            # Skip comments
            if stripped.startswith("#") or stripped.startswith("//"):
                continue
            # Check for hardcoded secrets (but allow env lookups and placeholder strings)
            if re.search(r'(?:secret|SECRET).*=\s*["\'][a-zA-Z0-9]{20,}["\']', stripped):
                if "process.env" not in stripped and "os.environ" not in stripped and "getenv" not in stripped:
                    pytest.fail(f"{path}:{i+1} may contain a hardcoded secret: {stripped[:80]}")


class TestNoWildcardCORS:
    @pytest.mark.parametrize("path", get_all_templates(), ids=lambda p: str(p.relative_to(TEMPLATES)))
    def test_no_cors_wildcard(self, path):
        source = path.read_text(encoding="utf-8")
        # Disallow origin: '*' or allow_origins=["*"] in non-comment lines
        for i, line in enumerate(source.split("\n")):
            stripped = line.strip()
            if stripped.startswith("#") or stripped.startswith("//"):
                continue
            if re.search(r'origin.*["\']\\*["\']', stripped) or 'allow_origins=["*"]' in stripped:
                pytest.fail(f"{path}:{i+1} has wildcard CORS: {stripped[:80]}")


class TestNoPlaintextPasswords:
    @pytest.mark.parametrize("path", get_all_templates(), ids=lambda p: str(p.relative_to(TEMPLATES)))
    def test_no_plaintext_password_storage(self, path):
        source = path.read_text(encoding="utf-8")
        # Check for directly storing password without hashing
        for i, line in enumerate(source.split("\n")):
            stripped = line.strip()
            if stripped.startswith("#") or stripped.startswith("//"):
                continue
            # Pattern: user.password = password (without hash)
            if re.search(r'\.password\s*=\s*(?:password|pwd|pass)\b', stripped):
                if "hash" not in stripped.lower() and "bcrypt" not in stripped.lower():
                    pytest.fail(f"{path}:{i+1} may store plaintext password: {stripped[:80]}")


class TestNoWeakHashing:
    @pytest.mark.parametrize("path", get_all_templates(), ids=lambda p: str(p.relative_to(TEMPLATES)))
    def test_no_md5_or_sha1_for_passwords(self, path):
        source = path.read_text(encoding="utf-8")
        for i, line in enumerate(source.split("\n")):
            stripped = line.strip()
            if stripped.startswith("#") or stripped.startswith("//"):
                continue
            if re.search(r'(?:md5|sha1)\s*\(', stripped, re.IGNORECASE):
                if "password" in stripped.lower() or "hash" in stripped.lower():
                    pytest.fail(f"{path}:{i+1} uses weak hashing for passwords: {stripped[:80]}")
