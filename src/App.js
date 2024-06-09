import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    manv: '',
    hoten: '',
    xuong: 'xuongA',
    additionalInfo: '',
    trangthai: false,
    ngay: ''
  });
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:30006/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'trangthai') {
      setIsCheckboxChecked(checked);
    }
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCheckboxChecked) {
      setShowAlert(true);
      return;
    }

    console.log("Dữ liệu form đang được gửi:", form);

    try {
      setIsButtonDisabled(true);
      await axios.post('http://localhost:30006/api/users', form);
      fetchUsers();
      setForm({
        manv: '',
        hoten: '',
        xuong: 'xuongA',
        additionalInfo: '',
        trangthai: false,
        ngay: ''
      });
      setSuccess(true);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 30006); // Re-enable the button after 5 seconds
    } catch (error) {
      console.error('Error adding user', error);
      setIsButtonDisabled(false);
    }
  };

  const handleBack = () => {
    setSuccess(false);
    setShowAlert(false);
    setErrorMessage('');
  };

  if (success) {
    return (
      <div className="success-message">
        Xác nhận thành công!
        <button onClick={handleBack}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit} className="my-form">
          <h2>Nhập thông tin người dùng</h2>
          <div className="form-group">
            <label htmlFor="manv">Mã Nhân Viên</label>
            <input
              type="text"
              id="manv"
              name="manv"
              pattern="[0-9]{4,}"
              title="Mã nhân viên nhập bằng số phải có ít nhất 4 chữ số"
              value={form.manv}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="hoten">Họ Và Tên</label>
            <input
              type="text"
              id="hoten"
              name="hoten"
              pattern="[A-Za-z\s\S]+"
              title="Họ tên chỉ chứa chữ cái và khoảng trắng"
              value={form.hoten}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ngay">Ngày</label>
            <input
              type="date"
              id="ngay"
              name="ngay"
              value={form.ngay}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="xuong">Xưởng</label>
            <select
              id="xuong"
              name="xuong"
              value={form.xuong}
              onChange={handleChange}
              required
            >
              <option value="">Chọn Xưởng</option>
              <option value="Xưởng 1">Xưởng 1</option>
              <option value="Xưởng 2">Xưởng 2</option>
              <option value="Xưởng 3">Xưởng 3</option>
              <option value="Xưởng 4">Xưởng 4</option>
              <option value="Xưởng Cắt">Xưởng Cắt</option>
              <option value="Kho phụ nguyên liệu">Kho phụ nguyên liệu</option>
              <option value="Kho thành phẩm">Kho thành phẩm</option>
              <option value="bộ phận cơ điện">Bộ phận cơ điện</option>
              <option value="phòng HCQT">Phòng HCQT</option>
              <option value="phòng Nhân sự">Phòng Nhân sự</option>
              <option value="phòng kế toán">Phòng kế toán</option>
              <option value="phòng KHSX">Phòng KHSX</option>
              <option value="phòng Công nghệ - Lean">Phòng Công nghệ - Lean</option>
              <option value="phòng QA">Phòng QA</option>
              <option value="phòng Kỹ thuật">Phòng Kỹ thuật</option>
            </select>
          </div>
          {(form.xuong === "Xưởng 1" || form.xuong === "Xưởng 2" || form.xuong === "Xưởng 3" || form.xuong === "Xưởng 4") && (
            <div className="form-group">
              <label htmlFor="additionalInfo">Nhập tổ</label>
              <input
                type="text"
                id="additionalInfo"
                name="additionalInfo"
                value={form.additionalInfo}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="trangthai">Trạng thái</label>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="trangthai"
                name="trangthai"
                checked={form.trangthai}
                onChange={handleChange}
              />
              <label htmlFor="trangthai">Đã nhận xuất ăn</label>
            </div>
          </div>
          <button type="submit" disabled={isButtonDisabled}>Xác Nhận</button>
          {showAlert && (
            <div className="alert">Bạn phải tick vào ô trạng thái!</div>
          )}
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}
        </form>
      </header>
    </div>
  );
}

export default App;
