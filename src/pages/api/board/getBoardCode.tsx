import axios from "../../../utils/axios";


const GetBoardCode = async (req: any, res: any) => {
    try {

        const url = process.env.NEXT_PUBLIC_JCAJSPDOMAIN + '/mng/board/getBoardCode.jsp';
        const response = await axios.get(url, { params: req.query });
        // console.log(response.data)
        res.status(200).json(response.data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default GetBoardCode;

