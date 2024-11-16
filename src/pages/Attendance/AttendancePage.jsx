import React, { useState, useEffect } from 'react';
import Filters from './Filters';

export default function AttendancePage() {
  const [data, setData] = useState(null);
  const [niveaux, setNiveaux] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [niveau, setNiveau] = useState('');
  const [filiere, setFiliere] = useState('');
  const [annee, setAnnee] = useState('');
  const [groupe, setGroupe] = useState('');
  const [students, setStudents] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage or sessionStorage
    const user = (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) || 
                 (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user'))) || 
                 { name: '', role: '' };
    setCurrentUser(user);

    // Fetch attendance data
    const fetchData = async () => {
      try {
        const attendanceResponse = await fetch('http://localhost:3000/niveau');
        if (!attendanceResponse.ok) throw new Error('Failed to fetch attendance data');
        const result = await attendanceResponse.json();
        setData(result);
        
        // Set all filter options
        setNiveaux(Object.keys(result));
        setFilieres(getAllFilieres(result));
        setAnnees(getAllAnnees(result));
        setGroupes(getAllGroupes(result));
        
        // Set initial students
        setStudents(getAllStudents(result));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getAllFilieres = (data) => {
    const filieresSet = new Set();
    Object.values(data).forEach(niveau => {
      Object.keys(niveau).forEach(filiere => filieresSet.add(filiere));
    });
    return Array.from(filieresSet);
  };

  const getAllAnnees = (data) => {
    const anneesSet = new Set();
    Object.values(data).forEach(niveau => {
      Object.values(niveau).forEach(filiere => {
        Object.keys(filiere).forEach(annee => anneesSet.add(annee));
      });
    });
    return Array.from(anneesSet);
  };

  const getAllGroupes = (data) => {
    const groupesSet = new Set();
    Object.values(data).forEach(niveau => {
      Object.values(niveau).forEach(filiere => {
        Object.values(filiere).forEach(annee => {
          Object.keys(annee).forEach(groupe => groupesSet.add(groupe));
        });
      });
    });
    return Array.from(groupesSet);
  };

  const getAllStudents = (data) => {
    let allStudents = [];
    Object.entries(data).forEach(([niveauKey, niveauValue]) => {
      Object.entries(niveauValue).forEach(([filiereKey, filiereValue]) => {
        Object.entries(filiereValue).forEach(([anneeKey, anneeValue]) => {
          Object.entries(anneeValue).forEach(([groupeKey, students]) => {
            allStudents = allStudents.concat(students.map(student => ({
              ...student,
              niveau: niveauKey,
              filiere: filiereKey,
              annee: anneeKey,
              groupe: groupeKey
            })));
          });
        });
      });
    });
    return allStudents;
  };

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'niveau':
        setNiveau(value);
        break;
      case 'filiere':
        setFiliere(value);
        break;
      case 'annee':
        setAnnee(value);
        break;
      case 'groupe':
        setGroupe(value);
        break;
    }

    // Filter students based on all current filter values
    setStudents(getFilteredStudents(
      filterType === 'niveau' ? value : niveau,
      filterType === 'filiere' ? value : filiere,
      filterType === 'annee' ? value : annee,
      filterType === 'groupe' ? value : groupe
    ));
  };

  const handleDateChange = (e) => setDateFilter(e.target.value);

  const getFilteredStudents = (niveau, filiere, annee, groupe) => {
    if (!data) return [];
    
    return getAllStudents(data).filter(student => 
      (!niveau || student.niveau === niveau) &&
      (!filiere || student.filiere === filiere) &&
      (!annee || student.annee === annee) &&
      (!groupe || student.groupe === groupe)
    );
  };

  if (!currentUser) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Filters */}
      <Filters
        niveaux={niveaux}
        filieres={filieres}
        annees={annees}
        groupes={groupes}
        niveau={niveau}
        filiere={filiere}
        annee={annee}
        groupe={groupe}
        dateFilter={dateFilter}
        onNiveauChange={(e) => handleFilterChange('niveau', e.target.value)}
        onFiliereChange={(e) => handleFilterChange('filiere', e.target.value)}
        onAnneeChange={(e) => handleFilterChange('annee', e.target.value)}
        onGroupeChange={(e) => handleFilterChange('groupe', e.target.value)}
        onDateChange={handleDateChange}
      />

      {/* Render Table based on User Role */}
      {currentUser.role === 'admin' ? (
        // ADMIN Table
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          {students.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4">CEF</th>
                  <th className="py-2 px-4">Full Name</th>
                  <th className="py-2 px-4">Niveau</th>
                  <th className="py-2 px-4">Filière</th>
                  <th className="py-2 px-4">Année</th>
                  <th className="py-2 px-4">Groupe</th>
                  <th className="py-2 px-4">Nombre Absences</th>
                  <th className="py-2 px-4">Nombre Retards</th>
                  <th className="py-2 px-4">Sanctions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.cef} className="hover:bg-gray-100">
                    <td className="py-2 px-4">{student.cef}</td>
                    <td className="py-2 px-4">{student.fullname}</td>
                    <td className="py-2 px-4">{student.niveau}</td>
                    <td className="py-2 px-4">{student.filiere}</td>
                    <td className="py-2 px-4">{student.annee}</td>
                    <td className="py-2 px-4">{student.groupe}</td>
                    <td className="py-2 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        className="block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-2 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        className="block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-2 px-4 text-center">
                      <select className="block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Aucune</option>
                        <option value="avertissement">Avertissement</option>
                        <option value="blame">Blâme</option>
                        <option value="exclusion">Exclusion</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4">Aucun étudiant trouvé pour ces critères.</p>
          )}
        </div>
      ) : currentUser.role === 'trainer' ? (
        // TRAINER Table
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full">
            <thead>
              <tr>
                <th>CEF</th>
                <th>Full Name</th>
                <th>Niveau</th>
                <th>Filière</th>
                <th>Année</th>
                <th>Groupe</th>
                <th>Sanction</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.cef}>
                    <td>{student.cef}</td>
                    <td>{student.fullname}</td>
                    <td>{student.niveau}</td>
                    <td>{student.filiere}</td>
                    <td>{student.annee}</td>
                    <td>{student.groupe}</td>
                    <td>
                      <select className="block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Aucune</option>
                        <option value="avertissement">Avertissement</option>
                        <option value="blame">Blâme</option>
                        <option value="exclusion">Exclusion</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">Aucun étudiant trouvé pour ces critères.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-4">Role not recognized.</p>
      )}
    </div>
  );
}