import { httpApiDefinition, httpApiFunction } from "yhttp_api";
import { string, number } from "yuyaryshev-json-type-validation";

type IdMap = Map<string, any>;
class ReconstructObjectContext {
    public idMap: IdMap = new Map();
    public antiLoop: Set<any> = new Set();

    reconstructObjectInIndex(obj: any, i: any, path: (string | number)[]): boolean {
        if (typeof obj[i] === "object" && !Array.isArray(obj[i]) && obj[i].id && Object.keys(obj[i]).length === 1) {
            const innerObj = this.idMap.get(obj[i].id);
            if (!innerObj) {
                throw new Error(`CODE00000001 ReconstructObject failed for path=${JSON.stringify([...path, i])} id='${obj[i].id}' - not found!`);
            }
            obj[i] = innerObj;
            return true;
        }
        return false;
    }

    reconstructObject(obj: any, path: (string | number)[] = []) {
        if (!this.antiLoop.has(obj)) {
            this.antiLoop.add(obj);

            if (typeof obj === "object") {
                if (Array.isArray(obj)) {
                    for (let i = 0; i < obj.length; i++) {
                        if (!this.reconstructObjectInIndex(obj, i, path)) {
                            this.reconstructObject(obj[i], [...path, i]);
                        }
                    }
                } else
                    for (let k in obj) {
                        if (!this.reconstructObjectInIndex(obj, k, path)) {
                            this.reconstructObject(obj[k], [...path, k]);
                        }
                    }
            }
        }
    }
}

export function reconstructObjectsArray(a: any) {
    if (!Array.isArray(a)) {
        throw new Error(`CODE00000002 ERROR reconstructObjectsArray failed - array expected!`);
    }

    const c = new ReconstructObjectContext();

    for (const item of a) {
        if (!item.id) {
            throw new Error(`CODE00000003 ERROR reconstructObjectsArray failed! Array contains elements without id!`);
        }
        c.idMap.set(item.id, item);
    }

    for (const item of a) {
        c.reconstructObject(item);
    }

    return a;
}
