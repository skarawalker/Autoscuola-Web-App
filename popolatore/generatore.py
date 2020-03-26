import secrets
import sys
from random import randint

def gen_data_nascita():
    i=randint(30,99)
    j=randint(1,12)
    k=randint(1,30)
    return str("19"+str(i)+"-"+str(j)+"-"+str(k))
def gen_cod_fis():
    x=  secrets.token_hex(16)
    return x[0:16]
def gen_nome():
    f = open("nomi_italiani.txt", "r")
    linesn = f.readlines() 
    return linesn[randint(1,9117)][0:-1]
    f.close()
def gen_cognome():
    f = open("cognomi.txt", "r")
    linesc = f.readlines()
    return linesc[randint(1,801)][0:-1]
    f.close()
def gen_tel():
    return randint( 1000000000, 9999999999 )
def gen_data():
    i=randint( 10,19 )
    j=randint(1,12)
    k=randint(1,30)
    return str("20"+str(i)+"-"+str(j)+"-"+str(k))
def email_gen():
    f = open("emails.txt", "r")
    linesn = f.readlines()
    return linesn[randint(1,199)][0:-1]
    f.close()
def generatore():
    lista_comuni = ["San Donà di Piave","Treviso", "Portogruaro", "Conegliano", "Pordenone", "Padova", "Mestre", "Vicenza", "Belluno", "Udine"]
    cf=str(gen_cod_fis()).upper()
    d_n=str(gen_data_nascita())
    nm=str.lower(gen_nome()).upper()
    cgm=str.lower(gen_cognome()).upper()
    d_i=str(gen_data())
    luogo=lista_comuni[randint(0,len(lista_comuni)-1)].upper()
    email = email_gen().upper()
    tel=str(gen_tel())
    return "( \"" + cf + "\", \"" + nm + "\", \"" + cgm + "\", \"" + d_n + "\", \"" + d_i + "\", \"" + luogo + "\", \"+39" + tel + "\", \"" + email + "\" ),"
if __name__ == '__main__':
    for i in range(0,int(sys.argv[1])):
        x=generatore()
        if(i==int(sys.argv[1])-1):
            x=x[0:-1]
        print(x)