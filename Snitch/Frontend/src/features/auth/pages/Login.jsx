import React, { useState } from 'react';
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";

const Login = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin({
                email: formData.email,
                password: formData.password
            });
            navigate("/");
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1] font-sans selection:bg-[#FFD700] selection:text-[#131313] flex flex-col lg:flex-row">

            {/* Split Screen - Left Image Section (Hidden on mobile, visible on lg screens) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#131313] items-center justify-center overflow-hidden border-r border-[#1c1b1b]">
                <img
                    src="/snitch_editorial.png"
                    alt="Snitch Fashion Editorial"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:scale-105 transition-transform duration-[20s] ease-out"
                />

                {/* Gradient overlays to merge image nicely into the dark background */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0e0e0e] via-transparent to-transparent opacity-90"></div>
                <div className="absolute inset-0 bg-linear-to-r from-[#0e0e0e]/50 via-transparent to-[#0e0e0e] opacity-90"></div>

                <div className="relative z-10 p-16 flex flex-col h-full justify-between w-full max-w-2xl">
                    <h2 className="text-[#FFD700] text-xl font-bold tracking-widest uppercase">Snitch.</h2>

                    <div className="mt-auto">
                        <p className="text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1] text-white mb-6">
                            Welcome <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#e9c400] to-[#ffd700]">back.</span>
                        </p>
                        <p className="text-[#d0c6ab] max-w-md text-lg leading-relaxed">
                            Sign in to explore the latest exclusive drops and manage your aesthetic.
                        </p>
                    </div>
                </div>
            </div>

            {/* Split Screen - Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 min-h-screen overflow-y-auto z-10 bg-[#0e0e0e]">
                <div className="w-full max-w-md bg-[#131313] lg:bg-transparent p-10 md:p-14 lg:p-6 rounded-2xl lg:rounded-none shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] lg:shadow-none">
                    <div className="mb-12">
                        <h2 className="text-sm uppercase tracking-widest text-[#FFD700] font-medium mb-3">Sign in to Snitch</h2>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Enter the Vault</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="text-sm text-[#d0c6ab] mb-2 font-medium">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="bg-[#1c1b1b] lg:bg-[#0e0e0e] text-white border-b-2 border-[#4d4732] focus:border-[#FFD700] outline-none px-4 py-3 transition-colors duration-300 focus:bg-[#201f1f] lg:focus:bg-[#131313]"
                                placeholder="hello@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm text-[#d0c6ab] font-medium">Password</label>
                                <a href="#" className="text-xs text-[#999077] hover:text-[#FFD700] transition-colors">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="bg-[#1c1b1b] lg:bg-[#0e0e0e] text-white border-b-2 border-[#4d4732] focus:border-[#FFD700] outline-none px-4 py-3 transition-colors duration-300 focus:bg-[#201f1f] lg:focus:bg-[#131313]"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="mt-6 w-full bg-linear-to-r from-[#e9c400] to-[#ffd700] text-[#131313] font-bold tracking-wide py-4 px-8 rounded hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                        >
                            Sign In
                        </button>

                        <div className="text-center mt-6">
                            <a href="/register" className="text-sm text-[#999077] hover:text-[#FFD700] transition-colors border-b border-transparent hover:border-[#FFD700] py-0.5">
                                Don't have an account? Sign up
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;