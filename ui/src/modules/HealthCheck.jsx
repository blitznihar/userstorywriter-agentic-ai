import { useState } from "react";
import { Form } from "react-bootstrap";
export default function HealthCheck() {
  const [healthCheckResp, setHealthCheckResp] = useState({ status: null, ok: false, json: null });

  const handleHealthCheck = async () => {
    try {
      const response = await fetch('http://localhost:8181/health');
      let data;
      if (response.ok) {
        try {
          data = await response.json();
        } catch (parseError) {
          data = `Failed to parse JSON: ${parseError.message}`;
        }
      } else {
        data = `Request failed with status ${response.status}`;
      }
      console.log('Health Check Response:', data);
      setHealthCheckResp({ status: response.status, ok: response.ok, json: data });
    } catch (error) {
      setHealthCheckResp({ status: 'Error', ok: false, json: error.message });
      console.log('Health Check Error:', error.message);
    }
  };

  return (
    <div className="container">
      <h1>User Story Writer Health Check</h1>

      <Form>
        <Form.Group className="mb-3" controlId="HealthCheck">
          <Form.Label>Health Check</Form.Label>
        </Form.Group>
        <Form.Group className="mb-3" controlId="HealthCheckAPI">
                    <button type="button" className="btn btn-success" onClick={handleHealthCheck}>Check Health</button>
        </Form.Group>
        <Form.Group className="mb-3" controlId="Status">
          <Form.Label>Status</Form.Label>
          <b>{healthCheckResp.status}</b> | OK: <b>{String(healthCheckResp.ok)}</b>
        </Form.Group>
      </Form>
    </div>
  );
}
