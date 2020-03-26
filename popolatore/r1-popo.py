import secrets
import sys
from random import randint
import psycopg2
import numpy as np

def ran_gen(x):
    return randint(0,x)

if __name__ == '__main__':
    try:
        connection = psycopg2.connect(user = "starkiller",
                                  password = "7574hryq",
                                  host = "127.0.0.1",
                                  port = "5432",
                                  database = "autoscuola")

        cursor = connection.cursor()
        # Print PostgreSQL Connection properties
        # Print PostgreSQL version
        cursor.execute('''SELECT cod_fis FROM cliente''')
        x = np.array(cursor.fetchall())
        cursor.execute('''SELECT costo1, costo2 FROM patente;''')
        cs = np.array(cursor.fetchall())
        cursor.execute('''SELECT nome_p FROM patente;''')
        pat = np.array(cursor.fetchall())
        y2=x[15:,[0]]
        cs1 =[]
        for i,j in enumerate(cs):
            cs1.append( [ran_gen(cs[i][0]),ran_gen(cs[i][1])] )
        w=[]
        for k,l in enumerate(y2):
            numero=randint(0,len(cs)-1)
            w.append((cs1[numero][0],cs1[numero][1],str(pat[numero]),str(l)))
        print(np.array(w)) 
        

    except (Exception, psycopg2.Error) as error : 
        print ("Error while connecting to PostgreSQL", error)
    finally:
        # closing database connection.
        if(connection):
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
