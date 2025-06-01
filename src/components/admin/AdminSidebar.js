import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserFriends } from 'react-icons/fa';

function AdminSidebar() {
  const links = [
    // ...existing links...
    { path: '/admin/team', name: 'Team', icon: <FaUserFriends /> },
  ];

  return (
    <div className="admin-sidebar">
      <div className="p-4">
        <img 
          src="/logo-3d.png" 
          alt="Mentneo Admin" 
          className="h-10 w-auto mx-auto mb-4"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(104, 109, 224, 0.3))'
          }}
        />
      </div>
      <ul>
        {links.map((link) => (
          <li key={link.name}>
            <Link to={link.path}>
              {link.icon}
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminSidebar;