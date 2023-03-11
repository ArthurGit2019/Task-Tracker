//console.log("hello world")

/* 
  client side
    template: static template
    logic(js): MVC(model, view, controller): used to server side technology, single page application
        model: prepare/manage data,
        view: manage view(DOM),
        controller: business logic, event bindind/handling

  server side
    json-server
    CRUD: create(post), read(get), update(put, patch), delete(delete)


*/

//read
/* fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    }); */

const myFetchAPIs = (() => {
    const createTodo = (newTodo) => {
        return fetch("http://localhost:3000/todos", {
            method: "POST",
            body: JSON.stringify(newTodo),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

    const updateTodo = (id, newTodo) => {
        return fetch("http://localhost:3000/todos/" + id, {
            method: "PUT",
            body: JSON.stringify(newTodo),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    }

    const deleteTodo = (id) => {
        return fetch("http://localhost:3000/todos/" + id, {
            method: "DELETE",
        }).then((res) => res.json());
    };

    const getTodos = () => {
        return fetch("http://localhost:3000/todos").then((res) => res.json());
    };
    return { createTodo, updateTodo, deleteTodo, getTodos };
})();

//IIFE
//todos
/* 
    hashMap: faster to search
    array: easier to iterate, has order


*/
const Model = (() => {
    class State {
        #todos; //private field
        #onChange; //function, will be called when setter function todos is called
        constructor() {
            this.#todos = [];
        }
        get todos() {
            return this.#todos;
        }
        set todos(newTodos) {
            // reassign value
            console.log("setter function");
            this.#todos = newTodos;
            this.#onChange?.(); // rendering
        }

        subscribe(callback) {
            //subscribe to the change of the state todos
            this.#onChange = callback;
        }
    }
    const { getTodos, createTodo, deleteTodo, updateTodo } = myFetchAPIs;
    return {
        State,
        getTodos,
        createTodo,
        deleteTodo,
        updateTodo,
    };
})();
/* 
    todos = [
        {
            id:1,
            content:"eat lunch"
        },
        {
            id:2,
            content:"eat breakfast"
        }
    ]

*/

// let eachTask = "";
const View = (() => {
    const pendinglistEl = document.querySelector(".pending-todo-list");
    const completedlistEl = document.querySelector(".completed-todo-list");
    const submitBtnEl = document.querySelector(".submit-btn");
    // const editBtnEl = document.querySelector(".edit-btn");
    const inputEl = document.querySelector(".input");

    const renderTodos = (todos) => {
        let todosTemplate = "";
        const pendingTasks = todos.filter(todo => todo.pending);
        const completedTasks = todos.filter(todo => todo.pending === false);
        
        pendingTasks.forEach((todo) => {
            // eachTask = `<span id="span${todo.id}">${todo.content}</span>`;
            const liTemplate = `<li><span id="span${todo.id}">${todo.content}</span><button class="edit-btn" id="${todo.id}"><svg focusable="false" 
            aria-hidden="true" viewBox="0 0 24 24"  aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 
            7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></button><button class=
            "delete-btn" id="${todo.id}"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small"><path d=
            "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></button><button class="move-btn" 
            id="${todo.id}"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIcon" aria-label="fontSize small">
            <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg></button></li>`;
            todosTemplate += liTemplate;
        });
        if (pendingTasks.length === 0) {
            todosTemplate = "<h4>no pending task to display!</h4>";
        }
        pendinglistEl.innerHTML = todosTemplate;
        todosTemplate = "";
        completedTasks.forEach((todo) => {
            // eachTask = `<span id="span${todo.id}">${todo.content}</span>`;
            const liTemplate = `<li><button class="move-btn" id="${todo.id}"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label=
            "fontSize small"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg></button>
            <span id="span${todo.id}">${todo.content}</span><button class="edit-btn" id="${todo.id}"><svg focusable="false" 
            aria-hidden="true" viewBox="0 0 24 24"  aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 
            7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></button><button class=
            "delete-btn" id="${todo.id}"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small"><path d=
            "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></button></li>`;
            todosTemplate += liTemplate;
        });
        if (completedTasks.length === 0) {
            todosTemplate = "<h4>no completed task to display!</h4>";
        }
        completedlistEl.innerHTML = todosTemplate;
    };

    const clearInput = () => {
        inputEl.value = "";
    };

    return { renderTodos, submitBtnEl, inputEl, clearInput, pendinglistEl, completedlistEl };
})();

const Controller = ((view, model) => {
    const state = new model.State();
    const init = () => {
        model.getTodos().then((todos) => {
            todos.reverse();
            state.todos = todos;
        });
    };

    const handleSubmit = () => {
        view.submitBtnEl.addEventListener("click", (event) => {
            /* 
                1. read the value from input
                2. post request
                3. update view
            */
            const inputValue = view.inputEl.value;
            model.createTodo({ content: inputValue, pending: true }).then((data) => {
                state.todos = [data, ...state.todos];
                view.clearInput();
            });
        });
    };

    const toggleEdit = (event, displayInput) => {
         // displayInput = !displayInput;
        const id = event.target.id;
        if (displayInput) {
            let txt = document.getElementById("span" + id).innerText;
            console.log(txt);
            document.getElementById("span" + id).innerHTML = `<input id="input${id}" class="editTask" value="${txt}" />`;
        }

        if (!displayInput) {
            const newContent = document.getElementById("input" + id).value;
            const tasktoUpdate = state.todos.find(todo => todo.id === +id);
            const newTodo = {content: newContent, pending: tasktoUpdate.pending};

            document.getElementById("input" + id).innerHTML = `<span id="span${id}">${newContent}</span>`;
            model.updateTodo(id, newTodo).then((data) => {
                    
                // state.todos = todos;
                console.log(data);
                // view.clearInput();
            });
            init();
        }
        // model.deleteTodo(+id).then((data) => {
        //     state.todos = state.todos.filter((todo) => todo.id !== +id);
        // });
        
    }

    const handleChange = () => {
        var displayPendingInput = false;
        view.pendinglistEl.addEventListener("click", (event) => {
            if (event.target.className === "edit-btn") {
                displayPendingInput = !displayPendingInput;
                toggleEdit(event, displayPendingInput);
                // const id = event.target.id;
                // let txt = document.getElementById("span" + id).innerText;
                // document.getElementById("span" + id).innerHTML = `<input id=${id} value=${txt} />`;
                // const newContent = task.innerHTML;
                // const tasktoUpdate = state.todos.find(todo => todo.id === +id);
                // const newTodo = {content: newContent, pending: tasktoUpdate.pending};
                // // model.deleteTodo(+id).then((data) => {
                // //     state.todos = state.todos.filter((todo) => todo.id !== +id);
                // // });
                // model.updateTodo(id, newTodo).then((data) => {
                    
                //     // state.todos = todos;
                //     console.log(data);
                //     // view.clearInput();
                // });
                // init();
                // state.todos.find(todo => todo.id === +id).content = newContent;
                // model.createTodo({ content: newContent }).then((data) => {
                // state.todos = [data, ...state.todos];
                // view.clearInput();
                // });
            }
        });
        var displayCompleteInput = false;
        view.completedlistEl.addEventListener("click", (event) => {
            if (event.target.className === "edit-btn") {
                displayCompleteInput = !displayCompleteInput;
                toggleEdit(event, displayCompleteInput);
                // const id = event.target.id;
                // const task = document.getElementById("span" + id);
                // task.contentEditable = true;
                // const newContent = task.innerHTML;
                // const tasktoUpdate = state.todos.find(todo => todo.id === +id);
                // const newTodo = {content: newContent, pending: tasktoUpdate.pending};
                // // model.deleteTodo(+id).then((data) => {
                // //     state.todos = state.todos.filter((todo) => todo.id !== +id);
                // // });
                // model.updateTodo( id, newTodo ).then((data) => {
                    
                //     // state.todos = todos;
                //     console.log(data);
                //     // view.clearInput();
                // });
                // init();
                // state.todos.find(todo => todo.id === +id).content = newContent;
                // model.createTodo({ content: newContent }).then((data) => {
                // state.todos = [data, ...state.todos];
                // view.clearInput();
                // });
            }
        });
    }

    const handleDelete = () => {
        //event bubbling
        /* 
            1. get id
            2. make delete request
            3. update view, remove
        */
        view.pendinglistEl.addEventListener("click", (event) => {
            if (event.target.className === "delete-btn") {
                const id = event.target.id;
                console.log("id", typeof id);
                model.deleteTodo(+id).then((data) => {
                    state.todos = state.todos.filter((todo) => todo.id !== +id);
                });
            }
        });

        view.completedlistEl.addEventListener("click", (event) => {
            if (event.target.className === "delete-btn") {
                const id = event.target.id;
                console.log("id", typeof id);
                model.deleteTodo(+id).then((data) => {
                    state.todos = state.todos.filter((todo) => todo.id !== +id);
                });
            }
        });

    };

    const handleMove = () => {
        view.pendinglistEl.addEventListener("click", (event) => {
            if (event.target.className === "move-btn") {
                const id = event.target.id;
                console.log("id", typeof id);
                const tasktoUpdate = state.todos.find(todo => todo.id === +id);
                const newTodo = {content: tasktoUpdate.content, pending: !tasktoUpdate.pending};
                // model.deleteTodo(+id).then((data) => {
                //     state.todos = state.todos.filter((todo) => todo.id !== +id);
                // });
                model.updateTodo( id, newTodo ).then((data) => {
                    // state.todos = todos;
                    console.log(data);
                    // view.clearInput();
                });
                init();
                
            }
        });

        view.completedlistEl.addEventListener("click", (event) => {
            if (event.target.className === "move-btn") {
                const id = event.target.id;
                console.log("id", typeof id);
                const tasktoUpdate = state.todos.find(todo => todo.id === +id);
                const newTodo = {content: tasktoUpdate.content, pending: !tasktoUpdate.pending};
                // model.deleteTodo(+id).then((data) => {
                //     state.todos = state.todos.filter((todo) => todo.id !== +id);
                // });
                model.updateTodo( id, newTodo ).then((data) => {
                    // state.todos = todos;
                    console.log(data);
                    // view.clearInput();
                });
                init();
            }
        });
    }
    const bootstrap = () => {
        init();
        handleSubmit();
        handleChange();
        handleDelete();
        handleMove();

        state.subscribe(() => {
            view.renderTodos(state.todos);
        });
    };
    return {
        bootstrap,
    };
})(View, Model); //ViewModel

Controller.bootstrap();
