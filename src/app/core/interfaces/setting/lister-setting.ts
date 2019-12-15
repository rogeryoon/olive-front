import { PermissionValues } from '@quick/models/permission.model';
import { NameValue } from '../../models/name-value';
import { OliveOnContextMenu } from '../on-context-menu';
import { OliveOnButton } from '../on-buttons';

export interface IListerSetting {
    itemType: any;
}

export class ListerSetting implements IListerSetting {
    // Html Table Id
    dataTableId?: string;   

    // 엔티티 정의
    itemType: any;

    // 추가 검색 조건 지정
    extraSearches?: NameValue[];

    // 페이지 테이블 열
    columns?: any[];

    // 페이지 타이틀 번역 아이디
    translateTitleId: string;

    // 페이지 타이틀 아이콘
    icon: string;

    // 편집한 내용을 저장 / 삭제할수 있는 권한 지정
    managePermission?: PermissionValues;
    
    // 팝업 편집창 컴포넌트
    editComponent?: any;

    // 팝업 검색창 컴포넌트
    searchComponent?: any;

    // 팝업 편집창 로딩시 디테일 정보를 백앤드에서 가져왔는지 Flag
    loadDetail?: boolean;

    // 팝업 편집창 타이틀 Overriding
    editCustomTitle?: string;

    // 팝업 편집창 추가 버튼
    editCustomButtons?: OliveOnButton[];

    // 팝업 편집창 읽기전용 
    isEditDialogReadOnly?: boolean;

    // Datatable Order Overriding
    order?: any;

    // 페이지 테이블 Footer 열 정의
    footerColumns?: any[];

    // 기본 Context 메뉴 (신규/엑셀/인쇄/대량업로드 메뉴 스위치) : Default - All Menu On
    disabledContextMenus?: string[];

    // 페이지 상단 검색 Input 숨기기
    noSearchBox?: boolean;

    // 편집창 팝업대신 임의 페이지 이동시 true 설정
    navigateDetailPage?: boolean;

    // 페이지 추가 Context 메뉴
    customContextMenus?: OliveOnContextMenu[];
}

