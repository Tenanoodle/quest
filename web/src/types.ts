export interface InboxItem {
  id: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  questId?: string;
  milestoneId?: string;
}

export interface Milestone {
  id: string;
  title: string;
  createdAt: string;
  questId: string;
  tasks: Task[];
}

export interface QuestProgress {
  done: number;
  total: number;
}

export interface Quest {
  id: string;
  title: string;
  description?: string;
  priority: number;
  dueDate?: string;
  createdAt: string;
  tasks: Task[];
  milestones: Milestone[];
  progress?: QuestProgress;
}
