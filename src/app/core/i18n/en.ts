export const locale = {
    lang: 'en',
    data: {
        'common' : {
            'status': {
                'inWarehousePending' : '입고 대기',
                'inWarehouseComplete' : '입고 완료',
                'inItemEntry' : '상품 등록',
                'canceled': '취소',
                'shipped': '배송중',
                'pending': '준비',
                'itemChanged': '상품변경'
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
                'saveError' : 'The below errors occurred whilst saving your changes:',
                'notSupportHtml5' : 'Sorry! Your browser does not support HTML5.',
                'invalidSelectedFiles' : '선택한 파일이 없습니다.',
                'clickFileButton' : '파일열기 버튼을 눌러 업로드 파일을 선택해 주십시오.',
                'selectImportFile' : '원하는 파일을 선택하여 주십시오.',
                'confirmDelete' : '정말 삭제하겠습니까{0}?',
                'errorDeleting' : 'The below errors occurred while deleting the item:',
                'deleting' : 'Deleting...',
                'errorLoading' : 'Unable to retrieve data from the server.\r\n Please contact your system administrator',
                'sessionExpired' : 'The session expired. please login to continue.',
                'reLogin' : 'Your Session has expired. Please log in again',
                'renewSession' : 'Your Session has expired. Please log in again to renew your session',
                'duplicated' : '아래건(들)이 이미 존재하여 추가되지 않았습니다.\r\n{0}',
                'requestFinished': '요청한 작업을 완료하였습니다.',
                'noItemCreated' : '1개 이상의 항목을 등록하십시오.',
                'balanceIsMinus' : '잔량이 음수인 값이 있습니다.',
                'validationError' : '입력 오류가 있습니다. 기입항목(들)을 확인하십시오.',
                'chooseOption' : '선택', // 'Choose an option',
                'emptyFile' : '내용이 없는 빈 파일입니다.',
                'invalidFile' : '업로드 형식에 맞지 않는 파일입니다.',
                'errorOccurred' : '작업도중 오류가 발생하였습니다.',
                'uploadColumnMatchError' : '엑셀{0}열 이름이 같지 않습니다. 입력열[{1}] | 설정열[{2}]',
                'uploadDataSignatureUnregistered' : '등록되지 않은 양식입니다. 관리자에게 문의하십시오.',
                'areYouSure' : '정말로 요청작업을 진행하겠습니까?',
                'outOfStock' : '{0}건이 재고부족으로 출고가 되지 않았습니다.',
                'cancelOrderShipOutInventory': '할당된 출고 재고를 취소',
                'assignOrderShipOutInventory': '재고를 할당하여 출고가능 처리',
                'outOfStockStatus': '재고 부족',
                'noWeightInputStatus': '무게 미입력',
                'customsTypeEntryStatus': '통관타입 미입력',
                'noProductPriceInput' : '상품 가격 미입력',
                'sameTypeMaxQuantityStatus' : '{0}-갯수제한({1})',
                'oneItemMaxQuantityStatus' : '{0}-제품별 갯수 {1}개 초과({2})',
                'totalMaxPriceStatus' :  '{0} ${1} 초과({2})',
                'copyAllToEmptyCell' : '해당값을 모든 공란 셀에 복사합니다.'
            },
            'entryError' : {
                'concurrency' : '입력한 Code나 Key가 중복되어 데이터를 저장할 수 없습니다.',
                'concurrencyKeyName' : '입력한 키 \'{0}\'(이)가 기존 데이터값과 중복되어 데이터를 저장할 수 없습니다. \'{0}\'(을)를 다른값으로 변경하십시오.',
                'deleteByConcurrency' : '해당 데이터를 참조하고 있는 관련 데이터가 존재하여 삭제를 할 수 없습니다. ',
                'volumeError' : '(예: 12.5 5 9)와 같은 형식으로 입력하십시오.'
            },
            'validate' : {
                'required' : '필수 입력(선택) 항목입니다.',
                'minNumber' : '{0}이상 입력하십시오.',
                'maxNumber' : '{0}이하 입력하십시오.',
                'pattern' : '입력형식 오류입니다.',
                'number' : '숫자 오류입니다. {0}',
                'decimal' : '(소숫점 최대{0}자리)',
                'error' : '오류',
                'requiredAny' : '{0}중 최소 한곳에 입력하십시오.',
                'customsMatch' : '[{0}]만 입력 가능',
                'customsDuplicated': '[{0}]을 중복입력했습니다.',
                'customsRequired': '[{0}]중 1개만 입력하십시오.',
                'customsOneType': '[{0}]중 1개만 입력하십시오.',
                'range': '{1}은(는) {0}보다 큰숫자를 입력하여야 합니다.',
                'rangePlusCurrentValue': '{1}은(는) {0}보다 큰숫자를 입력 / {2}는 {0}와(과){1}의 범위안의 숫자를 입력하세요.',
                'requiredAllOrNoneNames' : '{0}모두 입력하거나 아니면 모두 공란이 되어야 합니다.',
                'wrongTrackingNumber' : '올바른 송장번호 형식이 아닙니다.',
                'duplicatedCarrierTrackingNumberExists': '입력한 송장번호 범위가 다른 데이터 송장번호와 중첩되어 저장할수 없습니다. 확인하고 다시 입력하세요.',
                'trackingNumberInvalid': '입력한 송장번호가 다른 주문에 사용하고 있거나 자동발급 송장번호를 임의 수동지정하였습니다. 확인하고 다시 입력하세요.'
            },
            'title' : {
                'addNewItem' : '{{title}} 등록',
                'editItem' : '{{name}}',
                'itemDetails' : '{{name}}',
                'success' : '작업 완료',
                'saveError' : '저장 오류 발생',
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
                'yesOrNo': '확인',
                'creator' : '등록',
                'lastUpdater' : '최종수정',
                'validationError' : '입력 오류',
                'finalConfirm' : '최종확인',
                'selectWarehouses': '창고 선택',
                'selectDeselectAll': '모두 선택/해제', // Select/Deselect All
                'select': '선택',
                'pendingShipOut' : '대기',
                'shipOut' : '출고',
                'shippingLabelShippersEntry' : '발송회사 입력',
                'chooseItemOrItemsForName': '{0} 선택',
                'chooseItem': '아래 목록중 하나를 선택하세요.',
                'chooseItems': '해당하는 모든 아이템 선택하세요.',
                'currentItem': '-기존 선택:{0}',
                'saveConfirmTitle' : '최종 저장 확인'
            },
            'button': {
                'save' : '저장',
                'delete' : '삭제',
                'cancel' : '취소',
                'close' : '닫기',
                'openFile' : '파일 열기..',
                'refresh' : '새로고침',
                'confirmDelete' : '삭제알림',
                'select' : '선택',
                'new' : '신규',
                'print' : '인쇄',
                'add' : '추가',
                'finish': '종결',
                'yes': '예',
                'no': '아니오',
                'ok': '확인',
                'reset' : '리셋',
                'addRow' : '행추가',
                'load' : '불러오기',
                'shipOut' : '출고',
                'combineShip' : '합배송',
                'cancelCombineShip' : '합배송 취소',
                'cancelShipOut' : '출고 취소',
                'finishShipOutPackage' : '출고 완료',
                'misc' : '기타',
                'reIssueTrackingNumber' : '송장번호 재발급',
                'issueTrackingNumber' : '송장번호 발급',
                'filter' : '필터'
            },
            'menu': {
                'menuButton' : '부가 기능',
                'addNewItem' : '신규 등록', // 'Add New Item',
                'exportExcelFile' : '엑셀 다운로드', // 'Export Excel File',
                'printList' : '인쇄', // 'Print List',
                'upload' : '대량 업로드', // 'Upload',
                'productLookUp' : '상품 조회',
                'purchaseOrderLookup' : '발주 조회',
                'exportForTrackingNumberUpdate' : '엑셀 (판매 사이트 송장번호)',
                'printShippingLabel' : '운송장',
                'exportForLogistic' : '엑셀 (택배사 인계)',
                'printPackingList' : '팩킹 리스트',
                'printPickingList' : '피킹 리스트',
                'preAssignTrackingNumber' : '송장 선발급',
            },
            'form': {
                'createdDateFrom' : '등록일 시작',
                'createdDateTo' : '등록일 종료'
            },
            'tableHeader': {
                'id' : 'ID',
                'code' : '코드',
                'supplier' : '공급처',
                'itemsName' : '품명',
                'name' : '이름',
                'value' : '값',
                'webSite' : '웹사이트',
                'activated' : '활동',
                'memo' : '메모',
                'paymentsName' : '결제',
                'warehouse' : '창고',
                'createdUtc' : '등록일',
                'dueAmount' : '합계',
                'type' : '타입',
                'min' : '최소',
                'max' : '최대',
                'price':  '가격',
                'standPrice': '구매가',
                'interfaceName': '인터페이스',
                'imported': '상품/주문 연결 완료',
                'orderNumber':  '마켓 주문 #',
                'orderNumberShort':  '주문 #',
                'consignee': '수취인',
                'quantity' : '수량',
                'productMatched': '상품 연결',
                'orderTransferred': '주문 전환',
                'marketProduct' : '마켓 상품명',
                'linkedProducts' : '연결 상품',
                'excelColumn': '엑셀 열',
                'columnName' : '엑셀 열',
                'matchValue' : '매치 값',
                'partMatch' : '매치 옵션',
                'checkPartMatch' : '부분 매치',
                'matchSearch' : '상품 매치 포함',
                'checkMatchSearch' : '포함',
                'resetValue' : '매치 값 복원',
                'addProductsLink' : '상품 검색 / 추가',
                'status' : '상태',
                'orderer' : '주문인',
                'seller' : '판매자',
                'inventory' : '재고',
                'weightKiloGram' : '무게(Kg)',
                'combinedShipping': '합배송',
                'select' : '선택',
                'customsPrice' : '신고가',
                'availTrackingNumbers' : '가용번호',
                'carrier' : '캐리어',
                'branch' : '지점',
                'companyGroup' : '고객사 그룹',
                'preTrackingNumber': '선송장',
                'marketOrderNumber': '주문',
                'trackingNumber' : '송장',
                'order' : '주문',
                'shipOutStatus' : '비고',
                'customsTypeCode' : '통관 타입',
            },
            'word': {
                'branch': '지점',
                'id' : 'ID',
                'warehouse' : '창고',
                'memo' : '메모',
                'name' : '이름',
                'code' : '코드',
                'supplier' : '공급처',
                'itemsName' : '품명',
                'date' : '날짜',
                'quantity' : '수량',
                'price' : '가격',
                'standPrice' : '구매가',
                'productVariantName' : '타입',
                'generalProductVariantName' : '품명',
                'productGroupName' : '상품 그룹명',
                'remark' : '비고',
                'freight' : '배송비',
                'tax' : '세금',
                'webSite' : '웹사이트',
                'paymentMethod' : '결제수단',
                'phoneNumber' : '전화번호',
                'amount' : '금액',
                'address' : '주소',
                'email' : '이메일',
                'paymentAmount' : '결제금액',
                'refundAmount' : '환불금액',
                'productName' : '품명',
                'productType' : '타입',
                'dueAmount' : '합계',
                'hsCode' : 'HS 코드',
                'lengthType' : '단위',
                'volume' : '부피',
                'volumeWeight' : '부피 무게',
                'weightType' : '단위',
                'weight' : '무게',
                'customsItemName' : '세관 신고명',
                'customsPrice' : '세관 신고 가격',
                'customsTypeCode' : '통관 타입',
                'excel': '엑셀',
                'marketSeller' : '판매자',
                'consigneeName' : '받는사람',
                'customsName' : '통관인',
                'customsId' : '통관부호',
                'buyerCellPhoneNumber': '구매자 휴대폰',
                'consigneeCellPhoneNumber': '받는사람 휴대폰',
                'consigneePhoneNumber2': '받는사람 전화번호',
                'deliveryMemo': '배송 메모',
                'address1': '주소 1',
                'address2': '주소 2',
                'city': '구/군',
                'state': '시/도',
                'postalCode': '우편번호',
                'country': '국가',
                'orderStatus': '상태',
                'marketOrderNumber': '마켓 주문번호',
                'marketSellerCode': '마켓 셀러 코드',
                'marketOrdererName': '마켓 주문인',
                'marketOrderDate': '마켓 주문일',
                'marketOrderDescription': '마켓 품명',
                'canceledUser': '취소정보',
                'return': '반품',
                'purchaseReturnOrCancel': '발주 반품/취소',
                'cancelOrder': '주문 취소',
                'restoreOrder': '변경 (배송준비)',

                'productGroupWeight' : '상품 그룹 무게',
                'productVariantWeight' : '상품 무게',
                'productOverrideWeight' : '예외적용 무게',

                'productGroupCustomsPrice' : '상품 그룹 신고가',
                'productVariantCustomsPrice' : '상품 신고가',
                'productOverrideCustomsPrice': '예외적용 신고가',

                'nickName': '별명',
                'companyName': '회사명',
                'default': '기본',
                'productCustomsPrice': '세관 신고 가격',
                'productGroup': '상품 그룹',
                'selectedItems': '선택 아이템',
                'brand': '브랜드',
                'category': '카테고리',
                'tag': '테그',
                'company': '회사',
                'purchase': '발주',
                'companyGroup': '고객사 그룹',
                'carrier': '캐리어',
                'fromTrackingNumber': '시작 송장번호',
                'toTrackingNumber': '끝 송장번호',
                'lastTrackingNumber': '마지막 사용 송장번호',
                'availTrackingNumbers' : '가용번호',
                'preTrackingNumber': '선송장',
                'trackingNumber' : '송장번호',
                'oldTrackingNumber' : '변경전 송장번호',
                'splitOrder' : '주문 분할/복사',
                'splitOrderCount' : '주문 분할/복사 갯수'
            }
        },
        'page': {
            'title': {
                'login': 'LOGIN TO YOUR ACCOUNT'
            }
        },
        // 메뉴 카테고리로 구분
        'navi' : {
            'group' : {
                'product': '바보',
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
                
                'inventoryGroup' : '재고 목록',
                'inventoriesBalance' : '재고 조회',
                'inventoriesWarehouse' : '창고별 재고',
                'inventoriesHistory' : '품목별 재고기록'
            },
            'company' : {
                'group' : '기초코드-회사',

                'list' : '고객사',
                'groupList' : '고객사 그룹',
                'branch' : '지점',
                'supplier' : '공급처',
                'warehouse' : '창고',
                'paymentMethod': '결제 수단',
                'market': '판매처',
                'marketSeller': '판매자'
            },
            'basic' : {
                'group' : '기초코드-기타',

                'currency' : '외국 화폐',
                'country' : '국가 코드',
                'carrier' : '캐리어',
                'standCarrier' : '시스템 캐리어',
                'carrierTrackingNumberRange' : '캐리어 송장번호'
            },
            'sales' : {
                'group' : '판매',

                'orderList' : '주문 목록',
                'shipOutPackageLister' : '출고 리스팅',
                'marketExcels' : '판매처 엑셀',
                'marketExcelRows' : '판매처 엑셀',
                'matchItems': '판매처 상품 연결'
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
                'items': '상품',
                'delivery': '배송',
                'order': '주문'
            },
            'error' : {
                'entryTooltip' : '입력오류가 있습니다.'
            }
        },
        'configs' : {
            'roleManagement': {
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
            'roleEditor': {
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
            'userManagement': {
                'Search': 'Search for user',
                'NewUser': 'New User',
                'Edit': 'Edit User',
                'Delete': 'Delete User',
                'EditUser': 'Edit User "{{name}}"',
                'CompanyGroup': 'Company Group',
                'UserName': 'User Name',
                'FullName': 'Full Name',
                'Email': 'Email',
                'Roles': 'Roles',
                'PhoneNumber': 'Phone Number'
            },
            'userEditor': {
                'JobTitle': 'Job Title',
                'UserName': 'User Name',
                'UserNameRequired': 'User name is required (minimum of 2 and maximum of 200 characters)',
                'CompanyGroupName': '고객사 그룹 선택',
                'CompanyGroupNameRequired': '오른쪽 돋보기를 클릭하여 고객사 그룹을 선택하세요.',
                'Password': 'Password',
                'PasswordHint': 'Your password is required when changing user name',
                'CurrentPasswordRequired': 'Current password is required',
                'Email': 'Email',
                'EmailRequired': 'Email address is required (maximum of 200 characters)',
                'InvalidEmail': 'Specified email is not valid',
                'ChangePassword': 'Change Password',
                'CurrentPassword': 'Current Password',
                'NewPassword': 'New Password',
                'NewPasswordRequired': 'New password is required',
                'NewPasswordRules': 'The new password must contain at least: one uppercase letter, one lowercase letter, one digit, and any special character',
                'ConfirmPassword': 'Confirm Password',
                'ConfirmationPasswordRequired': 'Confirmation password is required',
                'PasswordMismatch': 'New password and confirmation password do not match',
                'Roles': 'Roles',
                'FullName': ' Full Name',
                'RoleRequired': ' Role is required',
                'PhoneNumber': 'Phone Number',
                'Enabled': 'Enabled',
                'Unblock': 'Unblock',
                'Close': 'Close',
                'Edit': 'Edit',
                'Cancel': 'Cancel',
                'Save': 'Save',
                'Saving': 'Saving...'
            }
        },
        'production' : {
            'productEditor': {
                'tabBasicInfo' : 'Basic Info',
                'tabClass' : '분류',
                'tabInventory' : 'Inventory'
            },
            'inventoryBalances': {
                'inTransitQuantity' : '주문'
            }
        },
        'sales': {
            'pendingOrderShipOutList' : {
                'selectDeliveryInfoTitle' : '다중 배달 정보 발견',
                'selectDeliveryInfoDescription' : '어떤 배달 정보를 사용할것인지 선택하세요',
                'confirmCombinedShipExists' : '합배송 처리 하지 않은 합배송 대상건이 있습니다. 합배송처리하지 않고 출고하겠습니까?',
                'selectProductTitle' : '상품 선택',
                'selectProductDescription' : '원하는 상품을 선택하세요',
                'priorityOrders' : '입력 값 우선 순위',
                'orderShipOutDataNotExistsErrorMessage' : '출고 요청중에 유효하지 않은 주문건(다른 사용자가 이미 출고/취소)이 존재합니다. 확인을 클릭하면 출고작업을 초기화합니다.',
                'confirmNeedHsCodeEntry': '출고하려면 상품 {0}가지 HS CODE를 입력해야 합니다. 입력하겠습니까?',
                'productHsCodeEditorTitle': 'HS 코드 입력',
                'productCustomsTypeCodeEditorTitle': '통관 타입 입력 - 예: {0}',
                'confirmNeedCustomsTypeCodeEntry': '출고하려면 상품 {0}가지 통관 타입을 입력해야 합니다. 입력하겠습니까?',
                'confirmNoCarrierTrackingNumbersGroupsMessage' : '선발급할 송장번호가 없습니다. 새로 등록하시겠습니까?',
                'selectCarrierTrackingNumbersGroupsTitle' : '송장발급 그룹 선택',
                'selectCarrierTrackingNumbersGroupsDescription' : '원하는 송장발급 그룹을 선택하세요',
                'confirmFoundPreAssignedCarrierTrackingNumberMessage' : '선택한 주문에 이미 등록된 송장번호가 있습니다. 이미 등록된 송장번호를 새 송장번호로 업데이트하겠습니까?',
                'trackingNumbersShortageErrorMessage': '새로 발급할 송장번호가 부족합니다. 새로 등록하시겠습니까?',
                'allOrderHaveTrackingNumbers' : '더이상 송장발급을 할 대상이 없습니다.',
                'confirmIssueOnlyNoTrackingOrders' : '선택한 주문이 없습니다. 발급하지 않은 주문송장만 발급하겠습니까?',
                'confirmRefreshAfterSplitOrders' : '분할 배송저장이 완료되었습니다. 출고 리스팅을 모두 갱신합니다.',
                'fileName' : '출고 대기'
            },
            'pendingOrderShipOutPackageList' : {
                'finalFinishConfirmMessage' : '출고 마감처리 합니다. 확실합니까?',
                'clickAddButtonForOneItem' : '선택건만 수정하려면 추가를 클릭하세요.',
                'clickAddButtonForItems' : '다른 선택또는 해당건만 수정하려면 추가를 클릭하세요.',
                'warningForUpdateAll' : '아래 내용을 수정/저장할 경우 연결된 모든 출고건들이 모두 업데이트됩니다.',
                'confirmCanNotProcessDueToNoCompanyContact': '해당 작업을 진행하려면 {0} 발송회사정보를 입력해야 합니다. 입력하겠습니까?',
                'shipperExcelFileName': '택배',
                'fileName' : '출고 확정'
            },
            'marketItemMappingExcelColumnsEditor' : {
                'notMatchOriginalValue' : '최초 엑셀에 저장되어 있던 (부분) 문자열이 아닙니다'
            },
            'marketExcelRows' : {
                'unmappedProductsTitle' : '상품연결 등록대상 건수',
                'linkProductMenu' : '상품 연결',
                'transferableOrdersTitle' : '주문 전환 대상 건수',
                'finalTransferOrdersConfirmMessage' : '정말 오픈마켓 엑셀 주문을 시스템 관리주문으로 전환할까요? 확실합니까?',
                'transferOrdersSuccessMessage' : '{0}건 주문전환이 완료되었습니다.',
                'transferOrders' : '주문 전환',
                'goToLinkProduct': '클릭하면 판매처상품을 자체 상품과 연결하는 페이지로 이동합니다.',
                'goToTransferOrders': '클릭하면 오픈마켓 엑셀 주문을 시스템 관리주문으로 전환합니다.',
                'transferableOrdersSubCount' : '총 주문 {0}건'
            },
            'marketItemMappings' : {
                'linkProductMenuJobDoneTitle' : '상품 연결 완료',
                'linkProductMenuJobDoneDescription' : '상품 연결 완료되어 업로드한 엑셀 페이지로 다시 돌아갑니다.',
            },
            'orderShipOutSplitterManager' : {
                'saveConfirmMessage' : '정말 주문 분할/복사를 저장하시겠습니까?',
                'saveUnmatchedConfirmMessage' : '원래 등록된 상품 갯수와 저장하려는 상품 총갯수가 일치 하지 않습니다. 그래도 주문 분할/복사를 진행할까요?'
            }
        },
        'purchasing' : {
            'purchaseOrder' : {
                'supplierOrderNo' : '공급자 주문 #',
                'currency' : '화폐',
                'currencyRate' : '환율'
            },
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
                'amount' : '소계',
                'discount' : '할인',
                'appliedCost' : '적용원가',
                'otherCurrencyPrice' : '가격',
                'addedDiscount' : '추가 전체할인',
                'finalAmount' : '최종금액'
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
                'totalAmount': '총액',
                'inWarehouseStatusLink': '입고',
                'finishLink' : '종결',
                'printLink': '인쇄',
                'paymentsName' : '결제'
            },
            'voidPurchaseOrderItems': {
                'quantity': '취소 갯수',
                'balance': '취소 잔량',
            },
            'voidPurchaseOrderManager': {
                'saveConfirmTitle' : '반품 / 취소 확인',
                'saveConfirmMessage' : '정말 반품/취소 환불내용을 저장하시겠습니까?'
            },
            'inWarehouseManager': {
                'saveConfirmTitle' : '입고 확인',
                'saveConfirmMessage' : '정말 입고 내용을 저장하시겠습니까?'
            },
            'inWarehouseItems': {
                'id' : '품목',
                'supplier': '공급처',
                'name' : '품명',
                'quantity': '검수량',
                'quantityDue': '금액',
                'balance': '입고 잔량',
                'remark' : '비고',
                'price' : '단가'
            },
            'inWarehousesHeader': {
                'id': 'ID',
                'suppliers': '공급처',
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
                'supplier': '공급처',
                'memo': '메모',
                'finishLink' : '종결',
                'itemName': '품명',
                'quantity': '수량',
                'balance': '잔량',
                'price': '단가',
                'due': '계',
                'remark': '비고'
            }
        },
        'support': {
            'carrier': {
                'standCarrier' : '시스템 배송사'
            },
            'marketEditor' : {
                'marketExcelInterface' : '인터페이스'
            }
        }
    }
};
