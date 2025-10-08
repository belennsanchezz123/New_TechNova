import { useState } from "react";
import { registerService } from "../services/api";

export default function LynxMailForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        const strength = password.length > 10 ? "strong" : password.length > 6 ? "medium" : "weak";

        const result = await registerService({
            username,
            service: "mail",
            password_strength: strength,
            mfaEnabled: false,
        });

        console.log("Respuesta del backend:", result);
    };

    return (
    <div className="lynx-form">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button onClick={handleRegister}>Create Lynx Mail Account</button>
    </div>
    );
}
