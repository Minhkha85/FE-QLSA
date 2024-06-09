import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './Dashboard.css'; // Import the CSS file
import { Chart as ChartJS } from 'chart.js/auto';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [xuongData, setXuongData] = useState({ labels: [], values: [] });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [selectedDate, selectedMonth, selectedYear]);

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:30006/api/users');
      setUsers(response.data);
      processXuongData(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  // Process xuong data for the chart
  const processXuongData = (data) => {
    const filteredData = data.filter((user) => {
      const userDate = new Date(user.ngay);
      const userDay = userDate.getDate();
      const userMonth = userDate.getMonth() + 1;
      const userYear = userDate.getFullYear();

      const selectedDay = selectedDate ? new Date(selectedDate).getDate() : null;
      const selectedMonthVal = selectedMonth ? new Date(selectedMonth).getMonth() + 1 : null;
      const selectedYearVal = selectedYear ? new Date(selectedYear).getFullYear() : null;

      const matchDay = selectedDate ? userDay === selectedDay : true;
      const matchMonth = selectedMonth ? userMonth === selectedMonthVal : true;
      const matchYear = selectedYear ? userYear === selectedYearVal : true;

      return matchDay && matchMonth && matchYear;
    });

    const xuongCount = filteredData.reduce((acc, user) => {
      acc[user.xuong] = (acc[user.xuong] || 0) + 1;
      return acc;
    }, {});

    const xuongLabels = Object.keys(xuongCount);
    const xuongValues = Object.values(xuongCount);

    setXuongData({ labels: xuongLabels, values: xuongValues });
  };

  // Function to format date to dd/MM/yyyy
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Generate an array of colors
  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = `hsl(${(i * 360) / numColors}, 70%, 50%)`;
      colors.push(color);
    }
    return colors;
  };

  // Data for the bar chart
  const barData = {
    labels: xuongData.labels,
    datasets: [
      {
        label: 'Số lượng nhân viên theo xưởng',
        data: xuongData.values,
        backgroundColor: generateColors(xuongData.values.length),
        borderColor: generateColors(xuongData.values.length),
        borderWidth: 1,
        barPercentage: 0.9, // Adjust the width of the bars
        categoryPercentage: 1.0, // Adjust the spacing between the bars
      },
    ],
  };

  // Options for the bar chart
  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Get total users based on selected filters
  const totalFilteredUsers = users.filter((user) => {
    const userDate = new Date(user.ngay);
    const userDay = userDate.getDate();
    const userMonth = userDate.getMonth() + 1;
    const userYear = userDate.getFullYear();

    const selectedDay = selectedDate ? new Date(selectedDate).getDate() : null;
    const selectedMonthVal = selectedMonth ? new Date(selectedMonth).getMonth() + 1 : null;
    const selectedYearVal = selectedYear ? new Date(selectedYear).getFullYear() : null;

    const matchDay = selectedDate ? userDay === selectedDay : true;
    const matchMonth = selectedMonth ? userMonth === selectedMonthVal : true;
    const matchYear = selectedYear ? userYear === selectedYearVal : true;

    return matchDay && matchMonth && matchYear;
  }).length;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="filter-container">
        <label htmlFor="selected-date">Chọn ngày:</label>
        <input
          type="date"
          id="selected-date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <label htmlFor="selected-month">Chọn tháng:</label>
        <input
          type="month"
          id="selected-month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
        <label htmlFor="selected-year">Chọn năm:</label>
        <input
          type="number"
          id="selected-year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          min="1900"
          max="2100"
        />
      </div>
      <div className="summary-stats">
        <p>Tổng số người dùng: {totalFilteredUsers}</p>
      </div>
      <div className="chart">
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
