import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import "./App.css";

function App() {
  return (
    <>
      <h1>Hello world</h1>
      <Show when="signed-out">
        <SignInButton mode="modal"/>
        <SignUpButton mode="modal"/>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}

export default App;
