import Head from "next/head";
import { useEffect, useState } from "react";
import {
  todoSchema,
  addTodoFormSchema,
  voidResponseSchema,
  type AddTodoForm,
  type Todo,
} from "@/models";
import { XCircleIcon } from "@heroicons/react/16/solid";
import { Inter } from "next/font/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddTodoForm>({
    resolver: zodResolver(addTodoFormSchema),
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = todoSchema.array().parse(await res.json());
    setTodos(data);
  };

  const addTodo = async (text: string) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ text }),
    });

    const data = voidResponseSchema.parse(await res.json());

    if (!data.success) {
      console.error("Something went wrong");
    }

    reset();
    fetchTodos();
  };

  const toggleIsTodoCompleted = async (id: string) => {
    const todo = todos.find((t) => t.id === id)!;

    const res = await fetch("/api/todos", {
      method: "PUT",
      body: JSON.stringify({
        ...todo,
        isCompleted: !todo.isCompleted,
      }),
    });

    const data = voidResponseSchema.parse(await res.json());

    if (!data.success) {
      console.error("Something went wrong");
    }

    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    const res = await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    const data = voidResponseSchema.parse(await res.json());

    if (!data.success) {
      console.error("Something went wrong");
    }

    fetchTodos();
  };

  return (
    <div className={`${inter.className} flex flex-col`}>
      <Head>
        <title>Todo List</title>
      </Head>

      <h1 className="p-2 text-2xl font-bold text-red-600">Todo App Demo</h1>

      <form
        onSubmit={handleSubmit(({ text }) => {
          addTodo(text);
        })}
        className="flex max-w-xs items-start gap-4 px-4 pb-6 pt-2"
      >
        <div>
          <input type="text" {...register("text")} className="rounded-sm" />
          {errors.text?.message ? (
            <p className="pt-2 text-red-600">{errors.text.message}</p>
          ) : null}
        </div>

        <button type="submit" className="button py-[9px]">
          Add todo
        </button>
      </form>

      <ul className="mx-4 inline-block">
        {todos.map((todo) => (
          <li key={todo.id} className="flex gap-3">
            <label className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => toggleIsTodoCompleted(todo.id)}
                className="checked:border-green-600 checked:bg-green-600 checked:hover:border-green-700 checked:hover:bg-green-700"
              />
              <p>{todo.text}</p>
            </label>

            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-600"
            >
              <span className="sr-only">Delete todo</span>
              <XCircleIcon className="size-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
