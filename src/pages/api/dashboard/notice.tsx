import axios from "../../../utils/axios";

const Notice = async (req: any, res: any) => {
    try {
        const url = process.env.NEXT_PUBLIC_JCAJSPDOMAIN + "/mng/board/getBoardTopList.jsp?board_code=381";
        const response = await axios.get(url);

        if (response.data) {
            const noticeData = response.data;
            res.status(200).json({ noticeData })
        } else {
            res.status(400).json({ message: "데이터를 가져올 수 없습니다." });
        }


    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export default Notice;