import { getUserPasswordByEmail, incrementLoginAttment } from '../Models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        let { body: { email, password } } = req;
        let hashedPassword = await getUserPasswordByEmail(email);
        if (hashedPassword) {
            let checkBcryptPasswordRes = await bcrypt.compare(password, hashedPassword.password);
            if (checkBcryptPasswordRes) {
                const accessToken = jwt.sign(
                    {
                        clientId: hashedPassword.client_id,
                        userName: hashedPassword.name
                    },
                    "jwt-access-token-secret-key"
                );
                const refreshToken = jwt.sign(
                    {
                        clientId: hashedPassword.client_id,
                        userName: hashedPassword.name
                    },
                    "jwt-refresh-token-secret-key",
                    { expiresIn: '1h' }
                );
                await incrementLoginAttment(hashedPassword.id);
                return res.send({ status: true, code: 200, message: "LoggedIn Sucessfully", accessToken: accessToken, refreshToken: refreshToken });
            } else {
                return res.send({ status: false, code: 401, message: "Invalid login details. Please try again" });
            }
        } else {
            return res.send({ status: false, code: 401, message: "Invalid login details. Please try again" });
        }
    } catch (error) {
        console.error("Error In userLogin", error);
        return res.send({ status: false, code: 500, message: "Internal Server Error" });
    }
}