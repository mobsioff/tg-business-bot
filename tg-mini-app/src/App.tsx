import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { DashboardPage } from '@/pages/DashboardPage';
import { LogsPage } from '@/pages/LogsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { initTelegram } from '@/utils/telegram';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    initTelegram();
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!loaded && (
          <LoadingScreen key="loader" onComplete={() => setLoaded(true)} />
        )}
      </AnimatePresence>

      {loaded && (
        <motion.div
          style={{ height: '100%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <HashRouter>
            <Layout>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/logs" element={<LogsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </AnimatePresence>
            </Layout>
          </HashRouter>
        </motion.div>
      )}
    </>
  );
}
