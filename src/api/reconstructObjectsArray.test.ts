import { expectDeepEqual } from "ystd";
import { reconstructObjectsArray } from "./reconstructObjectsArray.js";

describe("rsm_checks_module/api/reconstructObjectsArray.test.ts", () => {
    it("reconstructObjectsArray", () => {
        const o1: any = { id: 1, x: 111, refTo2: { id: 2 } };
        const o2: any = { id: 2, y: 222, refTo1: { id: 1 } };
        const o3: any = { id: 3, y: 222, deepRef: { a: [{ b: { c: { refTo1: { id: 1 } } } }] } };

        const input = [o1, o2, o3];

        reconstructObjectsArray(input);

        expectDeepEqual(o1.refTo2.y, 222);
        expectDeepEqual(o2.refTo1.x, 111);
        expectDeepEqual(o3.deepRef.a[0].b.c.refTo1.x, 111);
    });

    it("reconstructObjectsArray exception if not found", () => {
        const o1: any = { id: 1, x: 111, refTo2: { id: "FAILED_REF" } };
        const o2: any = { id: 2, y: 222, refTo1: { id: 1 } };
        const o3: any = { id: 3, y: 222, deepRef: { a: [{ b: { c: { refTo1: { id: 1 } } } }] } };

        const input = [o1, o2, o3];
        let expectedError;

        try {
            reconstructObjectsArray(input);
        } catch (e: any) {
            expectedError = e;
        }

        expectDeepEqual(expectedError.message, `CODE${"00000001"} ReconstructObject failed for path=["refTo2"] id=\'FAILED_REF\' - not found!`);
    });

    it("reconstructObjectsArray case3", () => {
        const makeInput = () => [
            {
                type: "System",
                name: "НИБ.Эквайринг",
                description: "НИБ.Эквайринг - это модуль НИБа, отвечающий за интернет эквайринг и торговый эквайринг",
            },
            {
                type: "System",
                name: "SignModule",
                description: "Это модуль НИБа отвечающий за электронные подписи",
            },
            {
                type: "System",
                name: "PartnerSystem",
                description: "Это система партнера",
            },
        ];
        const input = makeInput();
        let expectedError;
        try {
            reconstructObjectsArray(input);
        } catch (e: any) {
            expectedError = e;
        }

        expectDeepEqual(expectedError.message, `CODE${"00000003"} ERROR reconstructObjectsArray failed! Array contains elements without id!`);
    });
});
