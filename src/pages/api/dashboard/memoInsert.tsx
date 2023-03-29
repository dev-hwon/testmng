import axios from "../../../utils/axios";
import FormData from 'form-data';

const MemoInsert = async (req: any, res: any) => {
    try {
        const sawonno = req.body.sawonno;
        const memo = req.body.memo;

        if (!sawonno || !memo) {
            res.status(400).json({ message: "파라미터가 전달되지 않았습니다" });
        }

        const url = process.env.NEXT_PUBLIC_JCAJSPDOMAIN + "/mng/auth/memoInsert.jsp";

        const formData = new FormData();
        formData.append('sawonno', sawonno);
        formData.append('memo', memo);

        const response = await axios.post(url, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=' + formData.getBoundary()
                }
            }
        )

        if (response.data.success) {
            res.status(200).json({ message: '등록되었습니다' });
        } else {
            res.status(400).json({ message: '저장에 실패했습니다' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default MemoInsert;