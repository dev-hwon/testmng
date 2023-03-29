import axios from "axios";

// const Download = async (req: any, res: any) => {
//     try {
//         const url = process.env.NEXT_PUBLIC_JCAJSPDOMAIN + '/mng/board/fileDownload.jsp';
//         const response = await axios.get(url, { params: req.query });
//         // console.log(response.data)
//         res.status(200).json(response.data);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }


const Download = async (req: any, res: any) => {
    const url = process.env.NEXT_PUBLIC_JCAASPDOMAIN + "/Upload/EMLOC_BOARD/" + req.query.fileName;
    // res.header("Access-Control-Allow-Origin", "*");
    fetch(url, { method: 'GET' })
        .then((res) => {
            return res.blob();
        })
        .then((blob) => {
            if (typeof window != 'undefined') {

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = req.query.fileName;
                document.body.appendChild(a);
                a.click();
                setTimeout((_: any) => {
                    window.URL.revokeObjectURL(url);
                }, 60000);
                a.remove();
                // setOpen(false);
            }
        })
        .catch((err) => {
            console.error('err: ', err);
        });
}

export default Download;
