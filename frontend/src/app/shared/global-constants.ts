export class GlobalConstants {
    // Mensagem
    public static genericError: string = 'Algo deu errado, tente novamente mais tarde';

    // Regex
    public static nomeRegex: string = '[a-zA-Z0-9 ]*';
    public static emailRegex: string = '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}';
    public static numeroContatoRegex: string = '^[e0-9]{10,10}$';

    // Variáveis
    public static error: string = 'error';
}
