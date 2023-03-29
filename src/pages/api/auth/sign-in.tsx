import axios from "../../../utils/axios";
import { sign, JWT_SECRET } from "../../../utils/jwt";
import FormData from "form-data";

const JWT_EXPIRES_IN = "1h";

const SignIn = async (req: any, res: any) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            res.status(400).json({ message: "파라미터가 전달되지 않았습니다" });
        }

        const url = process.env.NEXT_PUBLIC_JCAJSPDOMAIN + "/mng/auth/loginCheck.jsp";

        const formData = new FormData();
        formData.append('id', email);
        formData.append('pw', password);

        const response = await axios.post(url, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=' + formData.getBoundary()
                }
            }
        );

        if (response.data.success) {

            const accessToken = sign(
                {
                    id: response.data.data.id,
                    name: response.data.data.name,
                    dtcode: response.data.data.dtcode,
                    friend: response.data.data.friend,
                    group: response.data.data.group,
                    no: response.data.data.no,
                    partcode: response.data.data.partcode,
                    sawonno: response.data.data.sawonno
                },
                JWT_SECRET,
                {
                    expiresIn: JWT_EXPIRES_IN,
                }
            );

            const user = {
                id: response.data.data.id,
                displayName: response.data.data.name,
                email,
                //    password,
                avatar: null,
                name: response.data.data.name,
                dtcode: response.data.data.dtcode,
                friend: response.data.data.friend,
                group: response.data.data.group,
                no: response.data.data.no,
                partcode: response.data.data.partcode,
                sawonno: response.data.data.sawonno
            };

            res.status(200).json({ accessToken, user });
        } else {
            res.status(400).json({ message: "로그인에 실패했습니다" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default SignIn;