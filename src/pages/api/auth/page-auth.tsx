import axios from "axios";

const PageAuth = async (req: any, res: any) => {
    try {
        const path = req.query.path; // url 경로
        const part = req.query.part; // 부서
        
        if (!path || !part) {
            return res.status(200).json({ status: 'fail', message: "파라미터가 전달되지 않았습니다" });
        }

        // 다른 부서의 경우 페이지 작업이 안된 상태라 별도 체크 안함
        // if (part != '101202308490' && part != '101202308480') {
        //     return res.status(200).json({ status: 'ok'});
        // }
        
        let url = process.env.NEXT_PUBLIC_JCAJSPDOMAIN + "/mng/auth/pageCheck.jsp";

        const response = await axios.get(url, {
            params: {
                path: encodeURI(path),
                part: part
            }
        });

        if (response.data.success) {
            res.status(200).json({ status: 'ok'});
        } else {
            res.status(200).json({ status: 'fail', message: "권한이 없습니다." });
            // alert('권한이 없습니다.');
            // return;
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default PageAuth;