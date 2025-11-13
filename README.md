Repositorio para crear el proyecto final de la materia de sistemas web

El repositorio se compone de un total de 8 ramas;
1 rama para cada integrante del equipo (6 en total); 
1 rama "develop" para integrar y realizar todas las pruebas necesarias;
1 rama "main" que es la que llevara y estará en funcionamiento (la rama de producción)

Cada integrante debe trabajar solo en su propia rama y, cuando termine una parte del proyecto, crear un Pull Request hacia la rama develop.
La rama main está reservada para la versión final y estable del proyecto.


Flujo de trabajo: 
1. Clonar el repositorio:
git clone
cd

2. Cambiar a la rama personal
git checkout <nombre_integrante>

3. Hacer cambios y guardarlos
git add .
git commit -m "Descripción del cambio realizado"

4. Subir los cambios
git push origin <>

6. Ir a github y asegurándote que est´sa en tu rama, hacer la solicitud del merge hacia develop dando clic en "Compare & pull request"

7. Asegúrate de tener los siguientes campos de esta maner:
    base: develop
    compare: <tu_rama>

8. Escribe un comentario y manda el pull request

