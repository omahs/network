export const debuglog = (msg: string, error?: any) => { // TODO pios
    if (error !== undefined) console.log(msg, error)
    //(error !== undefined) ? console.log(msg, error) : console.log(msg)
}