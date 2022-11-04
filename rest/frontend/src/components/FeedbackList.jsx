import { useState, useContext, useEffect, useHistory } from 'react'
import FeedbackItem from './FeedbackItem'
import FeedbackContext from '../context/FeedbackContext'
import AboutIconLink from '../components/AboutIconLink'
import { Container, Row, Col, Dropdown, DropdownButton, Card, Form, InputGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function FeedbackList() {
  const [text, setText] = useState('')
  const { feedback, manv, addFeedback, deleteFeedback } = useContext(FeedbackContext)
  const handleTextChange = (e) => {
    setText(e.target.value)
    console.log(e.target.value)
  }

  const handleClick = () => {
    deleteFeedback()
  }

  const handleSubmit = (e) => {
    const newFeedback = {
      text}
    e.preventDefault()
    addFeedback(newFeedback)
    setText('')
    }

  if (!manv || manv.length === 0) {
    return (
    <>
    <p>No Report</p>
    <Form className='my-3' onSubmit={handleSubmit}>
    <Row className="align-items-center">
    <Col xs="auto">
    <Form.Label htmlFor="inlineFormInput" visuallyHidden>
    Name
    </Form.Label>
    <Form.Control
    className="mb-2"
    id="inlineFormInput"
    placeholder="Tim Theo Ma Nha Thuoc"
    onChange={handleTextChange}
    value={text}
    />
    </Col>
    <Col xs="auto">
    <Button type="submit" className="mb-2">
    Submit
    </Button>
    </Col>
    </Row>
    </Form>
    <AboutIconLink></AboutIconLink>
    </>
    

    
    )
  } else

  return (

    <Container>

        <Form className='my-3' onSubmit={handleSubmit}>
        <Row className="align-items-center">
        <Col xs="auto">
        <Form.Label htmlFor="inlineFormInput" visuallyHidden>
        Name
        </Form.Label>
        <Form.Control
        className="mb-2"
        id="inlineFormInput"
        placeholder={manv.text}
        onChange={handleTextChange}
        value={text}
        disabled={manv}
        />
        </Col>
        <Col xs="auto">
        <Button type="submit" className="mb-2" name="add_button" value="Add" disabled={manv}>
        Submit
        </Button>
        <Button type="submit" className="mb-2" variant="danger" name="update_button" value="Update" onClick={handleClick}>
        Out
        </Button>
        </Col>
        </Row>
        </Form>


      {feedback.map((item) => (
        <Card className="my-3" key={item.id} >
          <Link style={{ textDecoration: "none" }} to={`/item/${item.id}`}> <FeedbackItem item={item} />  </Link>
			
          
        </Card>
      ))}
      <AboutIconLink></AboutIconLink>
    </Container>

    // <div className='feedback-list'>
    //     {feedback.map((item) => (
    //         <FeedbackItem key={item.id} item={item} />
    //     ))}
    // </div>
  )

  // return (
  //   <div className='feedback-list'>
  //     {feedback.map((item) => (
  //       <FeedbackItem key={item.id} item={item} handleDelete={handleDelete} />
  //     ))}
  //   </div>
  // )
}

export default FeedbackList
