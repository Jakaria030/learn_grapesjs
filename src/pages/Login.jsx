import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = ({ onSwitch }) => {

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {

        if (!email || !password) {
            setError("Please fill all fields");
            return;
        };

        setLoading(true);
        setError("");

        const result = await login(email, password);

        if (!result.success) {
            setError(result.message);
        };

        setLoading(false);

    };

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>

            <div style={{ background: "#12121e", padding: "40px", borderRadius: "16px", width: "100%", maxWidth: "400px", border: "1px solid #1e1e3a" }}>

                <h1 style={{ color: "white", marginBottom: "8px", fontSize: "24px" }}>Welcome Back</h1>
                <p style={{ color: "#666", marginBottom: "32px", fontSize: "14px" }}>Login to your builder account</p>

                {error && (
                    <div style={{ background: "#f8d7da", color: "#721c24", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ color: "#aaa", fontSize: "12px", display: "block", marginBottom: "6px" }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #1e1e3a", background: "#0a0a0f", color: "white", fontSize: "14px", boxSizing: "border-box" }}
                    />
                </div>

                <div style={{ marginBottom: "24px" }}>
                    <label style={{ color: "#aaa", fontSize: "12px", display: "block", marginBottom: "6px" }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #1e1e3a", background: "#0a0a0f", color: "white", fontSize: "14px", boxSizing: "border-box" }}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: "#4361ee", color: "white", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p style={{ color: "#666", fontSize: "14px", textAlign: "center", marginTop: "24px" }}>
                    Don't have an account?{" "}
                    <span
                        onClick={onSwitch}
                        style={{ color: "#4361ee", cursor: "pointer" }}
                    >
                        Register
                    </span>
                </p>

            </div>

        </div>
    );

};

export default Login;
