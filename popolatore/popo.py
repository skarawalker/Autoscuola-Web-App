import secrets
import sys
from random import randint
import psycopg2
import numpy as np

def gen_data():
    i=randint( 20,29 )
    j=randint(1,12)
    k=randint(1,30)
    return str("20"+str(i)+"-"+str(j)+"-"+str(k))

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
        cursor.execute('''SELECT * FROM cliente''')
        x = np.array(cursor.fetchall())
        y1=x[0:15,[0]].tolist()
        y2=x[15:,[0]].tolist()
        cursor.execute('''SELECT * FROM patente WHERE nome_p NOT LIKE '%-ST' OR nome_p NOT LIKE '%%-ST'; ''')
        z = np.array(cursor.fetchall())
        z = z[:,[0]].tolist()
        patente_list =[]
        for i in range(len(y1)):
            patente_list.append((str(gen_data()),str(y1[i])[2:-2],str(z[randint(0,len(z)-1)])[2:-2] ))
        print(patente_list)

    except (Exception, psycopg2.Error) as error : 
        print ("Error while connecting to PostgreSQL", error)
    finally:
        # closing database connection.
        if(connection):
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
