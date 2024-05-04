"use client";
import React, {useCallback, useEffect, useState} from "react";
import {PatientService} from "@/shared/service/patient.service";
import {initialPatientState, IPatient} from "@/shared/interface/patient/patient.interface";
import "@/css/styles.css";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {Alert, Button, Row} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";


export default function PatientPage({params}: { params: { id: number } }) {

    const [patient, setPatient] = useState<IPatient | null>(null);
    const [editedPatient, setEditedPatient] = useState<IPatient>(initialPatientState);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);


    const handleEditFormSubmit = async (event: any) => {
        event.preventDefault()
        try {
            console.log(editedPatient)
            const data = await PatientService.updatePatient(params.id, editedPatient);
            setPatient(data);
            setEditedPatient(data)
        } catch (error) {
            console.log(error)
        }
        finally {
            setEditing(false)
        }
    }

    const handleChangePatient = (event: any) => {
        const {name, value} = event.target;
        setEditedPatient((prevPatient) => ({
            ...prevPatient,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancelEdit = () => {
        if (patient) {
            setEditedPatient(patient)
        }
        setEditing(false);
    }

    const fetchPatient = useCallback(async (patientId: number) => {
        try {
            setLoading(true);
            const data = await PatientService.findPatientById(patientId);
            setPatient(data);
            setEditedPatient(data)
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const patientId = params.id
        fetchPatient(patientId)

    }, [fetchPatient, params.id]);

    return (
        <>
            <br></br>
            {loading ? (
                <>
                    <div className="d-flex justify-content-center">
                        <Spinner animation="grow" role="status" variant="secondary">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                </>
            ) : patient ? (

                <Form>
                    <fieldset disabled={!editing}>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridSurname">
                                <Form.Label>Прізвище</Form.Label>
                                <Form.Control type="text" value={editedPatient.surname ?? ''} name="surname"
                                              onChange={handleChangePatient}/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridName">
                                <Form.Label>{`Ім'я`}</Form.Label>
                                <Form.Control type="text" value={editedPatient.name ?? ''} name="name"
                                              onChange={handleChangePatient}/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridMiddleName">
                                <Form.Label>По батькові</Form.Label>
                                <Form.Control type="text" value={editedPatient.middleName ?? ''} name="middleName"
                                              onChange={handleChangePatient}/>
                            </Form.Group>
                        </Row>
                        <Form.Group controlId="formGridBirthDate" className="mb-3">
                            <Form.Label>Дата народження</Form.Label>
                            <Form.Control type="date" value={editedPatient.birthDate.toString() ?? ''} name="birthDate"
                                          max="9999-12-31"
                                          onChange={handleChangePatient}/>
                        </Form.Group>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridPhone">
                                <Form.Label>Номер телефону</Form.Label>
                                <Form.Control type="text" value={editedPatient.phone ?? ''}
                                              onChange={handleChangePatient} name="phone"/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridMessengerContact">
                                <Form.Label>Контактний номер Viber/Telegram</Form.Label>
                                <Form.Control type="text" value={editedPatient.messengerContact ?? ''}
                                              name="messengerContact"
                                              onChange={handleChangePatient}/>
                            </Form.Group>
                        </Row>
                        <Form.Group controlId="formGridPreferentialCategory" className="mb-3">
                            <Form.Label>Пільгова категорія</Form.Label>
                            <Form.Control type="text" value={editedPatient.preferentialCategory ?? ''}
                                          name="preferentialCategory"
                                          onChange={handleChangePatient}/>
                        </Form.Group>
                    </fieldset>
                    <Button
                        variant="primary"
                        type="button"
                        className="me-2"
                        hidden={editing}
                        onClick={handleEdit}>
                        <i className="bi bi-pencil-square" id="editButton"></i>
                    </Button>
                    <Button
                        variant="primary"
                        type="button"
                        className="me-2"
                        hidden={!editing}
                        id="confirmEdit"
                        onClick={handleEditFormSubmit}>
                        Зберегти
                    </Button>
                    <Button variant="secondary" type="button" id="cancelButton" hidden={!editing}
                            onClick={handleCancelEdit}>Скасувати</Button>
                    <Button variant="danger" type="button" hidden={editing} id="deleteButton"><i
                        className="bi bi-trash"></i></Button>
                </Form>
            ) : (
                <Alert variant="danger">
                    <Alert.Heading>Ууупсс...</Alert.Heading>
                    <p>
                        При виконанні запиту виникла помилка або запитуваного пацієнта не існує
                    </p>
                </Alert>
            )}
        </>
    );
}
