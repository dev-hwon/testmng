import axios from "axios";
import { AuthUser } from "../types/auth";

const usePage = async (user: AuthUser, path: string) => {
    if (!user) {
        throw new Error("User not Defined");
    }

    const response = await axios.get('/api/auth/page-auth?path=' + path + '&part=' + user.partcode);
    if (!response) {
        throw new Error("usePage Check Error Occured");
    }

    return response;
};

export default usePage;