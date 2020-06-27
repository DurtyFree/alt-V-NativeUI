Number.isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
};
export const fixFloat = (n) => {
    return Number.isInteger(n) ? n : parseFloat(n.toFixed(10));
};
