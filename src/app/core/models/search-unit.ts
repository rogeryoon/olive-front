export interface SearchUnit {
    /**
     * 범용 한정 적용 인덱스
     */
    appliedIndex?: number;

    /**
     * 이 조건만 허용하고 나머지는 무시/삭제
     */
    exclusive?: boolean;

    /**
     * 검색 패턴
     */
    searchPattern: RegExp;

    /**
     * 변경 값
     */
    replaceValue?: string;
}
