import { SidebarItemsType } from "../../types/sidebar";

import {
 
  Book,
  Folder
} from "react-feather";
import { AuthUser } from "../../types/auth";
import axios from "axios";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

const pagesSection = [
  {
    href: "/board",
    icon: Book,
    title: "사내게시판",
    children: [
      {
        href: "/board/BoardList?board_code=381",
        title: "공지사항",
      },
      {
        href: "/board/BoardList?board_code=382",
        title: "누리마당",
      },
      {
        href: "/board/BoardList?board_code=385",
        title: "자유게시판",
      },
      {
        href: "/board/BoardList?board_code=600",
        title: "사내동호회",
      },
    ],
  },
  {
    href: "/jca/lpsrp",
    icon: Folder,
    title: "LP/SRP/VIP",
    children: [
      {
        href: "/jca/lpsrp/categoryAdminSetList",
        title: "LP 카테고리별 ON/OFF 설정",
      },
      {
        href: "/jca/lpsrp/popularList",
        title: "LP 일반상품 인기도관리",
      },
      {
        href: "/jca/lpsrp/categorySpec",
        title: "LP 추가분류 상세검색 설정",
      },
      {
        href: "/jca/lpsrp/listSpecShow",
        title: "LP 이미지 노출 속성 설정",
      },
      {
        href: "/jca/lpsrp/groupModel",
        title: "LP 그룹모델 일부 수동추가 관리",
      },
      {
        href: "/jca/lpsrp/specSort",
        title: "상세검색 현황조회",
      },
      {
        href: "/jca/lpsrp/caution",
        title: "VIP 주의사항 관리",
      },
      {
        href: "/jca/lpsrp/portal",
        title: "VIP 포털 검색 설정",
      },
      {
        href: "/jca/lpsrp/crawling",
        title: "VIP 쇼핑몰 상세정보 노출 관리",
      },
      {
        href: "/jca/lpsrp/recommend",
        title: "VIP 추천상품 연관분류 관리",
      },
      {
        href: "/jca/lpsrp/specCompare",
        title: "VIP 스펙비교 관리",
      },
      {
        href: "/jca/lpsrp/kcInfo",
        title: "VIP KC인증정보 관리",
      },
      {
        href: "/jca/lpsrp/video",
        title: "VIP 동영상 등록 관리",
      },
      {
        href: "/jca/lpsrp/promotion",
        title: "쇼핑몰 프로모션 자동화",
      },
      {
        href: "/jca/lpsrp/searchTypeCD",
        title: "일치형 검색어와 모델 매칭 관리",
      },
      {
        href: "/jca/lpsrp/searchTypeCDCType",
        title: "SRP2 C타입 관리",
      },
      {
        href: "/jca/lpsrp/smartfinder",
        title: "스마트파인더 핵심속성 관리",
      },
    ],
  }
] as SidebarItemsType[];

const adSection = [
  {
    href: "/jca/ad/supertopSrp",
    icon: Folder,
    title: "광고셋팅",
    children: [
      {
        href: "/jca/ad/supertopSrp",
        title: "SRP슈퍼탑"
      },
      {
        href: "/jca/main/trendpick",
        title: "트렌드픽업"
      },
      {
        href: "/jca/ad/brandThema",
        title: "이달의브랜드"
      },
      {
        href: "/jca/sdu/factoryCertifi",
        title: "제조사공식인증"
      },
      {
        href: "/jca/cate/cate_OAS",
        title: "에누리 카테고리-OAS 태그맵핑"
      }
    ]
  },
  {
    href: "/jca/cate/modifyList",
    icon: Folder,
    title: "에누리 내부 데이터 조회",
    children: [
      {
        href: "/jca/cate/modifyList",
        title: "카테고리 변경 내역"
      },
      {
        href: "/jca/cate/keywordList",
        title: "카테고리별 인기 키워드"
      },
      {
        href: "/jca/es/searchLog",
        title: "ES검색로그"
      },
      {
        href: "/jca/cm/cmRecord",
        title: "CM실적관리"
      },
      {
        href: "/jca/cate/cateManagerList",
        title: "카테고리 담당자 조회"
      }
    ]
  },
  {
    href: "/jca/ad/sponsorKeyword",
    icon: Folder,
    title: "CPC",
    children: [
      {
        href: "/jca/ad/sponsorKeyword",
        title: "CPC 키워드 관리"
      },
      {
        href: "/jca/ad/knowcomKeyword",
        title: "쇼핑지식 키워드 관리"
      }
    ]
  },
  {
    href: "/jca/ad/infoADIcon",
    icon: Folder,
    title: "프로모션",
    children: [
      {
        href: "/jca/ad/infoADIcon",
        title: "히트브랜드 아이콘"
      },
      {
        href: "/jca/ad/hitbrandManager",
        title: "히트브랜드 admin"
      },
      {
        href: "/jca/ad/hitbrandLog",
        title: "히트브랜드 응모내역"
      },
      {
        href: "/jca/ad/hitbrandEventLog",
        title: "히트브랜드 경품응모"
      },
      {
        href: "/jca/mobile/notice",
        title: "모바일 공지사항"
      }
    ]
  }
] as SidebarItemsType[];

const navItems = [
  {
    title: "Enuri",
    pages: pagesSection,
  },
  {
    title: "광고팀",
    pages: adSection,
  }
];


/*
// 비동기로 가져와야 함
// 동기 처리 할경우 _document.tsx 에서 걸림
const FetchJson = async (navDept: string): SidebarItemsType[] => { 
  const [retData, setRetData] = useState(SidebarItemsType[]);
  await axios
    .get(process.env.NEXT_PUBLIC_JSONSERVER + '/menu')
    .then(function (obj: any) {
      setRetData(obj.data[navDept] as SidebarItemsType[]);
    })
    .catch(function (error) {
      setRetData(pagesSection);
    });
  
  return retData;
};

const navItems = () => {
  const { user } = useAuth();
  const [navDept, setNavDept] = useState('default');
  
  useEffect(() => {
    if (user && user.partcode) {
      setNavDept(user.partcode);
    }
    // 광고팀 인원을 제외하고는 default 로 처리한다.
    if (navDept != '101202308480' && navDept != '101202308490') {
      setNavDept('default');
    }
  }, [user]);

  return (
    [
      {
        title: "Pages",
        pages: FetchJson(navDept)
      }
    ]
  );
}
*/

export default navItems;
