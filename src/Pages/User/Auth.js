import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const Auth = () => {
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div> {/* Added a wrapper div to ensure proper rendering */}
            {showRegister ? (
                <Register onSwitch={() => setShowRegister(false)} /> // ✅ Ensures Register page opens
            ) : (
                <Login onSwitch={() => setShowRegister(true)} /> // ✅ Ensures Login page opens
            )}
        </div>
    );
};

export default Auth;
