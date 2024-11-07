const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        
        if (!tokenCookieValue) {
            return next(); // Skip if no token is found
        }

        try {
            const userPayload = validateToken(tokenCookieValue); // Validate token
            req.user = userPayload; // Set req.user if token is valid
        } catch (error) {
            console.log("Token validation error:", error); // Log if validation fails
        }
        
        next(); // Proceed to the next middleware or route
    };
}

module.exports = checkForAuthenticationCookie;
