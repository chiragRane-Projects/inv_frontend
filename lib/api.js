const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(path, options = {}, token = null) {
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    console.log(`🚀 API Call: ${options.method || 'GET'} ${API_URL}${path}`);
    if (options.body) {
        console.log('📤 Request Body:', JSON.parse(options.body));
    }

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    console.log(`📡 Response Status: ${res.status} ${res.statusText}`);

    if (!res.ok) {
        let errorMessage = "API error";
        try {
            const error = await res.json();
            console.log('❌ Error Response:', error);
            if (error.detail) {
                if (Array.isArray(error.detail)) {
                    errorMessage = error.detail.map(e => e.msg || e.message || e).join(', ');
                } else {
                    errorMessage = error.detail;
                }
            }
        } catch (e) {
            errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
    }

    const data = await res.json();
    console.log('✅ Response Data:', data);
    return data;
}