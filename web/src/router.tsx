import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import MissionControl from './pages/MissionControl';
import QuestDetail from './pages/QuestDetail';
import MasterQuest from './pages/MasterQuest';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <MissionControl />
      },
      {
        path: 'quest/:id',
        element: <QuestDetail />
      },
      {
        path: 'master/:id',
        element: <MasterQuest />
      }
    ]
  }
]);
