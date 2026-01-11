import { useState } from "react";
import { Card, Form } from "react-bootstrap";
import { formatStoriesResponse } from "./formatresponse.js";


export default function UserStoryWriter() {
    const [product, setProduct] = useState("Claims Portal");
    const [primaryUser, setPrimaryUser] = useState("Customer");
    const [priority, setPriority] = useState("High");
    const [maxStories, setMaxStories] = useState(3);
    const [requirementsText, setRequirementsText] = useState(
        "User should upload documents.\nSystem must validate file type and size.\nProvide status updates and email notifications."
    );
    const [story, setStory] = useState("");

  const createUserStory = async () => {
    console.log("Create User Story button clicked");
    try {

        const response = await fetch('http://localhost:8181/api/user-stories/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product: product,
                primary_user: primaryUser,
                priority: priority,
                max_stories: maxStories,
                requirements_text: requirementsText
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const textValue = formatStoriesResponse(data);
        setStory(textValue || "");

        console.log("User Story Response:", data);

    } catch (error) {
      console.error("Error creating user story:", error);
      alert("Failed to create user story.");
    }
  };

  return (
    <div className="container">
      <h1>User Story Writer Module</h1>
      <p>This is the User Story Writer module.</p>
      <div>
        <Form.Group className="mb-3" controlId="Product">
          <Form.Label>Product</Form.Label>
            <Form.Control type="text" placeholder="Enter product name" value={product} onChange={e => setProduct(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="PrimaryUser">
          <Form.Label>Primary User</Form.Label>
            <Form.Control type="text" placeholder="Enter primary user" value={primaryUser} onChange={e => setPrimaryUser(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="Priority">
          <Form.Label>Priority</Form.Label>
            <Form.Control type="text" placeholder="Enter priority" value={priority} onChange={e => setPriority(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="MaxStories">
          <Form.Label>Max Stories</Form.Label>
            <Form.Control type="number" placeholder="Enter max stories" value={maxStories} onChange={e => setMaxStories(Number(e.target.value))} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="RequirementsText">
          <Form.Label>Requirements Text</Form.Label>
            <Form.Control as="textarea" rows={5} placeholder="Enter requirements text" value={requirementsText} onChange={e => setRequirementsText(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="AdditionalFeature">
          <Form.Label>Additional Features Can Be Added Here</Form.Label>
        </Form.Group>
        <Form.Group className="mb-3" controlId="SubmitButton">
          <button type="button" className="btn btn-primary" onClick={createUserStory}>Submit</button>
        </Form.Group>
      </div>
      <div> 
        <Card className="mb-3" controlId="AcceptanceCriteria">
        <Card.Title>Generated User Stories</Card.Title>
        <Card.Body>
          <Card.Text>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{story}</pre>
          </Card.Text>
        </Card.Body>
        </Card>
      </div>
    </div>
  );
}