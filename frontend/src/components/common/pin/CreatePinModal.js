import React, { useState } from 'react';
import {
  Modal, Form, Row, Col, FloatingLabel, Image,
  Button, Alert, ProgressBar, Spinner
} from "react-bootstrap";

const CreatePinModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [sending, setSending]     = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [error, setError]         = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would upload the image and save the pin
    console.log('Creating pin:', { title, description, imageUrl, selectedFile });
    onClose();
  };

  return (
    <Modal show onHide={onClose} size="lg" centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create Pin</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={5} className="mb-3">
              <Form.Group controlId="pin-image" className="mb-3">
                <Form.Label>Pin image *</Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                />
              </Form.Group>

              {previewUrl && (
                  <Image src={previewUrl} alt="preview" thumbnail className="w-100" />
              )}
            </Col>

            <Col md={7}>
              <FloatingLabel controlId="pin-title" label="Title *" className="mb-3">
                <Form.Control
                    type="text"
                    placeholder=" "
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
              </FloatingLabel>

              <FloatingLabel
                  controlId="pin-description"
                  label="Description"
                  className="mb-3"
              >
                <Form.Control
                    as="textarea"
                    placeholder=" "
                    style={{ height: "90px" }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
              </FloatingLabel>

            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}

          {sending && <ProgressBar now={uploadPct} animated className="mt-2" />}
        </Modal.Body>

        {/* ---------- Футер ---------- */}
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button variant="danger" type="submit" disabled={sending}>
            {sending && <Spinner size="sm" animation="border" className="me-2" />}
            Create
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreatePinModal;
