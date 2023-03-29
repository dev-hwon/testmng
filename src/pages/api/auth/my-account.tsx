import { JWT_SECRET, verify } from "../../../utils/jwt";

const MyAccount = async (req: any, res: any) => {
    try {
        const accessToken = req.query.token;
         if (!accessToken) {
            res.status(401).json({ message: "Authorization token missing" });
        }
        const user: any = verify(accessToken, JWT_SECRET);
        if (!user) {
            res.status(401).json({ message: "Invalid authorization token" });
        } else {
            
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default MyAccount;