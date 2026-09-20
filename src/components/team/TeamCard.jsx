import React from 'react';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function TeamCard({ member }) {
  const { playDialTick } = useViewfinder();

  return (
    <div
      className="team-card"
      data-category={member.category}
      onClick={playDialTick}
    >
      <div className="team-img-wrapper">
        <img
          src={member.photo}
          alt={`${member.name} - ${member.role}`}
          className="team-photo"
          loading="lazy"
          decoding="async"
        />
        <span className={`team-role-badge badge-${member.category}`}>
          {member.category === 'board' ? 'BOARD OF DIRECTORS' : 'CORE TEAM'}
        </span>
        <div className="team-overlay-telemetry">
          <span>CORE ID: {member.coreId}</span>
          <span>{member.subRole}</span>
        </div>
      </div>
      <div className="team-content">
        <div className="team-header-row">
          <h3 className="team-name">{member.name}</h3>
          <span className="team-sub-badge">{member.subRole}</span>
        </div>
        <p className="team-designation">{member.role} • Obscura Collective</p>
        <p className="team-bio">{member.bio}</p>
        <div className="team-specs">
          {member.specs.map((spec, i) => (
            <span key={i} className="spec-tag">{spec}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
