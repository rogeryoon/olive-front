import { OliveConstants } from '../classes/constants';
import { isNumber } from './string-helper';
import { numberFormat } from './number-helper';

/**
 * 입력 문자열의 부피궤적을 반환
 * @param volumeString 문자열
 * @returns 부피궤적 또는 에러 Null을 반환
 */
export function volume(volumeString: string): number | null {
    const stringValues = volumeString.trim().split(/[ ,]+/).filter(Boolean);

    if (
        stringValues.length === 3 &&
        isNumber(stringValues[0], 2) &&
        isNumber(stringValues[1], 2) &&
        isNumber(stringValues[2], 2)
    ) {
        return +(+stringValues[0] * +stringValues[1] * +stringValues[2]).toFixed(2);
    }

    return null;
}

/**
 * 부피 무게 문자를 빌드
 * @param volumeCtrl 
 * @param weightTypeCtrl 
 * @param lengthTypeCtrl 
 * @returns  부피 무게 표현 문자열
 */
export function renderVolumeWeight(volumeCtrl: any, weightTypeCtrl: any, lengthTypeCtrl: any) {
    if (volumeCtrl && weightTypeCtrl && weightTypeCtrl.selected && lengthTypeCtrl && lengthTypeCtrl.selected) {
        const volumeValue = volume(volumeCtrl.value);
        const weightTypeCode = weightTypeCtrl.selected.value;
        const lengthTypeCode = lengthTypeCtrl.selected.value;

        if (volumeValue != null) {
            const symbol = OliveConstants.weightTypes.find(e => e.code === weightTypeCode).symbol;

            const volumeWeightValue = numberFormat(volumeWeight(volumeValue, lengthTypeCode, weightTypeCode), 2);

            return `${volumeWeightValue} ${symbol}`;
        }
    }
    return '';
}

/**
 * 부피무게 구하기
 * @param volumeValue 
 * @param lengthTypeCode 
 * @param weightTypeCode 
 * @returns weight 
 */
export function volumeWeight(volumeValue: number, lengthTypeCode: string, weightTypeCode: string): number {

    let inchVolume = volumeValue;
    // Centimeter
    if (lengthTypeCode === 'C') {
        inchVolume = volumeValue * OliveConstants.unitConversionRate.centimeterToInchVolume;
    }

    const poundVolumeWeight = +(inchVolume / 166).toFixed(2);

    let returnVolumeWeight = poundVolumeWeight;
    // Kilogram
    if (weightTypeCode === 'K') {
        returnVolumeWeight = poundVolumeWeight * OliveConstants.unitConversionRate.poundToKilo;
    }

    return +(returnVolumeWeight).toFixed(2);
}
