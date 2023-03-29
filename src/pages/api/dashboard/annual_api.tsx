import axios from "../../../utils/axios";

const Annual = async (req: any, res: any) => {
    try {
        const url = process.env.NEXT_PUBLIC_JCAJSPDOMAIN + "/mng/dashboard/usrAnnualLeave_ajax.jsp";
        
        const mm_id = req.query;
        if (!mm_id) {
            res.status(400).json({ message: "파라미터가 전달되지 않았습니다" });
        }
        const response = await axios.get(url, {params : mm_id});
       
        res.status(200).json(response.data);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default Annual;