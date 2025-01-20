import { useQuery, useMutation, gql } from "@apollo/client";
import "./App.css";
import { useState } from "react";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      age
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      age
      name
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

function App() {
  const [newUser, setNewUser] = useState({});

  const {
    loading: getUsersLoading,
    data: getUsersData,
    error: getUsersError,
    refetch,
  } = useQuery(GET_USERS);

  const {
    loading: getUserByIdLoading,
    data: getUserByIdData,
    error: getUserByIdError,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: 2 },
  });

  // const { createUser } = useMutation(CREATE_USER);

  const [createUser, { loading: createUserLoading, error: createUserError }] =
    useMutation(CREATE_USER, {
      onCompleted: () => {
        // Refetch users after mutation completes successfully
        refetch();
      },
    });

  if (getUsersLoading) return <p>Data Loading....</p>;

  if (getUsersError) return <p>Error: {error.message}</p>;

  const handleCreateUser = async () => {
    createUser({
      variables: {
        name: newUser.name,
        age: Number(newUser.age),
        isMarried: false,
      },
    });
    setNewUser({ name: "", age: "" });
  };

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Name..."
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, name: e.target.value }))
          }
          value={newUser?.name}
        />
        <input
          type="number"
          placeholder="Age..."
          value={newUser?.age}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, age: e.target.value }))
          }
        />
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      <div>
        {getUserByIdLoading ? (
          <p>Loading User....</p>
        ) : (
          <>
            <h1>Chosen User</h1>
            <p>{getUserByIdData?.getUserById?.name}</p>
            <p>{getUserByIdData?.getUserById?.age}</p>
          </>
        )}
      </div>
      <h1>Users</h1>

      <div>
        {getUsersData.getUsers.map((user) => (
          <div>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
            <p>Is user Married: {user.isMarried ? "Yes" : "NO"}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
