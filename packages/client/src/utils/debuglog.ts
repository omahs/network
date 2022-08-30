export const debuglog = (msg: string, error?: any) => { // TODO pios
    (error !== undefined) ? console.log(msg, error) : console.log(msg)
}