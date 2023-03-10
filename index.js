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

const myFetch = () => {

}

const APIs = (() => {
    const createTodo = (newTodo) => {
        return fetch("http://localhost:3000/todos", {
            method: "POST",
            body: JSON.stringify(newTodo),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

    const updateTodo = (newTodo) => {
        return fetch("http://localhost:3000/todos", {
            method: "POST",
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
    const { getTodos, createTodo, deleteTodo, updateTodo } = APIs;
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
            const liTemplate = `<li><span id="span${todo.id}">${todo.content}</span><button class="edit-btn" id="${todo.id}">Edit</button><button class="delete-btn" id="${todo.id}">delete</button><button class="move-btn" id="${todo.id}">Move</button></li>`;
            todosTemplate += liTemplate;
        });
        if (pendingTasks.length === 0) {
            todosTemplate = "<h4>no pending task to display!</h4>";
        }
        pendinglistEl.innerHTML = todosTemplate;
        todosTemplate = "";
        completedTasks.forEach((todo) => {
            const liTemplate = `<li><span id="span${todo.id}">${todo.content}</span><button class="edit-btn" id="${todo.id}">Edit</button><button class="delete-btn" id="${todo.id}">delete</button><button class="move-btn" id="${todo.id}">Move</button></li>`;
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

    const handleChange = () => {
        view.pendinglistEl.addEventListener("click", (event) => {
            if (event.target.className === "edit-btn") {
                const id = event.target.id;
                console.log(document.getElementById("span" + id));
                document.getElementById("span" + id).contentEditable = true;
                const newContent = document.getElementById("span" + id).innerHTML;
                const tasktoUpdate = state.todos.find(todo => todo.id === +id);
                const newTodo = {content: newContent, pending: tasktoUpdate.pending};
                model.deleteTodo(+id).then((data) => {
                    state.todos = state.todos.filter((todo) => todo.id !== +id);
                });
                model.updateTodo( newTodo ).then((data) => {
                    
                    state.todos = [data, ...state.todos];
                    console.log(data);
                    // view.clearInput();
                });
                // state.todos.find(todo => todo.id === +id).content = newContent;
                // model.createTodo({ content: newContent }).then((data) => {
                // state.todos = [data, ...state.todos];
                // view.clearInput();
                // });
            }
        });
        view.completedlistEl.addEventListener("click", (event) => {
            if (event.target.className === "edit-btn") {
                const id = event.target.id;
                document.getElementById("span" + id).contentEditable = true;
                const newContent = document.getElementById("span" + id).innerHTML;
                const tasktoUpdate = state.todos.find(todo => todo.id === +id);
                const newTodo = {content: newContent, pending: tasktoUpdate.pending};
                model.deleteTodo(+id).then((data) => {
                    state.todos = state.todos.filter((todo) => todo.id !== +id);
                });
                model.updateTodo( newTodo ).then((data) => {
                    
                    state.todos = [data, ...state.todos];
                    console.log(data);
                    // view.clearInput();
                });
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
                model.deleteTodo(+id).then((data) => {
                    state.todos = state.todos.filter((todo) => todo.id !== +id);
                });
                model.updateTodo( newTodo ).then((data) => {
                    state.todos = [data, ...state.todos];
                    
                    // view.clearInput();
                });
                
            }
        });

        view.completedlistEl.addEventListener("click", (event) => {
            if (event.target.className === "move-btn") {
                const id = event.target.id;
                console.log("id", typeof id);
                const tasktoUpdate = state.todos.find(todo => todo.id === +id);
                const newTodo = {content: tasktoUpdate.content, pending: !tasktoUpdate.pending};
                model.deleteTodo(+id).then((data) => {
                    state.todos = state.todos.filter((todo) => todo.id !== +id);
                });
                model.updateTodo( newTodo ).then((data) => {
                    state.todos = [data, ...state.todos];
                    console.log(data);
                    // view.clearInput();
                });
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
