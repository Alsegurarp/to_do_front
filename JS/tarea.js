class Tarea{
    constructor(id, texto, estado, contenedor){
        //Da de alta un objeto en la memoria y en el codigo
        //Construccion de un dato, que representa un bloque en el HTML
        this.id = id;
        this.texto = texto;
        this.editando = false;
        this.DOM = null; //Representa el HTML de la tarea
        //Porque no colocamos propiedades para estado y contenedor? Porque solamente se usan una vez
        this.crearDOM(estado, contenedor);
    }
    crearDOM(estado, contenedor){
        this.DOM = document.createElement('div');
        this.DOM.classList.add('tarea');
        //Crea div y le asigna clase Tarea

        let textoTarea = document.createElement('h2');
        textoTarea.classList.add('visible');
        textoTarea.innerText = this.texto;
        //Texto de la tarea

        let editor = document.createElement('input');
        editor.setAttribute("type", "text")
        editor.value = this.texto;
        //Editor texto tarea - input mas complejo, se debe declarar el value del input y su valor.
        //getAttribute para leer valor y DeleteAttribute para borrarlo 

        let botonEditar = document.createElement('button');
        botonEditar.classList.add('boton');
        botonEditar.innerText = 'Editar';
        //boton editar - Queremos que cuando el boton no esta editando, que esté escuchando cuando editar  - Y que al estar editando el boton cambie de funcion a "Guardar cambios"
        botonEditar.addEventListener("click", () => {
            this.editarTexto()
        })

        let botonBorrar = document.createElement('button');
        botonBorrar.classList.add('boton');
        botonBorrar.innerText = 'Borrar';
        //boton borrar
        botonBorrar.addEventListener("click", () => {
            this.borrarTarea()
        });


        let botonEstado = document.createElement('button');
        botonEstado.className = `estado ${ estado ? "terminada" : "" }`;
        botonEstado.appendChild(document.createElement('span'));
        //boton del estado
        botonEstado.addEventListener("click", () => {
            this.editarEstado()
            .then( () => botonEstado.classList.toggle("terminada"))
            .catch( () => console.log("mostrar error al usuario"));
        })
        

        //Ahora meter lo primero que entrará al div en el orden de necesitarlo
        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(editor);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);

        //Al final del metodo - se debe ensamblar la tarea y añadir elementos al DOM
        contenedor.appendChild(this.DOM);
    }
    async editarTexto(){
        if(this.editando){
            //Ahora programar que compare caracteres y si hubo un cambio, que se cambie a eso de manera permanente
            let tareaTemporal = this.DOM.children[1].value.trim();
            if(tareaTemporal != "" && tareaTemporal != this.texto){
                //Aqui se debe de ejecutar la peticion del cambio del contenido
                //El cambio debe de suceder con async - await ya que debe de cambiarse en la base de datos y despues 
                //Continuamos con el cambio al front
                //Await está tomando el lugar del último then del fetch, 
                //pero en éste caso debe esperar a que la conexion termine todo su proceso para continuar
                let {resultado, error} = await fetch(`https://api-to-do-4siz.onrender.com/tareas/actualizar/${this.id}/2`, {
                    method : "PUT", 
                    body : JSON.stringify({ tarea : tareaTemporal}),
                    headers : {
                        "Content-type" : "application/json"
                    }
                }).then(respuesta => respuesta.json())
                if(error || resultado == "ko"){
                    console.log("Error en la edicion")
                }
                //Si hay error o el resultado es ko, quiero que de cualquier manera se ejecute el curso de la function
                //Debemos de hacerlo de ésta manera para que la interface no se desface
                else{
                    this.texto = tareaTemporal;
                    //Una vez que estamos seguros que el back ha hecho el cambio, se refleja en el front
                }
            }

            this.DOM.children[1].classList.remove("visible");
            this.DOM.children[0].innerText = this.texto;
            this.DOM.children[0].classList.add("visible");
            this.DOM.children[2].innerText = "Editar";}
                //cuando se haga click aqui, al texto del h2 se hace invisible, al input se hace visible, el boton que dice "editar" cambia a "Guardar cambios"
                //Y que cuando sea clickeado el "Guardar cambios" - input hacerlo invisible y el h2 hacerlo visible
                //Cosas mas avanzadas del DOM = todo ésto está dentro del this.DOM = propiedades del DOM lo tiene con el elemento Children.
         else {
            this.DOM.children[0].classList.remove("visible");
            this.DOM.children[1].value = this.texto;
            this.DOM.children[1].classList.add("visible");
            this.DOM.children[2].innerText = "Guardar";
            }
            //Referencío al los elementos del DOM que se encuentran dentro de un ARRAY del DOM
        this.editando = !this.editando;
    }

    editarEstado(){
        //Como necesito el resultado de span, es una promesa, ya que hasta que no se cumpla no puedo hacer nada
        return new Promise((ok, ko) => {
            //Peticion para editar estado - no se coloca mas informacion porque en la id está el resto de la informacion
            fetch(`https://api-to-do-4siz.onrender.com/tareas/actualizar/${this.id}/2`, {
                method : "PUT"
            })
            .then(respuesta => respuesta.json())
            .then(({resultado, error}) => {
                if(error || resultado == "ko"){
                    return ko();
                }
                //No se coloca else, ya que estamos declarando que no debe ser error en el parametro anterior
                ok();
            })
        });
    }

    borrarTarea(){
        //Este metodo elimina el elemento del DOM
            //Peticion para editar estado - no se coloca mas informacion porque en la id está el resto de la informacion
            fetch(`https://api-to-do-4siz.onrender.com/tareas/borrar/${this.id}`, {
                method : "DELETE"
            })
            .then(respuesta => respuesta.json())
            .then(({resultado, error}) => {
                if(error || resultado == "ko"){
                    return console.log("Error en la peticion");
                }
                //No se coloca else, ya que estamos declarando que no debe ser error en el parametro anterior
                this.DOM.remove();
            })
    }
}