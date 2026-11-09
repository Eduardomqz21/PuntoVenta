/**
 * Módulo de Seguridad y Sanitización - Novedades Ameyalli
 * Provee funciones para prevenir inyecciones XSS, validar tipos de datos,
 * proteger contra ataques de fuerza bruta y asegurar subidas de archivos.
 */

const crypto = require('crypto');

// Almacén en memoria para limitar intentos de acceso por fuerza bruta (Rate Limiting)
const loginAttempts = new Map();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutos
const MAX_LOGIN_ATTEMPTS = 5;

/**
 * Sanitiza una cadena de texto eliminando etiquetas HTML peligrosas y caracteres de control
 * para prevenir ataques de Cross-Site Scripting (XSS).
 * @param {string} str - Cadena a sanitizar
 * @param {number} maxLength - Longitud máxima permitida
 * @returns {string} - Cadena limpia
 */
function sanitizeText(str, maxLength = 255) {
    if (typeof str !== 'string') return '';
    // Eliminar etiquetas HTML y caracteres potencialmente peligrosos
    const cleaned = str
        .replace(/<[^>]*>?/gm, '') // Quita tags HTML <script>, <img>, etc.
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Quita caracteres de control invisibles
        .trim();
    return cleaned.slice(0, maxLength);
}

/**
 * Valida y convierte un valor a precio numérico positivo con máximo 2 decimales.
 * @param {any} val - Valor a validar
 * @param {number} min - Mínimo permitido
 * @param {number} max - Máximo permitido
 * @returns {number|null} - Número validado o null si es inválido
 */
function validatePrice(val, min = 0.01, max = 1000000) {
    const num = parseFloat(val);
    if (isNaN(num) || !isFinite(num) || num < min || num > max) {
        return null;
    }
    return Math.round(num * 100) / 100;
}

/**
 * Valida y convierte un valor a número entero no negativo para stock.
 * @param {any} val - Valor a validar
 * @param {number} min - Mínimo permitido (por defecto 0)
 * @param {number} max - Máximo permitido
 * @returns {number|null} - Entero validado o null si es inválido
 */
function validateStock(val, min = 0, max = 100000) {
    const num = parseInt(val, 10);
    if (isNaN(num) || !isFinite(num) || num < min || num > max) {
        return null;
    }
    return num;
}

/**
 * Valida número de teléfono mexicano (10 dígitos).
 * @param {string} phone - Teléfono a validar
 * @returns {boolean}
 */
function validatePhone(phone) {
    if (typeof phone !== 'string') return false;
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
}

/**
 * Verifica si una IP ha excedido el límite de intentos de login fallidos.
 * @param {string} ip - Dirección IP del cliente
 * @returns {{ allowed: boolean, remainingAttempts: number, waitMinutes: number }}
 */
function checkLoginRateLimit(ip) {
    const now = Date.now();
    const clientRecord = loginAttempts.get(ip);

    if (!clientRecord) {
        return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS, waitMinutes: 0 };
    }

    // Si la ventana expiró, limpiamos el historial
    if (now - clientRecord.firstAttemptTime > RATE_LIMIT_WINDOW_MS) {
        loginAttempts.delete(ip);
        return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS, waitMinutes: 0 };
    }

    if (clientRecord.count >= MAX_LOGIN_ATTEMPTS) {
        const remainingTimeMs = RATE_LIMIT_WINDOW_MS - (now - clientRecord.firstAttemptTime);
        const waitMinutes = Math.ceil(remainingTimeMs / 60000);
        return { allowed: false, remainingAttempts: 0, waitMinutes };
    }

    return { 
        allowed: true, 
        remainingAttempts: MAX_LOGIN_ATTEMPTS - clientRecord.count, 
        waitMinutes: 0 
    };
}

/**
 * Registra un intento de login fallido para una IP.
 * @param {string} ip - Dirección IP del cliente
 */
function recordFailedLogin(ip) {
    const now = Date.now();
    const clientRecord = loginAttempts.get(ip);

    if (!clientRecord || (now - clientRecord.firstAttemptTime > RATE_LIMIT_WINDOW_MS)) {
        loginAttempts.set(ip, { count: 1, firstAttemptTime: now });
    } else {
        clientRecord.count += 1;
    }
}

/**
 * Limpia los intentos de login para una IP tras un login exitoso.
 * @param {string} ip - Dirección IP del cliente
 */
function resetLoginAttempts(ip) {
    loginAttempts.delete(ip);
}

/**
 * Compara dos contraseñas en tiempo constante para mitigar ataques de temporización (Timing Attacks).
 * @param {string} a - Contraseña provista
 * @param {string} b - Contraseña esperada
 * @returns {boolean}
 */
function safeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
        // Ejecutar comparación simulada para mantener tiempo constante
        crypto.timingSafeEqual(bufA, bufA);
        return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = {
    sanitizeText,
    validatePrice,
    validateStock,
    validatePhone,
    checkLoginRateLimit,
    recordFailedLogin,
    resetLoginAttempts,
    safeCompare
};
