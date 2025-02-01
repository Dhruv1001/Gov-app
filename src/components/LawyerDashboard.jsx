import React, { useState, useEffect } from 'react';
import './lawyerdash.css';

const LawyerDashboard = () => {
    const [lawyerName, setLawyerName] = useState('');
    const [lawyerType, setLawyerType] = useState('');
    const [message, setMessage] = useState('');
    const [lawyers, setLawyers] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchLawyers();
    }, []);

    const fetchLawyers = async () => {
        try {
            const response = await fetch('http://localhost:5000/lawyers');
            if (response.ok) {
                const result = await response.json();
                setLawyers(result);
            } else {
                console.error('Failed to fetch lawyers');
            }
        } catch (error) {
            console.error('Error fetching lawyers:', error);
        }
    };

    const handleAddLawyer = async () => {
        if (!lawyerName || !lawyerType) {
            setMessage('Please enter both lawyer name and type');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/lawyers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: lawyerName, type: lawyerType })
            });

            if (response.ok) {
                setMessage('Lawyer added successfully');
                setLawyerName('');
                setLawyerType('');
                fetchLawyers();
            } else {
                const errorMessage = await response.text();
                setMessage(errorMessage);
            }
        } catch (error) {
            console.error('Error adding lawyer:', error);
            setMessage('Error adding lawyer');
        }
    };

    const handleShareFile = async (file) => {
        if (!file) {
            setMessage('No file selected');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/share-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileName: file.caseNumber })
            });

            if (response.ok) {
                const result = await response.json();
                setMessage(result.message);
                fetchLawyers(); // Refresh the list of lawyers
            } else {
                const errorMessage = await response.text();
                setMessage(errorMessage);
            }
        } catch (error) {
            console.error('Error sharing file:', error);
            setMessage('Error sharing file');
        }
    };

    const handleShareLawyer = async (lawyerId) => {
        try {
            const response = await fetch('http://localhost:5000/share-lawyer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lawyerId })
            });

            if (response.ok) {
                const result = await response.json();
                setMessage(result.message);
                fetchLawyers(); // Refresh the list of lawyers
            } else {
                const errorMessage = await response.text();
                setMessage(errorMessage);
            }
        } catch (error) {
            console.error('Error sharing lawyer:', error);
            setMessage('Error sharing lawyer');
        }
    };

    return (
        <div className="lawyer-container">
            <h1>Lawyer Dashboard</h1>

            <div>
                <label htmlFor="lawyerName">Lawyer Name:</label>
                <input
                    type="text"
                    id="lawyerName"
                    value={lawyerName}
                    onChange={(e) => setLawyerName(e.target.value)}
                />
                <label htmlFor="lawyerType">Lawyer Type:</label>
                <input
                    type="text"
                    id="lawyerType"
                    value={lawyerType}
                    onChange={(e) => setLawyerType(e.target.value)}
                />
                <button onClick={handleAddLawyer}>Add Lawyer</button>
            </div>

            {message && <p>{message}</p>}

            <h2>Lawyers</h2>
            <table className="lawyer-table">
                <thead>
                    <tr>
                        <th>Lawyer Name</th>
                        <th>Type</th>
                        <th>ID</th>
                        <th>State</th>
                        <th>Case Files</th>
                        {/* <th>Actions</th> */}
                    </tr>
                </thead>
                <tbody>
                    {lawyers.map(lawyer => (
                        <tr key={lawyer.id}>
                            <td>{lawyer.name}</td>
                            <td>{lawyer.type}</td>
                            <td>{lawyer.id}</td>
                            <td>{lawyer.state}</td>
                            <td>
                                <ul>
                                    {lawyer.caseFiles.map((file, index) => (
                                        <li key={index}>
                                            {/* Display the case number */}
                                            Case Number: {file.caseNumber}
                                            {/* Download PDF link */}
                                            <a href={`http://localhost:5000/files/${file.fileName}`} download>
                                                Download PDF
                                            </a>
                                            {/* Button to select file for sharing */}
                                            <button onClick={() => setSelectedFile(file)}>Share File</button>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            {/* <td>
                                <button onClick={() => handleShareLawyer(lawyer.id)}>Share</button>
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedFile && (
                <div>
                    <h3>Share Selected File</h3>
                    <button onClick={() => handleShareFile(selectedFile)}>Share File</button>
                </div>
            )}
        </div>
    );
};

export default LawyerDashboard;
