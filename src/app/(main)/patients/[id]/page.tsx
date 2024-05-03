"use client";
import React, {useState, useEffect, use} from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import {PatientService} from "@/shared/service/patient.service";
import {IPatient} from "@/shared/interface/patient/patient.interface";
import {IPage} from "@/shared/interface/page/page.interface";
import "@/css/styles.css";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Pagination from "react-bootstrap/Pagination";
import {useCallback} from "react";
import {useMemo} from "react";
import Spinner from 'react-bootstrap/Spinner';
import {formatDateToString} from '@/shared/utils/formatDateToString'


export default function PatientsPage() {

    const initialPatientsPageState: IPage<IPatient> = {
        content: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        number: 0,
        first: false,
        last: false,
    };

    const initialParamsState = useMemo(
        () => ({
            surname: "",
            name: "",
            middleName: "",
            birthDate: null,
            page: 0,
        }),
        []
    );

    const [patientPage, setPatientPage] = useState<IPage<IPatient>>(
        initialPatientsPageState
    );
    const [patientsCount, setPatientsCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [params, setParams] = useState(initialParamsState);

    const clearSearchParams = async () => {
        await fetchPatients(initialParamsState);
        setParams(initialParamsState);
    };

    const handleInputChange = (event: any) => {
        const {name, value} = event.target;
        setParams((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));
    };


    const handleFormSubmit = async (event: any) => {
        event.preventDefault();
        await fetchPatients(params);
    };

    const fetchPatients = useCallback(async (params: any) => {
        try {
            setLoading(true);
            const data = await PatientService.findAllPatients(params);
            setPatientPage(data);
        } catch (error) {
            console.error("Error fetching patient data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPatientsCount = useCallback(async () => {
        try {
            const count = await PatientService.countPatients();
            setPatientsCount(count);
        } catch (error) {
            console.error("Error fetching patient data:", error);
        } finally {
        }
    }, []);

    useEffect(() => {
        fetchPatientsCount();
        if (patientsCount > 0) {
            fetchPatients(initialParamsState);
        }
    }, [fetchPatientsCount, fetchPatients, initialParamsState, patientsCount]);

    return (
        <>
            <br></br>
            <Form onSubmit={handleFormSubmit}>
                <Row className="g-2">
                    <Col md>
                        <FloatingLabel controlId="name" label="Ім'я">
                            <Form.Control
                                type="text"
                                name="name"
                                value={params.name}
                                onChange={handleInputChange}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel
                            controlId="surname"
                            label="Прізвище"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                name="surname"
                                value={params.surname}
                                onChange={handleInputChange}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel
                            controlId="middleName"
                            label="По батькові"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                name="middleName"
                                value={params.middleName}
                                onChange={handleInputChange}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Stack direction="horizontal" gap={3}>
                    <Button
                        variant="link"
                        className="ms-auto text-secondary"
                        style={{textDecoration: "none"}}
                        onClick={clearSearchParams}
                    >
                        Очистити пошук
                    </Button>
                    <Button variant="primary" type="submit" className="d-grid col-3">
                        Пошук
                    </Button>
                </Stack>
            </Form>

            <br></br>
            {loading ? (
                <>
                    <div className="d-flex justify-content-center">
                        <Spinner animation="grow" role="status" variant="secondary">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>

                </>
            ) : patientPage && patientPage.content ? (
                <>
                    <Table striped>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Прізвище</th>
                            <th>{`Ім'я`}</th>
                            <th>По батькові</th>
                            <th>Дата народження</th>
                            <th>Дія</th>
                        </tr>
                        </thead>
                        <tbody>
                        {patientPage.content.map((patient, i) => (
                            <tr key={i}>
                                <td>{patient.id}</td>
                                <td>{patient.surname}</td>
                                <td>{patient.name}</td>
                                <td>{patient.middleName}</td>
                                <td>{formatDateToString(patient.birthDate)}</td>
                                <td>
                                    <a className="btn btn-primary" href="/" role="button">
                                        <i className="bi bi-eye"></i>
                                    </a>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                </>
            ) : (
                <p>No patient data available.</p>
            )}
        </>
    );
}
