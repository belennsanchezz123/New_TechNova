export function getPopupsHTML() {
    return `
        <div id="popup-mfa" class="popup-overlay">
            <div class="popup-content">
                <h3>Extra Security Layer</h3>
                <p>To better protect your account, do you want to activate Multi-Factor Authentication (MFA)?</p>
                <button onclick="window.handleMFA(true)">Yes, Activate MFA</button>
                <button class="secondary" onclick="window.handleMFA(false)">No, Maybe Later</button>
            </div>
        </div>

        <div id="popup-passkey" class="popup-overlay">
            <div class="popup-content">
                <h3>New Technology: Passkeys</h3>
                <p>Would you like to set up a 'Passkey' to access your account without a password in the future?</p>
                <button onclick="window.handlePasskey(true)">Yes, Set Up Passkey</button>
                <button class="secondary" onclick="window.handlePasskey(false)">No, I'll Use My Password</button>
            </div>
        </div>

        <div id="popup-app-perms" class="popup-overlay">
            <div class="popup-content">
                <h3>'Lynx Route Planner' requests permission to:</h3>
                <ul style="text-align: left; list-style-position: inside;">
                    <li>✅ View your basic profile information</li>
                    <li style="color:red;">⚠️ Access your contact list and private messages</li>
                    <li style="color:red;">⚠️ Post on your behalf on Lynx Events</li>
                </ul>
                <button onclick="window.handleAppPerms(true)">Accept</button>
                <button class="danger" onclick="window.handleAppPerms(false)">Deny</button>
            </div>
        </div>

        <div id="popup-update" class="popup-overlay">
            <div class="popup-content">
                <h3>Critical Update Available</h3>
                <p>A critical security update for Lynx Browser is available. It is recommended to install now to correct a vulnerability.</p>
                <button onclick="window.handleUpdate('install')">Install Now</button>
                <button class="secondary" onclick="window.handleUpdate('later')">Remind Me Later</button>
            </div>
        </div>
    `;
}
