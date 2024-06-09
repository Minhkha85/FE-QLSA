import React from 'react';
import '../App.css';

function Nav() {
  return (
    <div className="navbar">
      <div className="navbar-header">
        <h1>Trang Admin</h1>
      </div>
      <ul className="navbar-nav">
        <li>
          <a href="/dashboard">Dashboard</a>
        </li>
        <li>
          <a href="/tuyendung">Tuyển dụng</a>
        </li>
        <li>
          <a href="/tonghopxuatan">Tổng hợp Suất ăn</a>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
