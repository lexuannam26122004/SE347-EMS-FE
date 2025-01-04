'use client'
import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'


const sections = [
    { label: 'Trang chủ', scrollPercentage: 0 },       
    { label: 'Giới thiệu', scrollPercentage: 30 },     
    { label: 'Lợi ích', scrollPercentage: 60 },        
    { label: 'Liên hệ', scrollPercentage: 100 }         
];

const Navbar: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setIsVisible(currentScrollPos <= prevScrollPos);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    const handleScrollToSection = (percentage: number) => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const targetScrollPos = (scrollHeight * percentage) / 100;
        window.scrollTo({
            top: targetScrollPos,
            behavior: 'smooth'
        });
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: isVisible ? '30px' : '-100px',
                left: '700px',
                width: '50%',
                height: '80px',
                backgroundColor: 'white',
                padding: '20px 40px',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '100px',
                background: 'white',
                boxShadow: '0 0 15px 5px rgba(3, 215, 148, 0.3)',
                transition: 'top 0.3s ease-in-out'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    fontSize: '24px'
                }}
            >
                <img
                    src='/images/logo.png'
                    alt='Logo'
                    style={{
                        width: 100,
                        marginRight: '10px',
                        objectFit: 'contain'
                    }}
                />
            </div>

            <ul
                style={{
                    listStyle: 'none',
                    display: 'flex',
                    gap: '30px'
                }}
            >
                {sections.map((section, index) => (
                    <li key={index}>
                        <a
                            style={{
                                textDecoration: 'none',
                                color: '#333',
                                fontSize: '16px',
                                fontWeight: '500',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleScrollToSection(section.scrollPercentage)}
                        >
                            {section.label}
                        </a>
                    </li>
                ))}
            </ul>

            <div
                style={{
                    display: 'flex',
                    gap: '20px',
                    paddingRight: '40px'
                }}
            >
                <button
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: '500',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: '#00b049',
                        color: 'white'
                    }}
                    onClick={() => router.push('/login')}
                >
                    Log In
                </button>
            </div>
        </div>
    );
};

export default function Home() {
    return (
        <Box
            sx={{
                backgroundImage: 'url(/images/Homepage.svg)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '505vh'
            }}
        >
            <Navbar />
        </Box>
    );
}
