import "./App.css";
import { UserStreamProvider } from "./UserStreamProvider";
import { UserVideo } from "./UserVideo/UserVideo";
import { ConferenceProvider } from "./ConferenceProvider";
import { World } from "./World/World";

function App() {
  return (
    <main>
      <div className="credits">
        <p>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/dolynchuk/tensorflow-three-pose">Github repo</a>
        </p>
        <p>Maksym Dolynchuk @ 2025</p>
        <p>
        <a target="_blank" rel="noopener noreferrer" href="https://dolynchuk.github.io/portfolio">Portfolio</a>
        </p>
        <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/maksym-d-13283b110/">LinkedIn</a>
      </div>
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
