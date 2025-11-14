Repositorio para crear el proyecto final de la materia de sistemas web

El repositorio se compone de un total de 8 ramas;
1 rama para cada integrante del equipo (6 en total); 
1 rama "develop" para integrar y realizar todas las pruebas necesarias;
1 rama "main" que es la que llevara y estará en funcionamiento (la rama de producción)

Cada integrante debe trabajar solo en su propia rama y, cuando termine una parte del proyecto, crear un Pull Request hacia la rama develop.
La rama main está reservada para la versión final y estable del proyecto.


Flujo de trabajo:
En la terminal, ir a la carpeta donde se almacenará el repositorio local 
1. Clonar el repositorio:
git clone https://github.com/chrisorJR09/proyecto_final_SW.git

2. Cambiar a la rama personal
git checkout <tu_rama>
*Si tienes dudas de como se llama tu rama, puedes hacer un git branch -r y ahí verás todas las ramas
3. Hacer cambios y guardarlos
git add <nombre_del_archivo_modificado>
git commit -m "Descripción del cambio realizado"

4. Subir los cambios
git push origin <tu_rama>

**Para hacer un merge al rama develop**
6. Ir a github y asegurándote que estás en tu rama, hacer la solicitud del merge hacia develop dando clic en "Compare & pull request"

7. Asegúrate de tener los siguientes campos de esta manera:
    base: develop
    compare: <tu_rama>

8. Escribe un comentario y manda el pull request y notifica que hiciste un cambio para revisarlo y si todo
está bien, integrarlo a la rama develop


**Si alguien más hizo cambios a develop**
9. Cámbiate a la rama "develop":
git checkout develop

10. Haz un pull de esa rama hacia tu carpeta local
git pull origin develop

11. Cambia a tu rama local 
git checkout <tu_rama>

12. Haz un merge entre la rama develop (local) y tu rama (local)
git merge develop 
(Esto hace que los cambios que hay en develop se queden en tu rama y así tengas el proyecto más actual)

