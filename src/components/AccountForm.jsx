// AccountForm.js
import React, { useState } from 'react';
import Web3 from 'web3';
import './Account.css'
import image from "../images/img";

const AccountForm = ({ contract, account }) => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (contract) {
            const passwordHash = Web3.utils.sha3(form.password);
            await contract.methods.register(form.username, passwordHash).send({ from: account });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', form);
    };

    return (
        <div className='BG'>
         {/* <img src={image.img2} alt="Supreme Court" className="hero-image" />   */}
              <div className="acc-cont">
            <h2>Create an account</h2>
            <form onSubmit={handleRegister}>
                <label htmlFor="username">Your username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="JohnDoe"
                    value={form.username}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />

                <div className="terms">
                    <input
                        type="checkbox"
                        id="terms"
                        name="termsAccepted"
                        checked={form.termsAccepted}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="terms">I accept the <a href="#">Terms and Conditions</a></label>
                </div>

                <button type="submit">Create an account</button>
            </form>
        </div>
        </div>

    );
};

export default AccountForm;
