import { decoderRsmObjectId, RsmObjectWithName, RsmObjectId, RsmObject } from "../rsm_types/index.js";
import { object, string, number, array, anyJson, Decoder, optional } from "yuyaryshev-json-type-validation";

export const validationErrorCodes = {
    VE0001: "Система чисто пассивная - не может никого вызывать (например БД, Kafka)",
    VE0002: "Система чисто активная - ее нельзя вызывать (например Informatica)",
    VE0003: "Система под вывод - нельзя красить в фиолетовое",
    VE0004: "Запрет на добавление новых портов и/или какой-то механизм обращения внимания на такие системы",
    VE0005: "SignModule - интеграции из модулей НИБ можно из других систем - нельзя",
    VE0006: "Запрет на прямые интеграции PVLAN → WAN",
    VE0007: "Проверка наличия интеграции с ArchSite хотя бы в одном из виженов",
    VE0008: "Должен присутствовать CL2, если есть Альфа-мобайл",
    VE9001: "Некорректный вызов Api - в переданном объекте отсутствуют или не корректны какие-то поля. См additionalMessage для более подробного описания.",
    VE9002: "Ошибка (Exception) внутри функции валидатора.",
    VE9003: "Не обработаннй Exception на сервере при обработке запроса.",
};

export type ValidationErrorCode = keyof typeof validationErrorCodes;

export interface ValidationError {
    errorCode: ValidationErrorCode;
    object: RsmObject | RsmObjectWithName; // Объект на котором нужно показать ошибку
    additionalMessage?: string;
}

export interface ValidationErrorFlattened {
    errorCode: string;
    objectId?: RsmObjectId | undefined; // Объект на котором нужно показать ошибку
    additionalMessage?: string;
}

export const decoderValidationErrorFlattened: Decoder<ValidationErrorFlattened> = object({
    errorCode: string(),
    objectId: optional(decoderRsmObjectId),
    additionalMessage: optional(string()),
});

export function flattenValidationError(validationError: ValidationError): ValidationErrorFlattened {
    let { object, ...rest } = validationError;
    const r: ValidationErrorFlattened = { ...rest, objectId: object.id };
    return r;
}
