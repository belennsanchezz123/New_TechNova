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

        <div id="popup-registration-complete" class="popup-overlay">
            <div class="popup-content">
                <h3>Registration Complete!</h3>
                <p>You have successfully registered all your Lynx accounts.</p>

                <div class="profile-dropdown-container">
                    <button class="profile-button" onclick="window.toggleProfileDropdown()">
                        <div class="profile-avatar">B</div>
                        <div class="profile-info">
                            <span class="profile-name" id="profile-display-name">User</span>
                            <span class="profile-email" id="profile-display-email">user@lynx.com</span>
                        </div>
                        <span class="dropdown-arrow">▼</span>
                    </button>

                    <div id="profile-dropdown-menu" class="profile-dropdown-menu" style="display: none;">
                        <div class="dropdown-section">
                            <div class="dropdown-header">Lynx Accounts</div>

                            <div class="account-item">
                                <div class="account-icon">📧</div>
                                <div class="account-details">
                                    <div class="account-service">Lynx Mail</div>
                                    <div class="account-username" id="mail-username">-</div>
                                </div>
                            </div>

                            <div class="account-item">
                                <div class="account-icon">💾</div>
                                <div class="account-details">
                                    <div class="account-service">Lynx Drive</div>
                                    <div class="account-username" id="drive-username">-</div>
                                </div>
                            </div>

                            <div class="account-item">
                                <div class="account-icon">📅</div>
                                <div class="account-details">
                                    <div class="account-service">Lynx Events</div>
                                    <div class="account-username" id="events-username">-</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button onclick="window.closeRegistrationComplete()" style="margin-top: 20px;">Continue</button>
            </div>
        </div>
    `;
}
