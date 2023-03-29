import { useRouter } from "next/router";
import React, {useEffect, useCallback } from "react";
import swal from "sweetalert";
import CommonKey from "../../common/CommonKey";
import useAuth from "../../hooks/useAuth";
import usePageAuth from "../../hooks/usePage";

interface AuthGuardType {
  children: React.ReactNode;
}

// 부서별 페이지 권한
function PageGuard({ children }: AuthGuardType) {
    const { user } = useAuth();
    const router = useRouter();
    const pageAuthPromise = usePageAuth(user, router.asPath);

    useEffect(() => {
        if (user) {
            const partCode = user.partcode;
            if (typeof window != 'undefined') {
                const currentDomain = window.location.href;
                if (currentDomain == 'http://localhost:3000/' || currentDomain == 'http://mng.enuri.com/' || currentDomain.includes('/private')) {
                    if (partCode.includes('101202308490') || partCode.includes('101202308480')) {
                         router.push(CommonKey.PERMISSION_DENIED);
                    }
                } else {
                    pageAuthPromise.then(function (obj: any) {
                        if (obj && obj.data) {
                            const data = obj.data;
                            if (data.status === 'fail') {
                                // swal("권한이 없습니다");
                                router.push(CommonKey.PERMISSION_DENIED);
                            }
                        }
                    });
                }
            }
        } else {
            router.push(CommonKey.PERMISSION_DENIED);
        }
   }, [user, pageAuthPromise, router]);
    
    // const pageCheck = useCallback(() => {
    //     const pageAuthPromise = usePageAuth(user, router.asPath);
    //     pageAuthPromise.then(function (obj: any) {
    //         if (obj && obj.data) {
    //             const data = obj.data;
    //             if (data.status === 'fail') {
    //                 // swal("권한이 없습니다");
    //                 alert('권한이 없습니다.');
    //                 router.push("/dashboard/permissionDenied");
    //             }
    //         }
    //     });
    // }, [user, router]);

    return (
        <React.Fragment>{children}</React.Fragment>
    );
}

export default PageGuard;