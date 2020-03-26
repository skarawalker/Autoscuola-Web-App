CREATE DATABASE autoscuola;

--Entity Tables
CREATE TABLE autoscuola.cliente (
    cod_fis CHAR(16) NOT NULL,
    nome VARCHAR(20) NOT NULL,
    cognome VARCHAR(30) NOT NULL,
    data_nascita DATE NOT NULL,
    data_iscrizione DATE NOT NULL,
    luogo_nascita VARCHAR(50) NOT NULL,
    telefono VARCHAR(25)
    PRIMARY KEY(cod_fis)
);

CREATE TABLE autoscuola.esame (
    id SERIAL NOT NULL ,
    tipo VARCHAR(10),
    data_e DATE,
    esito BOOLEAN,
    --R3: CLIENTE FA ESAME
    FOREIGN KEY(cliente) REFERENCES autoscuola.cliente(cod_fis) NOT NULL
    --R4: ESAME DI QUALE PATENTE
    FOREIGN KEY(pat) REFERENCES autoscuola.patente(nome_p)
    PRIMARY KEY(id)
);

CREATE TABLE autoscuola.patente (
    nome_p VARCHAR(5) NOT NULL,
    costo1 FLOAT NOT NULL, 
    costo2 FLOAT DEFAULT 0,
    PRIMARY KEY(nome_p)
);

CREATE TABLE autoscuola.guida (
    data DATE NOT NULL,
    ora HOUR NOT NULL,
    durata FLOAT,
    --R5: CLIENTE FA GUIDA
    FOREIGN KEY(cliente) REFERENCES autoscuola.cliente(cod_fis) NOT NULL,
    --R6: GUIDA DI PATENTE TIPO __
    FOREIGN KEY(pat) REFERENCES autoscuola.patente(nome_p),
    --R7: ISTRUTTORE CHE SEGUE GUIDA
    FOREIGN KEY(istruttore) REFERENCES autoscuola.istruttore(cf),
    PRIMARY KEY(data,ora,istruttore)
);

CREATE TABLE autoscuola.domanda (
    id_domanda SERIAL NOT NULL,
    testo TEXT[],
    risposta BOOLEAN NOT NULL,
    PRIMARY KEY(id_domanda)
);

CREATE TABLE autoscuola.istruttore (
    cf CHAR(16) NOT NULL,
    nome VARCHAR(20) ,
    cognome VARCHAR(30),
    telefono VARCHAR(20) NOT NULL,
    PRIMARY KEY(cf)
);

--Association Tables

--R1: CLIENTE CHE FA PATENTE
CREATE TABLE autoscuola.R1(
    acconto1 FLOAT DEFAULT 0,
    acconto2 FLOAT DEFAULT 0,
    FOREIGN KEY(id_c) REFERENCES autoscuola.cliente(cod_fis),
    FOREIGN KEY(id_p) REFERENCES autoscuola.patente(nome_p),
    PRIMARY KEY(id_c,id_p)
)

--R2: CLIENTE CHE HA GIA' ALMENO UNA PATENTE
CREATE TABLE autoscuola.R2(
    data_scadenza DATE NOT NULL,
    FOREIGN KEY(id_c) REFERENCES autoscuola.cliente(cod_fis),
    FOREIGN KEY(id_p) REFERENCES autoscuola.patente(nome_p),
    PRIMARY KEY(id_c,id_p)
);

--R8: DOMANDA IN ESAME 
CREATE TABLE autoscuola.R8(
    risposta_data BOOLEAN NOT NULL,
    FOREIGN KEY (id_dom) REFERENCES autoscuola.domanda(id_domanda) NOT NULL ON DELETE CASCADE,
    FOREIGN KEY (id_esame) REFERENCES autoscuola.esame(id) NOT NULL ON DELETE CASCADE,
    PRIMARY KEY(id_dom,id_esame)
);

