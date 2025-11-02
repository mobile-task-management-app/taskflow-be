import React, { useState, useEffect, useCallback } from 'react';
// Note: Removed 'react-native' imports and replaced them with standard web components and Tailwind CSS.

// --- ⚠️ IMPORTANT: REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL CREDENTIALS ⚠️ ---

const OAUTH_CONFIG = {
    // 1. Get this from Google Cloud Console. Must be a Web Application client ID.
    CLIENT_ID: 'YOUR_WEB_CLIENT_ID_HERE', 
    
    // 2. THIS MUST BE REGISTERED in your Google Cloud Console's authorized redirect URIs.
    // In a single-file web environment, this will be the current page URL.
    REDIRECT_URI: window.location.origin, 

    // Google Endpoints
    AUTHORIZE_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
    TOKEN_URL: 'https://oauth2.googleapis.com/token',
    USER_INFO_URL: 'https://www.googleapis.com/oauth2/v3/userinfo',

    // Scopes define what access your app is requesting.
    SCOPES: 'openid profile email',
};

// Placeholder for Firebase/Canvas required variables (not used for this OAuth flow)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

// --- CORE COMPONENT ---

const App = () => {
    const [tokenData, setTokenData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Function to fetch user data using the Access Token
    const fetchUserProfile = async (accessToken) => {
        try {
            const userResponse = await fetch(OAUTH_CONFIG.USER_INFO_URL, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const userJson = await userResponse.json();
            setUserData(userJson);

        } catch (err) {
            console.error('User Fetch Error:', err);
            setError(`Failed to fetch user profile: ${err.message}`);
        }
    };

    // Function to exchange the authorization code for an Access Token
    const exchangeCodeForToken = useCallback(async (code) => {
        setLoading(true);
        try {
            // Note: For a pure front-end application (which is insecure and not recommended), 
            // the CLIENT_SECRET must NOT be included. However, Google requires a "server-side" 
            // exchange for the Authorization Code flow. 
            // In a production scenario, this entire block would be handled by your own backend server.
            
            // This is configured as a demonstration of the request format. It is likely to fail
            // due to Google's security requirements unless this is run on a registered server.

            const tokenRequestBody = new URLSearchParams({
                code: code,
                client_id: OAUTH_CONFIG.CLIENT_ID,
                // Client Secret is NOT safe in client-side code, keeping it commented for security demo:
                // client_secret: 'YOUR_CLIENT_SECRET_HERE', 
                redirect_uri: OAUTH_CONFIG.REDIRECT_URI,
                grant_type: 'authorization_code',
            }).toString();

            // Perform token exchange
            const tokenResponse = await fetch(OAUTH_CONFIG.TOKEN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: tokenRequestBody,
            });

            const tokenJson = await tokenResponse.json();

            if (tokenJson.error) {
                // If this fails (common for client-side exchange), it indicates the need for a backend proxy.
                throw new Error(`Google API Error: ${tokenJson.error_description || tokenJson.error}. You likely need a backend server to exchange the code securely.`);
            }

            setTokenData(tokenJson);
            await fetchUserProfile(tokenJson.access_token);

        } catch (err) {
            console.error('Token Exchange Error:', err);
            setError(`Token exchange failed: ${err.message}`);
        } finally {
            setLoading(false);
            // Clean up the URL after processing the code
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);


    // Effect to check for the authorization code on page load (standard web OAuth callback)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');

        if (authorizationCode) {
            // Found a code in the URL, proceed with token exchange
            exchangeCodeForToken(authorizationCode);
        } else if (urlParams.get('error')) {
             setError(`OAuth Error: ${urlParams.get('error_description') || urlParams.get('error')}`);
        }
    }, [exchangeCodeForToken]);


    // Function to start the OAuth 2.0 Authorization flow
    const initiateOAuthFlow = () => {
        setTokenData(null);
        setUserData(null);
        setError(null);

        try {
            const authUrl = `${OAUTH_CONFIG.AUTHORIZE_URL}?` + new URLSearchParams({
                client_id: OAUTH_CONFIG.CLIENT_ID,
                redirect_uri: OAUTH_CONFIG.REDIRECT_URI,
                response_type: 'code', 
                scope: OAUTH_CONFIG.SCOPES,
                access_type: 'offline',
            }).toString();

            // Open the URL in the current window (redirect)
            window.location.href = authUrl;

        } catch (err) {
            console.error('Failed to open OAuth URL:', err);
            setError('Could not initiate the OAuth process.');
        }
    };

    // --- RENDER UI ---
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-inter">
            <div className="w-full max-w-xl bg-white shadow-xl rounded-xl p-8 transition-all duration-300">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">Google OAuth 2.0 Demo</h1>
                <p className="text-sm text-gray-500 mb-8 text-center">Web Authorization Code Flow (React/Tailwind)</p>
                
                {/* Warning Box */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
                    <p className="font-semibold text-sm text-yellow-800">
                        ⚠️ **SECURITY WARNING:** This client-side exchange is for demonstration only. Production apps must use a secure **backend proxy** to exchange the code for the access token, hiding the `CLIENT_SECRET`.
                    </p>
                </div>
                
                {/* Login Button */}
                <button 
                    className={`w-full py-3 px-6 rounded-lg text-white text-lg font-semibold shadow-md transition-all duration-200 
                                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
                    onClick={initiateOAuthFlow}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        <span>Log in with Google</span>
                    )}
                </button>

                {/* Status and Results */}
                {error && (
                    <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-md">
                        <p className="font-bold text-red-800">Authentication Error:</p>
                        <p className="text-sm text-red-700 whitespace-pre-wrap">{error}</p>
                    </div>
                )}

                {userData && (
                    <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                        <p className="text-lg font-semibold text-green-800 mb-2">✅ User Profile Fetched</p>
                        <div className="space-y-1 text-sm text-gray-700">
                            <p><span className="font-medium">Name:</span> {userData.name}</p>
                            <p><span className="font-medium">Email:</span> {userData.email}</p>
                            <p><span className="font-medium">Google ID (sub):</span> {userData.sub}</p>
                        </div>
                    </div>
                )}

                {tokenData && (
                    <div className="mt-4 p-4 bg-gray-100 border-l-4 border-gray-400 rounded-md">
                        <p className="text-lg font-semibold text-gray-800 mb-2">Token Data</p>
                        <div className="space-y-1 text-sm text-gray-700">
                            <p><span className="font-medium">Type:</span> {tokenData.token_type}</p>
                            <p><span className="font-medium">Expires In:</span> {tokenData.expires_in} seconds</p>
                            <p><span className="font-medium">Refresh Token:</span> {tokenData.refresh_token ? 'Received (Stored on server/database, not shown)' : 'N/A'}</p>
                        </div>
                    </div>
                )}
                
                <p className="mt-8 text-xs text-gray-400 text-center border-t pt-4">
                    Configured Redirect URI: {OAUTH_CONFIG.REDIRECT_URI}
                </p>

            </div>
        </div>
    );
};

export default App;
