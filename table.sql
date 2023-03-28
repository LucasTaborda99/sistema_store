// Criando tabela "user"
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(250),
    numero_contato VARCHAR(20),
    email VARCHAR(100),
    senha VARCHAR(250),
    status VARCHAR(20),
    role VARCHAR(20),
    UNIQUE (email)
);

// Inserindo registros na tabela "user"
INSERT INTO user (nome, numero_contato, email, senha, status, role) VALUES ('Admin', 123456789, 'admin123@gmail.com', 'admin', 'true', 'admin');

// Criando tabela "categoria"
CREATE TABLE categoria(
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(250) NOT NULL,
    PRIMARY KEY (id)
);