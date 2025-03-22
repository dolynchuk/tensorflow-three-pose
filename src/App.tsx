import "./App.css";
import { UserStreamProvider } from "./UserStreamProvider";
import { UserVideo } from "./UserVideo/UserVideo";
import { ConferenceProvider } from "./ConferenceProvider";
import { World } from "./World/World";

function App() {
  return (
    <main>
      <UserStreamProvider>
        <ConferenceProvider>
          <World/>
          <div className="userContainer">
            <UserVideo />
            {/* <Spectrum /> */}
          </div>
        </ConferenceProvider>
      </UserStreamProvider>
    </main>
  );
}

export default App;
