"""
Wallet-based auth helpers for chat endpoints.
"""
import re

# Ethereum/Avalanche address: 0x followed by 40 hex chars
WALLET_PATTERN = re.compile(r"^0x[a-fA-F0-9]{40}$")


def get_wallet_from_request(request):
    """Extract wallet address from Authorization header (Wallet 0x...) or request body."""
    auth = request.headers.get("Authorization")
    if auth and auth.startswith("Wallet "):
        addr = auth[7:].strip()
        if validate_wallet_address(addr):
            return addr

    if request.is_json:
        data = request.get_json(silent=True) or {}
        addr = data.get("wallet_address")
        if addr and validate_wallet_address(addr):
            return addr

    addr = request.args.get("wallet_address")
    return addr if addr and validate_wallet_address(addr) else None


def validate_wallet_address(address):
    """Check if string is a valid Ethereum/Avalanche wallet address."""
    return bool(address and isinstance(address, str) and WALLET_PATTERN.match(address.strip()))
