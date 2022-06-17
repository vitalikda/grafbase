import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import { useTodoListsQuery } from "graphql/schema";
import TodoList from "components/todo-list";
import TodoListEmpty from "components/new-todo-list";
import { useMemo } from "react";

const Home: NextPage = () => {
  const [{ data, fetching }] = useTodoListsQuery();

  const reversed = useMemo(() => {
    if (!data?.todoListCollection?.edges) {
      return;
    }

    return [...data?.todoListCollection?.edges].reverse();
  }, [data]);

  if (fetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-5 gap-6">
      {reversed?.map((todoList, index) => {
        if (!todoList?.node) {
          return null;
        }

        return <TodoList key={index} {...todoList.node} />;
      })}
      <TodoListEmpty />
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default Home;
