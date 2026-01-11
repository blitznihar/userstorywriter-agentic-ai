import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import HealthCheck from "./modules/HealthCheck.jsx";
import UserStoryWriter from "./modules/UserStoryWriter.jsx";
export default function App() {

  const [key, setKey] = useState("home");
  return (
    <Tabs id="app-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
      <Tab eventKey="home" title="Home">
        <div className="container">
          <h1>User Story Writer</h1>
          <p>Welcome to the User Story Writer application!</p>
        </div>
      </Tab>
      <Tab eventKey="health" title="Health Check">
        <HealthCheck />
      </Tab>
      <Tab eventKey="userstory" title="User Story Writer">
        <UserStoryWriter />
      </Tab>
    </Tabs>
  );

}