const roundNumber = (number, precision = 2) => {
    const factor = Math.pow(10, precision)
    const tempNumber = number * factor
    const roundedTempNumber = Math.round(tempNumber)
    console.log('roundedTempNumber :>> ', roundedTempNumber);
    return roundedTempNumber / factor
}

export default roundNumber