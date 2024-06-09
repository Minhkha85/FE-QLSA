import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function TongHopXuatAn() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [date, setDate] = useState('');
  const [totalMeals, setTotalMeals] = useState(0);
  const [mealsLeft, setMealsLeft] = useState(0);
  const [mealsConsumed, setMealsConsumed] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (date) {
      fetchMealsLeft(date);
    }
  }, [date]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:30006/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const fetchMealsLeft = async (date) => {
    try {
      const response = await axios.get(`http://localhost:30006/api/meal-total/${date}`);
      if (response.data) {
        const { totalMeals, mealsLeft } = response.data;
        const safeMealsLeft = Math.max(mealsLeft, 0);
        setTotalMeals(totalMeals);
        setMealsLeft(safeMealsLeft);
        setMealsConsumed(totalMeals - safeMealsLeft);
      } else {
        setTotalMeals(0);
        setMealsLeft(0);
        setMealsConsumed(0);
      }
    } catch (error) {
      console.error('Error fetching meals left', error);
      setTotalMeals(0);
      setMealsLeft(0);
      setMealsConsumed(0);
    }
  };
  

  const handleSetTotalMeals = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:30006/api/meal-total', { date, totalMeals });
      alert('Setup Phần ăn thành công');
      fetchMealsLeft(date);
    } catch (err) {
      console.error('Error setting total meals', err);
      alert('Setup Phần ăn thất bại');
    }
  };

  const deleteUser = async (manv) => {
    const isConfirmed = window.confirm('Bạn có muốn xóa không?');
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:30006/api/users/${manv}`);
        setUsers(users.filter(user => user.manv !== manv));
      } catch (error) {
        console.error('Error deleting user', error);
      }
    }
  };

  const deleteSelectedUsers = async () => {
    const isConfirmed = window.confirm('Bạn có muốn xóa các mục đã chọn không?');
    if (isConfirmed) {
      try {
        await Promise.all(selectedUsers.map(manv => axios.delete(`http://localhost:30006/api/users/${manv}`)));
        setUsers(users.filter(user => !selectedUsers.includes(user.manv)));
        setSelectedUsers([]);
        setSelectAll(false);
      } catch (error) {
        console.error('Error deleting selected users', error);
      }
    }
  };

  const handleSelectUser = (manv) => {
    if (selectedUsers.includes(manv)) {
      setSelectedUsers(selectedUsers.filter(id => id !== manv));
    } else {
      setSelectedUsers([...selectedUsers, manv]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.manv));
    }
    setSelectAll(!selectAll);
  };

  const exportToGoogleSheets = async () => {
    try {
      const response = await axios.post('http://localhost:30006/api/export', {
        startDate,
        endDate,
      });

      if (response.status === 200) {
        alert('Xuất dữ liệu thành công');
      } else {
        alert('Xuất dữ liệu thất bại');
      }
    } catch (error) {
      console.error('Error exporting users to Google Sheets', error);
      alert('Error exporting users to Google Sheets');
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const userDate = new Date(user.ngay);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (startDate && endDate) {
      return userDate >= start && userDate <= end;
    }
    if (startDate) {
      return userDate >= start;
    }
    if (endDate) {
      return userDate <= end;
    }
    return true;
  });

  return (
    <div className="main-content">
      <h2>Danh Sách Người Dùng</h2>
      <div className="tong-hop-xuat-an">
        <div className="filter-container">
          <label htmlFor="start-date">Từ ngày:</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={handleStartDateChange}
          />
          <label htmlFor="end-date">Đến ngày:</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={handleEndDateChange}
          />
          <button onClick={deleteSelectedUsers} className="delete-selected-button">Xóa Các Mục Đã Chọn</button>
          <button onClick={exportToGoogleSheets} className="export-button">Xuất Dữ Liệu</button>
        </div>

        <div className="meal-total-container">
          <h3>Tổng Số Người Tăng Ca Hôm Nay</h3>
          <form onSubmit={handleSetTotalMeals}>
            <label htmlFor="date">Chọn Ngày:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={handleDateChange}
              required
            />
            <label htmlFor="totalMeals">Setup Phần ăn:</label>
            <input
              type="number"
              id="totalMeals"
              value={totalMeals}
              onChange={(e) => setTotalMeals(e.target.value)}
              required
            />
            <button type="submit">Xác Nhận</button>
          </form>
          <p>Phần ăn còn lại: {mealsLeft} / {totalMeals}</p>
          <p>Phần ăn đã ăn: {mealsConsumed}</p>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Mã Nhân viên</th>
              <th>Họ Tên</th>
              <th>Ngày</th>
              <th>Xưởng</th>
              <th>Ghi Chú</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.manv)}
                    onChange={() => handleSelectUser(user.manv)}
                  />
                </td>
                <td>{user.manv}</td>
                <td>{user.hoten}</td>
                <td>{formatDate(user.ngay)}</td>
                <td>{user.xuong}</td>
                <td>{user.additionalInfo}</td>
                <td>{user.trangthai ? 'Đã Nhận' : 'Chưa nhận'}</td>
                <td>
                  <button onClick={() => deleteUser(user.manv)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TongHopXuatAn;
