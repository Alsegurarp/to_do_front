const formulario = document.querySelector('form');
const inputText = document.querySelector('form input[type="text"]');
const contenedorTareas = document.querySelector('.tareas');


//Carga inicial de los datos - 
//Fetch de fabrica hace GET, cuando esto represe viene con una respuesta
fetch("https://api-to-do-4siz.onrender.com/tareas")
.then(respuesta => respuesta.json())
.then(tareas => 
    {tareas.forEach(({id,tarea,estado}) => {
        new Tarea(id, tarea, estado, contenedorTareas)
    }) });

formulario.addEventListener("submit", (evt) => {
    //El evento de los formularios SIEMPRE es submit, por eso hay que cancelar el default
    evt.preventDefault();

    //if comprueba que el contenido no se encuentre vacio
    if(inputText.value.trim() != ""){
        let tarea = inputText.value.trim();
        //Lo que el usuario ha creado en el input
        fetch("https://api-to-do-4siz.onrender.com/tareas/nueva", {
            method: "POST",    
            body: JSON.stringify({tarea}),
            headers : {
                    "Content-type" : "application/json"
                }
            })
            .then(respuesta => respuesta.json())
            //respuesta.JSON es una promesa que retorna 2 posibles estados - Error o el exito
            .then(({id, error}) => {
                if(!error){
                    //Si no hay error, estamos seguros que está creada en el back, ahora hay que llevar ése contenido al front
                    //Despues pintamos el input del text - sin contenido.
                    new Tarea(id, tarea, false, contenedorTareas);
                        return inputText.value = "";
                }
            console.log("... mostrar error al usuario");
        })
    }
});
//al hacer click en enviar, lo escrito en el input salga en la consola submit