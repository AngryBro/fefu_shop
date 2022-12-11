const PhoneParse = phone => {
    phone = phone.replace('7','');
    return `+7 (${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6,8)}-${phone.slice(8,10)}`;
};

export default PhoneParse;