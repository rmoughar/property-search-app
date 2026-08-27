export function isValidNumber(input){
    return typeof input === 'number' && Number.isFinite(input);
}