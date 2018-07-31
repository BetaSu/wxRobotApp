/**
 * 睡眠一段时间
 * @return {} 
 */
exports.sleep = function (millisecond = 1000, isRandom) {
    return new Promise(function (resolve, reject) {
        if (isRandom) {
            millisecond = Math.random() * millisecond
        }
        setTimeout(() => {
            resolve()
        }, millisecond)
    })
}