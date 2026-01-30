const API_URL = process.env.NEXT_API_URL;

export async function apiFetch(path, options = {}, token = null) {
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "API error");
    }

    return res.json();
}