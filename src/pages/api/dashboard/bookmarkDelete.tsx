import axios from "../../../utils/axios";
import FormData from 'form-data';

const BookmarkDelete = async (req: any, res: any) => {
    try {
        const sawonno = req.query.sawonno;
        const itm_no = req.query.itm_no;

        if (!sawonno || !itm_no) {
            res.status(400).json({ message: "파라미터가 전달되지 않았습니다" });
        }

        const url = process.env.NEXT_PUBLIC_JCAJSPDOMAIN + "/mng/sctItm/ajax/usrSctItmDelete_ajax.jsp";

        const formData = new FormData();
        formData.append('sawonno', sawonno);
        formData.append('itm_no', itm_no);

        const response = await axios.post(url, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=' + formData.getBoundary()
                }
            }
        )

        if (response.data) {
            const result = response.data.procResult;
            res.status(200).json({ result })
        } else {
            res.status(400).json({ message: "데이터를 가져올 수 없습니다." });
        }


    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export default BookmarkDelete;