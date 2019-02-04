export const locale = {
    lang: 'en',
    data: {
        'common' : {
            'status': {
                'inWarehousePending' : '입고 대기',
                'inWarehouseComplete' : '입고 완료'
            },
            'message' : {
                'noRecordsFound' : 'No matching records found',
                'savingChanges' : 'Saving changes...',
                'newItemCreated': '"{0}" was created successfully',
                'uploadSaved': '업로드 데이터 저장을 완료하였습니다.',
                'deleted' : '"{0}" was deleted successfully',
                'updated' : '"{0}" was saved successfully',
                'saveError' : 'The below errors occured whilst saving your changes:',
                'noExcelFile' : 'Please upload a valid Excel file (.xlsx)!',
                'selectItem' : '원하는 항목을 체크 선택해주세요.',
                'notSupportHtml5' : 'Sorry! Your browser does not support HTML5.',
                'invalidSelectedFiles' : '선택한 파일이 없습니다.',
                'clickFileButton' : '파일열기 버튼을 눌러 업로드 파일을 선택해 주십시오.',
                'confirmDelete' : 'Delete {0}?',
                'errorDeleteting' : 'The below errors occured whilst sdeleting the item:',
                'deleting' : 'Deleting...',
                'errorLoading' : 'Unable to retrieve data from the server.\r\n Please contact your system administrator',
                'sessionExpired' : 'The session expired. please login to continue.',
                'relogin' : 'Your Session has expired. Please log in again',
                'renewSession' : 'Your Session has expired. Please log in again to renew your session',
                'duplicated' : '아래건(들)이 이미 존재하여 추가되지 않았습니다.\r\n{0}',
                'requestFinished': '요청한 작업을 완료하였습니다.'
            },
            'entryError' : {
                'concurrency' : '입력한 Code나 Key가 중복되어 데이터를 저장할 수 없습니다.',
                'deleteByConcurrency' : '해당 데이터를 참조하고 있는 관련 데이터가 존재해서 삭제를 할 수 없습니다. '
            },
            'validate' : {
                'required' : '필수 입력(선택) 항목입니다.',
                'minNumber' : '{0}이상 입력하십시오.',
                'maxNumber' : '{0}이하 입력하십시오.',
                'pattern' : '입력형식 오류입니다.',
                'number' : '숫자 오류입니다. {0}',
                'decimal' : '(소숫점 최대{0}자리)',
            },
            'title' : {
                'addNewItem' : '{{title}} 등록',
                'editItem' : '{{name}}',
                'itemDetails' : '{{name}}',
                'success' : '작업 완료',
                'saveError' : '저장 오류 발생',
                'notSelected' : '선택 항목 없음',
                'errorOccurred' : '오류 안내',
                'importDialog' : '파일 업로드',
                'deleteError' : '삭제 오류', // 'Delete Error',
                'loadError' : 'Load Error',
                'advancedSearch' : 'Advanced Search',
                'sessionExpired' : 'Session Expired',
                'confirm' : '확인',
                'duplicated' : '중복 오류 알림'
            },
            'button': {
                'save' : '저장',
                'delete' : '삭제',
                'cancel' : '취소',
                'close' : '닫기',
                'exelFile' : '파일 열기..',
                'refresh' : '새로고침',
                'confirmDelete' : '삭제알림',
                'select' : '선택',
                'new' : '신규'
            },
            'menu': {
                'menuButton' : '부가 기능',
                'addNewItem' : 'Add New Item',
                'exportExcelFile' : 'Export Excel File',
                'printList' : 'Print List',
                'upload' : 'Upload',
                'productLookUp' : '상품 조회',
                'purchaseOrderLookup' : '발주 조회'
            },
            'form': {
                'createdDateFrom' : '등록일 시작',
                'createdDateTo' : '등록일 종료'
            }
        },
        'page': {
            'title': {
                'login': 'LOGIN TO YOUR ACCOUNT'
            }
        },
        'naviTitle' : {
            'purchase' : {
                'purchaseEntry': '발주서 작성',
                'purchaseOrderList' : '발주서 조회',
                'paymentMethod' : '결제 수단'
            },
            'product' : {
                'home' : '제품',
                'productHome' : '제품',
                'productGroup' : '제품 그룹',
                'productVariant' : '제품',
            },
            'company' : {
                'list' : '고객사',
                'group' : '고객사 그룹',
                'branch' : '지점',
                'vendor' : '거래처',
                'warehouse' : '창고'
            },
            'basic' : {
                'currency' : '외국 화폐',
                'country' : '국가 코드'
            }
        },
        'navi' : {
            'purchase' : {
                'purchase' : '발주',
                'entry' : '발주서 등록',
                'viewGroup' : '발주서 목록',
                'view' : '발주서 조회',
                'stats' : '발주서 현황',
                'pending' : '미입고 현황'
            },
            'product' : {
                'product' : '상품',
                'products' : '상품 목록',
                'invetoryGroup' : '재고 목록',
                'inventoriesBalance' : '재고 조회',
                'inventoriesWarehouse' : '창고별 재고',
                'inventoriesHistory' : '품목별 재고기록'
            },
            'config' : {
                'companies' : '고객사',
                'companyGroups' : '고객사 그룹'
            }
        },
        'tab': {
            'title' : {
                'main' : '기본정보',
                'setting' : '설정',
                'address' : '주소',
                'sort' : '분류',
                'payments': '결제',
                'items': '상품'
            },
            'error' : {
                'entryTooltip' : '입력오류가 있습니다.'
            }
        },
        'production' : {
            'productEditor': {
                'tabBasicInfo' : 'Basic Info',
                'tabClass' : '분류',
                'tabInventory' : 'Inventory'
            }
        },
        'management': {
            'Search': 'Search for role...',
            'NewRole': 'New Role',
            'Edit': 'Edit',
            'Details': 'Details',
            'Delete': 'Delete',
            'RoleDetails': 'Role Details "{{name}}"',
            'EditRole': 'Edit Role "{{name}}"',
            'Name': 'Name',
            'Description': 'Description',
            'Users': 'Users'
        },
        'editor': {
            'Name': 'Name:',
            'Description': 'Description:',
            'RoleNameRequired': 'Role name is required (minimum of 2 and maximum of 200 characters)',
            'SelectAll': 'Select all',
            'SelectNone': 'Select none',
            'Close': 'Close',
            'Cancel': 'Cancel',
            'Save': 'Save',
            'Saving': 'Saving...'
        }
    }
};

