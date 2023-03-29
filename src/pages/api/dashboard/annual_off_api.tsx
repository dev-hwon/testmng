import axios from "../../../utils/axios";
import FormData from 'form-data';

const Annual_off = async (req: any, res: any) => {
    try {
        const url = process.env.NEXT_PUBLIC_JCAJSPDOMAIN + "/mng/dashboard/annualOff_ajax.jsp";
        
        const response = await axios.get(url);
       
        if (response.data.ajaxSuccess) {  //ajaxSuccess : api 통신 성공 여부
            if (response.data.ajaxSuccess)
            return res.status(200).json({ status: 'success', data: response.data });
        } else {
            return res.status(200).json({ status: 'fail', data: response.data });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default Annual_off;