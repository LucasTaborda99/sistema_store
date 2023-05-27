// Arquivo de constantes globais

export class GlobalConstants {
    // Mensagem
    public static genericError: string = 'Algo deu errado, tente novamente mais tarde';

    //
    public static unauthorized: string = 'Seu usuário não tem acesso à essa página'

    // Regex
    public static nomeRegex: string = '^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9 ]+$';
    public static emailRegex: string = '^[A-Za-zÀ-ÿ0-9._%+-]+@[A-Za-zÀ-ÿ0-9.-]+\\.[A-Za-zÀ-ÿ]{2,3}$';
    public static numeroContatoRegex: string = '^[ 0-9\-\+\(\)]*$';

    // Variáveis
    public static error: string = 'error';
}
