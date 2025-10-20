import { Outlet } from 'react-router-dom';
import MissionLayout from './components/layout/MissionLayout';
import FloatingCaptureButton from './components/FloatingCaptureButton';
import QuickCapture from './components/QuickCapture';
import KeyboardShortcuts from './components/ui/KeyboardShortcuts';
import Toast from './components/ui/Toast';

const App = () => {
  return (
    <MissionLayout>
      <Outlet />
      <QuickCapture />
      <FloatingCaptureButton />
      <KeyboardShortcuts />
      <Toast />
    </MissionLayout>
  );
};

export default App;
