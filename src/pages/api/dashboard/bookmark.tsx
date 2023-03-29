import axios from "../../../utils/axios";
import FormData from 'form-data';

const Bookmark = async (req: any, res: any) => {
    try {
        const sawonno = req.query.sawonno;

        if (!sawonno) {
            res.status(400).json({ message: "파라미터가 전달되지 않았습니다" });
        }

        const url = process.env.NEXT_PUBLIC_JCAJSPDOMAIN + "/mng/sctItm/ajax/usrSctItmSelect_ajax.jsp";

        const formData = new FormData();
        formData.append('sawonno', sawonno);

        const response = await axios.post(url, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=' + formData.getBoundary()
                }
            }
        )

        if (response.data) {
            const bookMarkData = response.data.selectItm;
            res.status(200).json({ bookMarkData })
        } else {
            res.status(400).json({ message: "데이터를 가져올 수 없습니다." });
        }


    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export default Bookmark;