import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export default function Filters({
  niveaux,
  filieres,
  annees,
  groupes,
  niveau,
  filiere,
  annee,
  groupe,
  dateFilter,
  onNiveauChange,
  onFiliereChange,
  onAnneeChange,
  onGroupeChange,
  onDateChange,
}) {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Récupérer les données de l'utilisateur depuis localStorage ou sessionStorage
    const user = (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) || 
                 (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user'))) || 
                 { role: '' };

    setUserRole(user.role);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <select
        className="select select-bordered w-full"
        value={niveau}
        onChange={onNiveauChange}
      >
        <option value="">Niveau</option>
        {niveaux.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <select
        className="select select-bordered w-full"
        value={filiere}
        onChange={onFiliereChange}
      >
        <option value="">Filière</option>
        {filieres.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <select
        className="select select-bordered w-full"
        value={annee}
        onChange={onAnneeChange}
      >
        <option value="">Année</option>
        {annees.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <select
        className="select select-bordered w-full"
        value={groupe}
        onChange={onGroupeChange}
      >
        <option value="">Sélectionner le Groupe</option>
        {groupes.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      {/* Afficher le calendrier uniquement pour les formateurs */}
      {userRole !== 'admin' && (
        <div className="relative">
          <input
            type="date"
            className="input input-bordered w-full pr-10"
            value={dateFilter}
            onChange={onDateChange}
          />
          <Calendar
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      )}

      {/* Filtres supplémentaires pour l'Admin */}
      {userRole === 'admin' && (
        <>
          <div className="relative">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="CEF"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="CIN"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Nom"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Prénom"
            />
          </div>

          <select className="select select-bordered w-full">
            <option value="">Mois</option>
            <option value="all">Tous</option>
            <option value="january">Janvier</option>
            <option value="february">Février</option>
            <option value="march">Mars</option>
            <option value="april">Avril</option>
            <option value="may">Mai</option>
            <option value="june">Juin</option>
            <option value="july">Juillet</option>
            <option value="august">Août</option>
            <option value="september">Septembre</option>
            <option value="october">Octobre</option>
            <option value="november">Novembre</option>
            <option value="december">Décembre</option>
          </select>
        </>
      )}
    </div>
  );
}
