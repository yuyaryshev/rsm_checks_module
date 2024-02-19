export function pushNewValues<O extends Record<string, any>, K extends keyof O>(
    object: O,
    arrayField: K,
    ...values: (O[K] extends any[] ? O[K][number] : never)[]
) {
    if (!Array.isArray(object[arrayField])) {
        object[arrayField] = [] as any;
    }

    for (const value of values) {
        if (!object[arrayField].includes(value)) {
            object[arrayField].push(value);
        }
    }
}
