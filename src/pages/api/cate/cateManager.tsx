import axios from "../../../utils/axios";

const cateManager = async (req: any, res: any) => {
    try {
        const url = process.env.NEXT_PUBLIC_JCAJSPDOMAIN + "/cate/manager/get_cate_manager_data.jsp";
        const response = await axios.get(url);

        if (response.data) {
            const cateManagerData = response.data;
            res.status(200).json({ cateManagerData })
        } else {
            res.status(400).json({ message: "데이터를 가져올 수 없습니다." });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export default cateManager;