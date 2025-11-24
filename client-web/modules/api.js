// modules/api.js

// Global API wrapper (fetch-based)
// Automatically attaches auth token if present
// Normalizes errors for all modules

export const API = {
    token: null,

    setToken(t) {
        this.token = t;
    },

    async request(path, method = "GET", body = null) {
        const headers = { "Content-Type": "application/json" };

        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }

        const opts = { method, headers };

        if (body) {
            opts.body = JSON.stringify(body);
        }

        let response;

        try {
            response = await fetch(path, opts);
        } catch (err) {
            throw new Error("NETWORK_ERROR");
        }

        if (!response.ok) {
            let msg;
            try {
                msg = await response.text();
            } catch {
                msg = "UNKNOWN_ERROR";
            }
            throw new Error(msg);
        }

        // Try parse JSON, allow empty 204
        try {
            return await response.json();
        } catch {
            return null;
        }
    },

    // Shorthand helpers
    get(path) {
        return this.request(path);
    },
    post(path, body) {
        return this.request(path, "POST", body);
    },
    put(path, body) {
        return this.request(path, "PUT", body);
    },
    delete(path) {
        return this.request(path, "DELETE");
    }
};
