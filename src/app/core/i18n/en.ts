export const locale = {
    lang: 'en',
    data: {
        'common' : {
            'status': {
                'inWarehousePending' : '입고 대기',
                'inWarehouseComplete' : '입고 완료',
                'inItemEntry' : '상품 등록'
            },
            'message' : {
                'noRecordsFound' : '해당 데이터가 존재하지 않습니다.', // 'No matching records found',
                'savingChanges' : 'Saving changes...',
                'newItemCreated': '"{0}"(이)가 저장되었습니다.', // '"{0}" was created successfully'
                'newItemCreatedGeneral': '데이터가 저장되었습니다.', // 'The item was created successfully',
                'uploadSaved': '업로드 데이터 저장을 완료하였습니다.',
                'deleted' : '"{0}"(이)가 삭제되었습니다.', // '"{0}" was deleted successfully'
                'deletedGeneral' : '데이터가 삭제되었습니다.', // 'The item was deleted successfully'
                'updated' : '"{0}"(이)가 저장되었습니다.', // '"{0}" was saved successfully'
                'updatedGeneral' : '데이터가 저장되었습니다.', // 'The item was saved successfully'
                'saveError' : 'The below errors occured whilst saving your changes:',
                'noExcelFile' : 'Please upload a valid Excel file (.xlsx)!',
                'selectItem' : '원하는 항목을 체크 선택해주세요.',
                'notSupportHtml5' : 'Sorry! Your browser does not support HTML5.',
                'invalidSelectedFiles' : '선택한 파일이 없습니다.',
                'clickFileButton' : '파일열기 버튼을 눌러 업로드 파일을 선택해 주십시오.',
                'confirmDelete' : '정말 삭제하겠습니까{0}?',
                'errorDeleteting' : 'The below errors occured whilst sdeleting the item:',
                'deleting' : 'Deleting...',
                'errorLoading' : 'Unable to retrieve data from the server.\r\n Please contact your system administrator',
                'sessionExpired' : 'The session expired. please login to continue.',
                'relogin' : 'Your Session has expired. Please log in again',
                'renewSession' : 'Your Session has expired. Please log in again to renew your session',
                'duplicated' : '아래건(들)이 이미 존재하여 추가되지 않았습니다.\r\n{0}',
                'requestFinished': '요청한 작업을 완료하였습니다.',
                'noItemCreated' : '1개 이상의 항목을 등록하십시오.',
                'balanceIsMinus' : '잔량이 음수인 값이 있습니다.',
                'inWarehouseConfirm' :  '정말 입고 내용을 저장하시겠습니까?'
            },
            'entryError' : {
                'concurrency' : '입력한 Code나 Key가 중복되어 데이터를 저장할 수 없습니다.',
                'deleteByConcurrency' : '해당 데이터를 참조하고 있는 관련 데이터가 존재하여 삭제를 할 수 없습니다. ',
            },
            'validate' : {
                'required' : '필수 입력(선택) 항목입니다.',
                'minNumber' : '{0}이상 입력하십시오.',
                'maxNumber' : '{0}이하 입력하십시오.',
                'pattern' : '입력형식 오류입니다.',
                'number' : '숫자 오류입니다. {0}',
                'decimal' : '(소숫점 최대{0}자리)',
                'error' : '오류'
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
                'errorConfirm' : '오류 알림',
                'duplicated' : '중복 오류 알림',
                'deleteConfirm' : '삭제 알림',
                'inWarehouseConfirm' : '입고 확인',
                'yesOrNo': '확인',
                'creater' : '등록',
                'lastUpdater' : '최종수정'
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
                'new' : '신규',
                'print' : '인쇄',
                'add' : '추가',
                'finish': '종결',
                'yes': '예',
                'no': '아니오',
                'ok': '확인'
            },
            'menu': {
                'menuButton' : '부가 기능',
                'addNewItem' : '신규 등록', // 'Add New Item',
                'exportExcelFile' : '엑셀 다운로드', // 'Export Excel File',
                'printList' : '인쇄', // 'Print List',
                'upload' : '업로드', // 'Upload',
                'productLookUp' : '상품 조회',
                'purchaseOrderLookup' : '발주 조회'
            },
            'form': {
                'createdDateFrom' : '등록일 시작',
                'createdDateTo' : '등록일 종료'
            },
            'tableHeader': {
                'id' : 'ID',
                'code' : '코드',
                'name' : '이름',
                'webSite' : '웹사이트',
                'activated' : '활동',
                'memo' : '메모',
                'createdUtc' : '등록일'
            }
        },
        'page': {
            'title': {
                'login': 'LOGIN TO YOUR ACCOUNT'
            }
        },
        'navi' : {
            'group' : {
                'product': '상품',
                'config': '환경설정'
            },
            'purchase' : {
                'group' : '발주',

                'entry': '발주서 작성',
                'list' : '발주서 목록',
                'inWarehousePending' : '미입고 현황',
                'cancel' : '반품/취소 목록',
                'cancelEntry' : '반품/취소 작성'
            },
            'inWarehouse' : {
                'group' : '입고',

                'entry': '입고서 작성',
                'list' : '입고 목록',
                'status' : '입고 현황',
            },
            'product' : {
                'home' : '상품',
                'productHome' : '상품',
                'productGroup' : '상품 그룹',
                'productVariant' : '상품',
                'product' : '상품',
                'products' : '상품 목록',
                'invetoryGroup' : '재고 목록',
                'inventoriesBalance' : '재고 조회',
                'inventoriesWarehouse' : '창고별 재고',
                'inventoriesHistory' : '품목별 재고기록'
            },
            'company' : {
                'group' : '기초코드-회사',

                'list' : '고객사',
                'groupList' : '고객사 그룹',
                'branch' : '지점',
                'vendor' : '거래처',
                'warehouse' : '창고',
                'paymentMethod': '결제 수단'
            },
            'basic' : {
                'group' : '기초코드-기타',

                'currency' : '외국 화폐',
                'country' : '국가 코드',
                'carrier' : '캐리어'
            },
            'secure' : {
                'group' : '보안 설정',
                'user' : '사용자',
                'role' : '권한'
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
        },
        'production' : {
            'productEditor': {
                'tabBasicInfo' : 'Basic Info',
                'tabClass' : '분류',
                'tabInventory' : 'Inventory'
            }
        },
        'purchasing' : {
            'purchaseOrders': {
                'noItem' : '발주서 상품등록을 하지 않아서 입고 및 종결처리를 할 수 없습니다.',
                'noPayment' : '발주서 결제정보를 입력하지 않아서 종결처리를 할 수 없습니다.',
                'pendingInWarehouse' : '입고처리를 완료하지 않아서 종결처리를 할 수 없습니다.',
                'closed' : '발주서 종결처리를 완료 하였습니다.',
                'opened' : '발주서 종결처리를 취소 하였습니다.',
                'noItemToPrint' : '발주서 상품등록을 하지 않아서 인쇄를 할수 없습니다.',
                'confirmOpen' : '정말 종결완료된 발주서를 종결취소를 진행 하겠습니까?',
                'confirmClose' : '정말 발주서 종결처리를 진행하겠습니까?'
            },
            'purchaseOrderItems': {
                'id' : 'ID',
                'name' : 'Name',
                'quantity': '수량',
                'price': '가격',
                'amount' : '소계',
                'discount' : '할인',
                'appliedCost' : '적용원가',
                'otherCurrencyPrice' : '가격',
                'remark' : '비고'
            },
            'purchaseOrderPayments': {
                'paymentMethodId' : '결제',
                'amount' : '금액',
                'remarkId': '승인번호'
            },
            'previewPurchaseOrder': {
                'freight' : 'freight',
                'addedDiscount' : 'Discount',
                'tax' : 'Tax',
                'subTotal' : 'Sub Total',
                'grandTotal' : 'Total',
                'payments' : 'Payments'
            },
            'purchaseOrdersHeader': {
                'id': 'ID',
                'vendorName': '벤더',
                'itemsName': '제품',
                'warehouse': '창고',
                'totalAmount': '총액',
                'paymentsName': '결제',
                'inWarehouseStatusLink': '입고',
                'finishLink' : '종결',
                'printLink': '인쇄'
            },
            'inWarehouseItems': {
                'id' : '품목',
                'vendor': '벤더',
                'name' : '품명',
                'quantity': '입고 갯수',
                'cancel': '취소 갯수',
                'balance': '잔량',
                'remark' : '비고',
                'price' : '단가',
                'quantityDue' : '계',
                'selectWarehouseFirst' : '입고 창고를 먼저 선택하십시오.'
            },
            'inWarehousesHeader': {
                'id': 'ID',
                'vendors': '벤더',
                'items': '품명',
                'quantity': '수량',
                'totalAmount': '총액',
                'warehouse': '창고'
            },
            'inWarehouseStatusHeader': {
                'productVariantId': '품목 ID',
                'itemName': '품명',
                'quantity': '수량',
                'balance': '잔량',
                'inWarehouseId': '입고 ID'
            },
            'inWarehousePendingHeader': {
                'id': '발주 ID',
                'warehouse': '창고',
                'vendor': '벤더',
                'memo': '메모',
                'finishLink' : '종결',
                'itemName': '품명',
                'quantity': '수량',
                'balance': '잔량',
                'price': '단가',
                'due': '계',
                'remark': '비고'
            }            
        }
    }
};

