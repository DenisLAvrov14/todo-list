import { useState } from 'react';
import { motion } from 'framer-motion';
import './Navbar.css';

const tabs = [
    { label: 'Todo', icon: '✅' },
    { label: 'Statistic', icon: '📊' },
    { label: 'Map', icon: '🗺️' },
    { label: 'Social', icon: '👥' }
];

const Navbar = () => {
    const [selectedTab, setSelectedTab] = useState(tabs[0]);

    return (
        <>
            <div className="navbar">
                <nav>
                    <ul>
                        {tabs.map((item) => (
                            <li
                                key={item.label}
                                className={item === selectedTab ? 'selected' : ''}
                                onClick={() => setSelectedTab(item)}
                            >
                                <span className="icon">{item.icon}</span>
                                <span className="label">{item.label}</span>
                                {item === selectedTab ? (
                                    <motion.div className="underline" layoutId="underline" />
                                ) : null}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="main-content">
                <motion.div
                    key={selectedTab ? selectedTab.label : 'empty'}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Содержимое для {selectedTab.label} */}
                </motion.div>
            </div>
        </>
    );
};

export default Navbar;
