import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

function HomeScreen({ history }) {
  return (
    <Container className="py-5">
      {/* Header */}
      <header className="text-center mb-5">
        <h1 className="fw-bold text-primary">Welcome to SQL Academy</h1>
        <p className="text-muted fs-5">
          Learn SQL step by step — from fundamentals to advanced analytics.
        </p>
      </header>

      {/* About Section */}
      <section className="text-center mb-5">
        <h2 className="mb-3">👋 Hi, I'm Duy Van</h2>
        <p className="text-secondary mx-auto" style={{ maxWidth: "700px" }}>
          I’m passionate about helping students and professionals master SQL for real-world data tasks.
          Explore lessons, challenges, and project-based learning below.
        </p>
      </section>

      {/* Cards Section */}
      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-sm h-100 text-center">
            <Card.Body>
              <Card.Title>📘 SQL Basics</Card.Title>
              <Card.Text>
                Understand SELECT, WHERE, GROUP BY, and JOIN with practical datasets.
              </Card.Text>
              <Button variant="primary" onClick={() => history.push("/lessons")}>
                Start Learning
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm h-100 text-center">
            <Card.Body>
              <Card.Title>🧠 Practice Problems</Card.Title>
              <Card.Text>
                Apply what you learn through hands-on exercises and SQL puzzles.
              </Card.Text>
              <Button variant="success" onClick={() => history.push("/practice")}>
                Try Challenges
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm h-100 text-center">
            <Card.Body>
              <Card.Title>📊 Projects & Reports</Card.Title>
              <Card.Text>
                Build real-world data reports and dashboards using your SQL skills.
              </Card.Text>
              <Button variant="warning" onClick={() => history.push("/projects")}>
                Explore Projects
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomeScreen;