
import React from 'react';
import swal from 'sweetalert';

const Swal = () => {

    // type: warning / error / success / info
    const SwalAlert = (msg: string, type: string) => {
        return (
            swal({
                text: msg,
                icon: type,
            })
        )
    }

    const SwalConfirm = (title: string, msg: string) => {
        return (
            swal({
                title: title,
                text: msg,
                icon: "warning",
                buttons: ["취소", "확인"]
            })

        )

    }
    return { SwalAlert, SwalConfirm }
}

export default Swal;