import jwt from 'jsonwebtoken';

export const verifyUser = async (req, res, next) => {
    try {
        const refreshToken = req.headers["refreshtoken"];

        if (!refreshToken) {
            console.log("Refresh token not found");
            const renewed = await renewToken(req, res);
            if (renewed) {
                next();
            } else {
                return;
            }
        } else {
            jwt.verify(
                refreshToken,
                "jwt-refresh-token-secret-key",
                (err, decoded) => {
                    if (err) {
                        console.log("Invalid refresh token:", err.message);
                        return res
                            .status(401)
                            .json({ valid: false, message: "Invalid Token" });
                    } else {
                        console.log("Access token still valid");
                        const payload = decoded;
                        req.refreshToken = refreshToken;
                        req.userName = payload.userName;
                        req.clientId = payload.clientId;
                        next();
                    }
                }
            );
        }
    } catch (error) {
        console.error("Error in verifyUser:", error);
        res.status(500).json({ valid: false, message: "Internal server error" });
    }
}

const renewToken = async (req, res) => {
    try {
        const accessToken = req.headers["authorization"];

        if (!accessToken) {
            console.log("No accessToken token");
            res.status(401).json({ valid: false, message: "No access token" });
            return false;
        }

        return new Promise((resolve) => {
            jwt.verify(
                accessToken,
                "jwt-access-token-secret-key",
                (err, decoded) => {
                    if (err) {
                        console.log("Invalid access token:", err.message);
                        res
                            .status(401)
                            .json({ valid: false, message: "Invalid refresh token" });
                        resolve(false);
                    } else {
                        console.log("Created new token");
                        const payload = decoded;

                        const newPayload = {
                            clientId: payload.clientId,
                            userName: payload.userName
                        };

                        const refreshToken = jwt.sign(
                            newPayload,
                            "jwt-refresh-token-secret-key",
                            { expiresIn: "1h" }
                        );

                        req.refreshToken = refreshToken;
                        req.userName = payload.userName;
                        req.clientId = payload.clientId;

                        resolve(true);
                    }
                }
            );
        });
    } catch (error) {
        console.error("Error in renewToken:", error);
        res.status(500).json({ valid: false, message: "Internal server error" });
        return false;
    }
}