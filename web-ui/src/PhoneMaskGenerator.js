const PhoneMaskGenerator = (number) => {
    var str = '';
    number = number.replace('7','');
    var digits = {'0':1, '1': 1, '2': 1,'3': 1,'4': 1,'5': 1,'6': 1,'7': 1,'8': 1,'9': 1};
    for(let i = 0; i < number.length; i++) {
        if(number[i] in digits) {
            str += number[i];
        }
    }
    number = str;
    var group1 = number.slice(0,3);
    var group2 = number.slice(3, 6);
    var group3 = number.slice(6,8);
    var group4 = number.slice(8,10);
    var masked = `+7 (${group1}${number.length>3?') ':''}${group2}${number.length>6?'-':''}${group3}${number.length>8?'-':''}${group4}`;
    var result = masked==='+7 ('?'':masked;
    return result;
}

export default PhoneMaskGenerator;