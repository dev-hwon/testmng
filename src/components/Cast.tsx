const number = (value: string) => {
  const result = Number(value)
    if (!Number.isNaN(result)) {
        return result
    } else { 
        return 0;
    }

}

const string = (value: string) => value

const boolean = (value: string) => {
    switch (value) {
        case 'true': {
            return true
        }
        case 'false': {
            return false
        }
        default:
            return false
  }
}

interface typeInterface {
    [prop: string]: any;
}
const typeConverter:typeInterface = { number, string, boolean }

// 값, 타입, 기본값
const cast = (key: string | undefined, type: string, defaultValue: string | number | boolean) => {
    if (key === undefined) {
        key = '';
    }
    const value = process.env[key]
    if (value !== undefined) {
        const result = typeConverter[type](value)
        if (result !== undefined) {
            return result
        }
        throw new Error(`${value}에 적절한 값을 설정하지 않았습니다`)
    }
    if (defaultValue !== undefined) {
        return defaultValue
    } 
    throw new Error(`${value}에 할당할 값이 없습니다`)
}

export default cast;