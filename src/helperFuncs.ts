export function rsmSystemId(systemName: string, id?: string) {
    return { id: id! };
}

export function isOneOf<T>(v: T, ...args: T[]) {
    return args.includes(v);
}

export const envFuncs = { isOneOf, rsmSystemId };
