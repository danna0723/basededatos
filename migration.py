import mysql.connector
from pymongo import MongoClient

# Conexión a MySQL
conexion_mysql = mysql.connector.connect(
    host="localhost",          
    user="root",                
    password="",                
    database="test", 
    port = 3306,               # Puerto por defecto de MySQL
)

cursor = conexion_mysql.cursor(dictionary=True)

# Conexión a MongoDB Atlas
uri_mongo = "mongodb+srv://danna123:101050@cluster0.rgmfj.mongodb.net/prueba?retryWrites=true&w=majority"
cliente_mongo = MongoClient(uri_mongo)
db_mongo = cliente_mongo["prueba"]

# Crear las colecciones en MongoDB
coleccion_heroes = db_mongo["heroes"]
coleccion_peliculas = db_mongo["peliculas"]
coleccion_protagonistas = db_mongo["protagonistas"]

cursor.execute("SELECT * FROM heroes")
heroes = cursor.fetchall()

for heroe in heroes:
    coleccion_heroes.insert_one({
        "nombre": heroe["nombre"],
        "bio": heroe["bio"],
        "img": heroe["img"],
        "aparicion": str(heroe["aparicion"]),  # Convertir la fecha a string
        "casa": heroe["casa"]
    })

cursor.execute("SELECT * FROM peliculas")
peliculas = cursor.fetchall()

for pelicula in peliculas:
    coleccion_peliculas.insert_one({
        "nombre": pelicula["nombre"]
    })

cursor.execute("""
    SELECT p.id AS idprotagonista, p.idpelicula, p.idheroe, h.nombre AS heroe_nombre, 
           pl.nombre AS pelicula_nombre
    FROM protagonistas p
    JOIN heroes h ON p.idheroe = h.id
    JOIN peliculas pl ON p.idpelicula = pl.id
""")
protagonistas = cursor.fetchall()

for protagonista in protagonistas:
    heroe_id = coleccion_heroes.find_one({"nombre": protagonista["heroe_nombre"]})["_id"]
    pelicula_id = coleccion_peliculas.find_one({"nombre": protagonista["pelicula_nombre"]})["_id"]

    coleccion_protagonistas.insert_one({
        "heroe_id": heroe_id,
        "pelicula_id": pelicula_id
    })

cursor.close()
conexion_mysql.close()
cliente_mongo.close()

print("Migración completada a MongoDB Atlas")
