export interface PasswordEvaluateResponse {
    //      H = entropía en bits
    entropy: number,
    //      L = longitud de la contraseña
    length: number,
    //      N = tamaño del espacio de caracteres
    wordSpaceSize: number,
    //      S = fuerza de la contraseña (muy débil, débil, aceptable, fuerte, muy fuerte)
    strength: string,
    //      T = tiempo estimado para crackear la contraseña (en segundos, minutos, horas, días, años)
    crackTime: { seconds: number; minutes: number; hours: number; days: number; years: number }
}