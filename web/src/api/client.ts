import axios from 'axios';
import { InboxItem, Quest, Task, Milestone } from '../types';

const api = axios.create({
  baseURL: '/api'
});

type QuestPayload = {
  title: string;
  description?: string;
  priority: number;
  dueDate?: string;
};

export const inboxApi = {
  list: async (): Promise<InboxItem[]> => {
    const { data } = await api.get<InboxItem[]>('/inbox');
    return data;
  },
  create: async (payload: { text: string }): Promise<InboxItem> => {
    const { data } = await api.post<InboxItem>('/inbox', payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/inbox/${id}`);
  },
  promote: async (
    id: string,
    payload: { questId?: string; questTitle?: string }
  ): Promise<Task> => {
    const { data } = await api.post<Task>(`/inbox/${id}/promote`, payload);
    return data;
  }
};

export const questsApi = {
  list: async (): Promise<(Quest & { progress: { done: number; total: number } })[]> => {
    const { data } = await api.get<(Quest & { progress: { done: number; total: number } })[]>(
      '/quests'
    );
    return data;
  },
  create: async (payload: QuestPayload): Promise<Quest> => {
    const { data } = await api.post<Quest>('/quests', payload);
    return data;
  },
  get: async (id: string): Promise<Quest & { progress: { done: number; total: number } }> => {
    const { data } = await api.get<Quest & { progress: { done: number; total: number } }>(
      `/quests/${id}`
    );
    return data;
  },
  update: async (id: string, payload: Partial<QuestPayload>): Promise<Quest> => {
    const { data } = await api.patch<Quest>(`/quests/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/quests/${id}`);
  },
  addMilestone: async (id: string, payload: { title: string }): Promise<Milestone> => {
    const { data } = await api.post<Milestone>(`/quests/${id}/milestones`, payload);
    return data;
  },
  addTask: async (id: string, payload: { title: string }): Promise<Task> => {
    const { data } = await api.post<Task>(`/quests/${id}/tasks`, payload);
    return data;
  }
};

export const milestonesApi = {
  remove: async (id: string) => {
    await api.delete(`/milestones/${id}`);
  },
  addTask: async (id: string, payload: { title: string }): Promise<Task> => {
    const { data } = await api.post<Task>(`/milestones/${id}/tasks`, payload);
    return data;
  }
};

export const tasksApi = {
  toggle: async (id: string): Promise<Task> => {
    const { data } = await api.patch<Task>(`/tasks/${id}/toggle`);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  }
};
